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