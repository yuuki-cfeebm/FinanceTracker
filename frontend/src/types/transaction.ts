export type Transaction = {
  id: string
  valueType: string
  value: number
  category?: string
  description?: string
  createdAt: Date
}
