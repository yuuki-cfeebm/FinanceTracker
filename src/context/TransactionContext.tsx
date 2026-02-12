'use client'
import { Transaction } from "@/types/transaction";
import { ReactNode, useContext, createContext, useState, useEffect, use } from "react";

interface TransactionContextType {
  transaction: Transaction[],
  addTransaction: (transaction: Transaction) => void,
  cancelTransaction: () => void
}

const TransactionContext = createContext<TransactionContextType | null>(null)

export function TransactionProvider({ children }: {children: ReactNode}) {

  const [isLoaded, setIsLoaded] = useState(false)
  const [transaction, setTransaction] = useState<Transaction[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('transaction')
    if(stored) {
      try {
        const dados = JSON.parse(stored)

        const dateFormated = dados.map((transaction: Transaction) => ({
          ...transaction,
          createdAt: new Date(transaction.createdAt)
        })) 
        setTransaction(dateFormated)
      } catch (err) {
        console.error("Erro ao carregar: ", err)
      }
    } 
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem("transaction", JSON.stringify(transaction))
    }
  },[transaction, isLoaded])

  function addTransaction(transaction: Transaction) {
    setTransaction(prev => [...prev, transaction])
    console.log("gasto", transaction)
  }

  function cancelTransaction() {
    return transaction
  }

  return (
    <TransactionContext.Provider value={{transaction, addTransaction, cancelTransaction}}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransaction() {
  const context = useContext(TransactionContext)
  if(!context) throw new Error("Deve ser usado dentro de TransactionProvider")
    return context
}

