"use client"
import { useTransaction } from "@/context/TransactionContext"
import TransactionItem from "./TransactionItem"


export default function Historico() {

  const { transaction } = useTransaction()

  return(
    <div className="flex flex-col items-center">
      <h1>Histórico de Transações</h1>
      <div className="w-2/3 flex flex-col gap-4">
        {transaction.map(transaction => 
        (  
          <TransactionItem key={transaction.id} transaction={transaction}/>

        )
        )}
      </div>
    </div>
  )
}