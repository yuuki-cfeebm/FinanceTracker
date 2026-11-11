"use client"
import { Transaction } from "@/types/transaction"
import { ReactNode, useContext, createContext, useState, useEffect } from "react"
import { toast } from "sonner"
import {
  ApiTransaction,
  listTransactions,
  createTransaction,
} from "@/services/transactions"

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (data: Omit<Transaction, "id">) => Promise<boolean>
  cancelTransaction: () => void
  isLoading: boolean
}

const TransactionContext = createContext<TransactionContextType | null>(null)

function toTransaction(item: ApiTransaction): Transaction {
  return {
    id: item.id,
    value: item.value,
    valueType: item.valueType,
    description: item.description,
    category: item.category,
    createdAt: new Date(item.date),
  }
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await listTransactions()
        setTransactions(data.map(toTransaction))
      } catch (err) {
        console.error("Error loading from API:", err)
        const stored = localStorage.getItem("transactions")
        if (stored) {
          const parsed = JSON.parse(stored) as Transaction[]
          setTransactions(
            parsed.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }))
          )
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [transactions, isLoading])

  async function addTransaction(data: Omit<Transaction, "id">): Promise<boolean> {
    try {
      const created = await createTransaction({
        description: data.description || "No description",
        value: data.value,
        valueType: data.valueType,
        category: data.category || "Other",
        date: data.createdAt.toISOString(),
      })

      setTransactions((prev) => [...prev, toTransaction(created)])
      toast.success("Transaction saved successfully!", { position: "bottom-right" })
      return true
    } catch (error) {
      console.error(error)
      toast.error("Error communicating with the server", { position: "bottom-right" })
      return false
    }
  }

  function cancelTransaction() {
    toast.success("Transaction canceled!", { position: "bottom-right" })
  }

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, cancelTransaction, isLoading }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransaction() {
  const context = useContext(TransactionContext)
  if (!context) throw new Error("useTransaction must be used inside TransactionProvider")
  return context
}