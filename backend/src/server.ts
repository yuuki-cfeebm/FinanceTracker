import 'dotenv/config';
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from 'multer';
import { ApiError, Type } from '@google/genai';
import { AllModelsFailedError, checkConfiguredModels, generateWithFallback } from './gemini.js';
import { randomUUID } from "crypto";

type TransactionType = "entrada" | "saida";

interface Transaction {
  id: string;
  description: string;
  value: number;
  valueType: TransactionType;
  category: string;
  date: string;
}

type CreateTransactionBody = Omit<Transaction, "id">;

const VALID_TYPES: TransactionType[] = ["entrada", "saida"];

const app = express();
const PORT = 3333;
const transactions: Transaction[] = [];

app.use(cors());
app.use(express.json());

// Mesmos ids de frontend/src/data/categories.ts — mantenha os dois em sincronia
const EXPENSE_CATEGORIES = ["alimentacao", "transporte", "casa", "saude", "educacao", "lazer", "cartao"];

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ACCEPTED_MIME_TYPES.includes(file.mimetype));
  },
});

// Confere no início se os modelos configurados existem para a chave do .env
checkConfiguredModels();

// Rota de teste
app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Finance Tracker API is running!" });
});

// Listar transações (GET /transactions)
app.get("/transactions", (req: Request, res: Response) => {
  return res.json(transactions);
});

// Criar transação manual (POST /transactions)
app.post("/transactions", (req: Request, res: Response) => {
  const { description, value, valueType, category, date } =
    req.body as Partial<CreateTransactionBody>;

  const numericValue = Number(value);

  if (!description || isNaN(numericValue)) {
    return res
      .status(400)
      .json({ error: "Description and a valid numeric value are required." });
  }

  if (!valueType || !VALID_TYPES.includes(valueType)) {
    return res
      .status(400)
      .json({ error: 'valueType must be "entrada" or "saida".' });
  }

  const newTransaction: Transaction = {
    id: randomUUID(),
    description,
    value: numericValue,
    valueType,
    category: category || "Other",
    date: date || new Date().toISOString(),
  };

  transactions.push(newTransaction);
  return res.status(201).json(newTransaction);
});

// Roda o multer dentro da rota para devolver os erros dele em JSON
function receiveReceipt(req: Request, res: Response, next: NextFunction) {
  upload.single('comprovante')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'O arquivo passa de 5MB.' });
    }
    if (err) {
      return res.status(400).json({ error: 'Não foi possível receber o arquivo.' });
    }
    next();
  });
}

// Lê o comprovante com IA e devolve os dados para o front PRÉ-PREENCHER o formulário.
// Não salva nada: quem salva é o POST /transactions, depois que o usuário confere.
app.post('/transactions/comprovante', receiveReceipt, async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Envie uma imagem (JPG, PNG, WEBP, HEIC) ou um PDF.' });
    }

    const base64Image = req.file.buffer.toString('base64');

    // Tenta os modelos em ordem até um responder (ver src/gemini.ts)
    const { response, model } = await generateWithFallback({
      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image,
          },
        },
        'Analise este comprovante fiscal/pagamento e extraia os dados essenciais da transação.',
      ],
      config: {
        responseMimeType: 'application/json', //Faz o modelo de IA retornar apenas dados em JSON
        responseSchema: { // funciona como uma tipagem
          type: Type.OBJECT, // retorno vai ser do tipo objeto
          properties: { //aqui temos os atributos do nosso objeto
            descricao: { //atributo
              type: Type.STRING, //tipo
              description: 'Nome do estabelecimento, loja ou pessoa recebedora' //o que a IA deve fazer
            },
            valor: { 
              type: Type.NUMBER, 
              description: 'Valor total pago na transação' 
            },
            categoria: {
              type: Type.STRING,
              format: 'enum',
              enum: EXPENSE_CATEGORIES,
              description: 'Categoria do gasto. Mercado, restaurante e delivery = alimentacao; fatura de cartão = cartao; aluguel, luz, água, internet = casa.'
            },
            data: { 
              type: Type.STRING, 
              description: 'Data do pagamento no formato YYYY-MM-DD' 
            },
          },
          required: ['descricao', 'valor', 'categoria', 'data'],
        },
      },
    });

    console.log(`[gemini] comprovante lido com ${model}`);

    const dadosExtraidos = JSON.parse(response.text || '{}');
    const value = Math.abs(Number(dadosExtraidos.valor));

    if (!value) {
      return res.status(422).json({ error: 'Não encontramos um valor nesse comprovante. Tente uma foto mais nítida.' });
    }

    const category = EXPENSE_CATEGORIES.includes(dadosExtraidos.categoria) ? dadosExtraidos.categoria : null;
    const date = /^\d{4}-\d{2}-\d{2}$/.test(dadosExtraidos.data ?? '') ? dadosExtraidos.data : null;

    // Valor sempre positivo; o front aplica o sinal de saída ao salvar
    return res.json({
      description: dadosExtraidos.descricao || '',
      value,
      category,
      date,
    });
  } catch (error) {
    if (error instanceof AllModelsFailedError) {
      console.error('[gemini]', error.message);
      return res.status(503).json({
        error: 'A leitura por IA está indisponível agora (alta demanda). Tente de novo em alguns instantes ou preencha manualmente.',
      });
    }

    if (error instanceof ApiError && error.status === 400) {
      console.error('[gemini] requisição recusada:', error.message);
      return res.status(422).json({ error: 'Não conseguimos ler esse arquivo. Tente outra foto ou um PDF.' });
    }

    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      console.error('[gemini] chave inválida ou sem permissão:', error.message);
      return res.status(500).json({ error: 'A IA não está configurada corretamente no servidor.' });
    }

    if (error instanceof SyntaxError) {
      console.error('[gemini] resposta não era JSON válido:', error.message);
      return res.status(422).json({ error: 'A IA não conseguiu interpretar esse comprovante. Tente outra foto.' });
    }

    console.error('Erro ao processar comprovante com Gemini:', error);
    return res.status(500).json({ error: 'Falha ao analisar comprovante com IA.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});