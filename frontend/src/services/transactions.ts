import { TransactionType } from "@/types/transaction"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface ApiTransaction {
  id: string
  description: string
  value: number
  valueType: TransactionType
  category: string
  date: string
}

export type CreateTransactionPayload = Omit<ApiTransaction, "id">

export async function listTransactions(): Promise<ApiTransaction[]> {
  const response = await fetch(`${API_URL}/transactions`)

  if (!response.ok) {
    throw new Error("Failed to fetch transactions from the server")
  }

  return response.json()
}

export async function createTransaction(
  transaction: CreateTransactionPayload
): Promise<ApiTransaction> {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  })

  if (!response.ok) {
    throw new Error("Failed to create transaction on the server")
  }

  return response.json()
}

/** Dados lidos do comprovante pela IA. `value` vem sempre positivo. */
export interface ReceiptData {
  description: string
  value: number
  /** id de categoria do front, ou null se a IA não conseguiu classificar */
  category: string | null
  /** "YYYY-MM-DD" ou null */
  date: string | null
}

export async function extractReceipt(file: File, signal?: AbortSignal): Promise<ReceiptData> {
  const body = new FormData()
  body.append("comprovante", file)

  const response = await fetch(`${API_URL}/transactions/comprovante`, {
    method: "POST",
    body,
    signal,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error ?? "Não foi possível ler o comprovante.")
  }

  return response.json()
}
