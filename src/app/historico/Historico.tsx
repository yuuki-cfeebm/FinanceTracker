"use client"
import { useTransaction } from "@/context/TransactionContext"
import TransactionItem from "./TransactionItem"
import CategoryFilter from "../filtros/CategoryFilter"
import { useFilter } from "@/context/FilterContext"
import FilterMarked from "../filtros/CategoryMarked"
import { categories } from "@/data/categories"
import { DateFilter } from "../filtros/DateFilter"
import OrderBy from "../filtros/OrderBy"
import { DateRange } from "react-day-picker"


export default function Historico() {

  const { transaction } = useTransaction()
  const { orderBy, dateRange, categoriesSelected, handleCheckbox, isInDateRange } = useFilter()

  const transactionsFiltered = transaction
  .filter(transac => {
    if(categoriesSelected.length === 0) return true

    if(!transac.category) return false

    return categoriesSelected.includes(transac.category)
  })
  .filter(transac => 
    isInDateRange(transac.createdAt, dateRange)
  ).sort((a, b) => {
    const timeA = a.createdAt.getTime()
    const timeB = b.createdAt.getTime()

    if (orderBy === "recente") {
      return timeB - timeA
    }

    if (orderBy === "antigo") {
      return timeA - timeB
    }
    return 0
  })

  return(
    <div className="flex flex-col items-center">
      <h1>Histórico de Transações</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-gray-400">Filtros: </span>
          <div className="flex justify-between items-center">
              <CategoryFilter />
            <div className="flex gap-4 items-center">
              <DateFilter />
              <OrderBy />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-100 gap-1"> 
          <span className="text-gray-400">Filtros Ativos:</span>
          <div className="flex gap-4">
            {categoriesSelected.length === 0 ? (
              <div className="flex items-center gap-1 shadow bg-white p-2 rounded-md border-slate-300 hover:bg-slate-100 transition cursor-pointer text-gray-600">Nenhum filtro ativo</div>
            ):(
              categoriesSelected.map(catSelec => {
                const categoryInfo = categories.find(cat => cat.id === catSelec)
                return(
                <FilterMarked key={catSelec} filterName={categoryInfo?.name} onClick={() => handleCheckbox(catSelec)} color={categoryInfo?.color}/>
                )
              }
            ))}
            
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          {transactionsFiltered.map(transaction => 
          (  
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction}
            />
          )
          )}
        </div>
      </div>
    </div>
  )
}