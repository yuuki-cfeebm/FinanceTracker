"use client"
import { extractReceipt, ReceiptData } from "@/services/transactions"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, FileText, Loader2, RotateCcw, ScanLine, X } from "lucide-react"
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react"

const MAX_SIZE = 5 * 1024 * 1024 // mesmo limite do multer no backend
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"]

type Status = "idle" | "loading" | "success" | "error"

interface ReceiptUploadProps {
  /** Chamado com os dados lidos; o formulário decide o que preencher. */
  onExtracted: (data: ReceiptData) => void
  disabled?: boolean
}

export default function ReceiptUpload({ onExtracted, disabled }: ReceiptUploadProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Libera a URL da miniatura e cancela a leitura se o componente sair da tela
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => () => abortRef.current?.abort(), [])

  function validate(f: File) {
    if (!ACCEPTED.includes(f.type)) return "Formato não suportado. Envie JPG, PNG, WEBP, HEIC ou PDF."
    if (f.size > MAX_SIZE) return "O arquivo passa de 5MB."
    return null
  }

  async function readFile(f: File) {
    const problem = validate(f)
    setFile(f)
    setPreview(f.type.startsWith("image/") && f.type !== "image/heic" && f.type !== "image/heif" ? URL.createObjectURL(f) : null)

    if (problem) {
      setError(problem)
      setStatus("error")
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus("loading")
    setError("")

    try {
      const data = await extractReceipt(f, controller.signal)
      if (controller.signal.aborted) return
      onExtracted(data)
      setStatus("success")
    } catch (err) {
      if (controller.signal.aborted) return
      setError(err instanceof Error ? err.message : "Não foi possível ler o comprovante.")
      setStatus("error")
    }
  }

  function clear() {
    abortRef.current?.abort()
    setFile(null)
    setPreview(null)
    setError("")
    setStatus("idle")
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) readFile(f)
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const f = e.dataTransfer.files?.[0]
    if (f) readFile(f)
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED.join(",")}
      className="sr-only"
      onChange={handleChange}
      disabled={disabled || status === "loading"}
    />
  )

  // Estado inicial: área para soltar/clicar
  if (status === "idle" || !file) {
    return (
      <label
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 transition sm:p-4",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
          dragging ? "border-brand bg-brand/5" : "hover:border-brand/50 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {input}
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <ScanLine className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-medium">Tem um comprovante?</span>
          <span className="text-xs text-muted-foreground">
            {dragging ? "Solte o arquivo aqui" : "Envie a foto ou o PDF e preenchemos os campos pra você"}
          </span>
        </span>
        <span className="ml-auto hidden shrink-0 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium shadow-xs transition group-hover:bg-muted sm:block">
          Escolher arquivo
        </span>
      </label>
    )
  }

  // Com arquivo: miniatura + status
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 sm:p-4",
        status === "success" && "border-teal-500/40 bg-teal-500/5",
        status === "error" && "border-rose-500/40 bg-rose-500/5"
      )}
      aria-live="polite"
    >
      {input}
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Miniatura do comprovante" className="size-full object-cover" />
        ) : (
          <FileText className="size-5 text-muted-foreground" />
        )}
        {status === "loading" && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-5 animate-spin text-brand" />
          </span>
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        {status === "loading" && (
          <>
            <span className="text-sm font-medium">Lendo comprovante…</span>
            <span className="text-xs text-muted-foreground">Isso leva alguns segundos</span>
          </>
        )}
        {status === "success" && (
          <>
            <span className="flex items-center gap-1.5 text-sm font-medium text-teal-700 dark:text-teal-400">
              <CheckCircle2 className="size-4" /> Campos preenchidos
            </span>
            <span className="text-xs text-muted-foreground">Confira os dados abaixo antes de salvar</span>
          </>
        )}
        {status === "error" && (
          <>
            <span className="flex items-center gap-1.5 text-sm font-medium text-rose-700 dark:text-rose-400">
              <AlertCircle className="size-4 shrink-0" /> Não deu para ler
            </span>
            <span className="text-xs text-muted-foreground">{error}</span>
          </>
        )}
        <span className="truncate text-xs text-muted-foreground/80">{file.name}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {status === "error" && !validate(file) && (
          <button
            type="button"
            onClick={() => readFile(file)}
            aria-label="Tentar de novo"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={clear}
          aria-label={status === "loading" ? "Cancelar leitura" : "Remover comprovante"}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
