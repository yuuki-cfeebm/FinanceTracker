import { ApiError, GenerateContentParameters, GenerateContentResponse, GoogleGenAI } from '@google/genai';

// Ordem de preferência. Sobrescreva no .env com:
// GEMINI_MODELS=gemini-3.8-flash,gemini-3.7-flash,gemini-3.5-flash
const DEFAULT_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
];

export const GEMINI_MODELS = (process.env.GEMINI_MODELS ?? '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

if (GEMINI_MODELS.length === 0) GEMINI_MODELS.push(...DEFAULT_MODELS);

/** Tempo máximo esperando cada modelo antes de tentar o próximo. */
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 15_000;

/**
 * Erros em que vale tentar outro modelo:
 * 404 modelo não existe/foi desativado · 408 timeout · 429 limite de uso
 * 500/502/503/504 instabilidade ou "alta demanda"
 */
const RETRYABLE = new Set([404, 408, 429, 500, 502, 503, 504]);

/** Quanto tempo um modelo que falhou fica fora da fila (ms). */
function cooldownFor(status: number) {
  if (status === 404) return 60 * 60_000; // desativado: 1h
  if (status === 429) return 5 * 60_000; // cota: 5min
  return 60_000; // sobrecarga/timeout: 1min
}

const cooldownUntil = new Map<string, number>();

const ai = new GoogleGenAI();

export type ModelFailure = { model: string; status: number; message: string };

/** Todos os modelos falharam com erros temporários. */
export class AllModelsFailedError extends Error {
  constructor(public failures: ModelFailure[]) {
    super(`Todos os modelos falharam: ${failures.map((f) => `${f.model} (${f.status})`).join(', ')}`);
  }
}

/** Modelos disponíveis primeiro (na ordem configurada); os de castigo vão pro fim como última tentativa. */
function modelQueue() {
  const now = Date.now();
  const ready = GEMINI_MODELS.filter((m) => (cooldownUntil.get(m) ?? 0) <= now);
  const cooling = GEMINI_MODELS.filter((m) => (cooldownUntil.get(m) ?? 0) > now);
  return [...ready, ...cooling];
}

function statusOf(error: unknown) {
  if (error instanceof ApiError) return error.status;
  if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) return 408;
  return undefined;
}

/**
 * generateContent com fallback: tenta cada modelo da lista até um responder.
 * Lança o erro original se ele não for resolvível trocando de modelo (ex.: 400, 401).
 */
export async function generateWithFallback(
  request: Omit<GenerateContentParameters, 'model'>
): Promise<{ response: GenerateContentResponse; model: string }> {
  const failures: ModelFailure[] = [];

  for (const model of modelQueue()) {
    try {
      const response = await ai.models.generateContent({
        ...request,
        model,
        config: { ...request.config, abortSignal: AbortSignal.timeout(TIMEOUT_MS) },
      });
      cooldownUntil.delete(model);
      if (failures.length) console.info(`[gemini] respondeu com ${model} depois de ${failures.length} falha(s)`);
      return { response, model };
    } catch (error) {
      const status = statusOf(error);
      if (status === undefined || !RETRYABLE.has(status)) throw error;

      const message = error instanceof Error ? error.message : String(error);
      failures.push({ model, status, message });
      cooldownUntil.set(model, Date.now() + cooldownFor(status));
      console.warn(`[gemini] ${model} falhou (${status}), tentando o próximo…`);
    }
  }

  throw new AllModelsFailedError(failures);
}

/** Avisa no terminal se algum modelo configurado não existe para essa chave. */
export async function checkConfiguredModels() {
  try {
    const available = new Set<string>();
    for await (const model of await ai.models.list()) {
      if (model.name && model.supportedActions?.includes('generateContent')) {
        available.add(model.name.replace(/^models\//, ''));
      }
    }
    const missing = GEMINI_MODELS.filter((m) => !available.has(m));
    console.log(`[gemini] ordem dos modelos: ${GEMINI_MODELS.join(' → ')}`);
    if (missing.length) console.warn(`[gemini] não disponíveis para essa chave: ${missing.join(', ')}`);
  } catch (error) {
    console.warn('[gemini] não foi possível listar os modelos:', error instanceof Error ? error.message : error);
  }
}
