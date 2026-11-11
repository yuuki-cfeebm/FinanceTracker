import express, { Request, Response } from "express"
import cors from "cors"
import { randomUUID } from "crypto"

type TransactionType = "entrada" | "saida"

interface Transaction {
  id: string
  description: string
  value: number
  valueType: TransactionType
  category: string
  date: string
}

type CreateTransactionBody = Omit<Transaction, "id">

const VALID_TYPES: TransactionType[] = ["entrada", "saida"]

const app = express()
const PORT = 3333
const transactions: Transaction[] = []

app.use(cors())
app.use(express.json())

// teste
app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Finance Tracker API is running!" })
})

// list transactions
app.get("/transactions", (req: Request, res: Response) => {
  return res.json(transactions)
})

// create transaction
app.post("/transactions", (req: Request, res: Response) => {
  const { description, value, valueType, category, date } =
    req.body as Partial<CreateTransactionBody>

  const numericValue = Number(value)

  if (!description || isNaN(numericValue)) {
    return res
      .status(400)
      .json({ error: "Description and a valid numeric value are required." })
  }

  if (!valueType || !VALID_TYPES.includes(valueType)) {
    return res
      .status(400)
      .json({ error: 'valueType must be "income" or "expense".' })
  }

  const newTransaction: Transaction = {
    id: randomUUID(),
    description,
    value: numericValue,
    valueType,
    category: category || "Other",
    date: date || new Date().toISOString(),
  }

  transactions.push(newTransaction)
  return res.status(201).json(newTransaction)
})

app.listen(PORT, () => {
  console.log(`rodando em http://localhost:${PORT}`)
})