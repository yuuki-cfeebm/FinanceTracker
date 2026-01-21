'use client'
import { Gain, Expense } from "@/types/transaction";
import { ReactNode, useContext, createContext, useState } from "react";

interface TransactionContextType {
  expense: Expense[],
  gain: Gain[],
  addExpense: (transaction: Expense) => void,
  cancelTransaction: () => void
  addGain: (gain: Gain) => void
}

const TransactionContext = createContext<TransactionContextType | null>(null)

export function TransactionProvider({ children }: {children: ReactNode}) {

  const [expense, setExpense] = useState<Expense[]>([])
  const [gain, setGain] = useState<Gain[]>([])

  function addExpense(expense: Expense) {
    setExpense(prev => [...prev, expense])
    console.log("gasto", expense)
  }

  function addGain(gain: Gain) {
    setGain(prev => [...prev, gain])
    console.log("ganho", gain)

  }

  function cancelTransaction() {
    return expense
  }

  return (
    <TransactionContext.Provider value={{gain, expense, addExpense, cancelTransaction, addGain}}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransaction() {
  const context = useContext(TransactionContext)
  if(!context) throw new Error("Deve ser usado dentro de TransactionProvider")
  return context
}

