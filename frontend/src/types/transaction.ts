export type TransactionType = "entrada" | "saida"

export type Transaction = {
  id: string
  valueType: TransactionType
  value: number
  category?: string
  description?: string
  createdAt: Date
}