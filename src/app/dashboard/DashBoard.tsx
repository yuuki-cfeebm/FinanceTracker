"use client"
import { useTransaction } from "@/context/TransactionContext";
import { DateFilter } from "../filtros/DateFilter";
import { PieExample } from "./PieChart";
import Profit from "./Profit";
import Summary from "./Summary";
import { useFilter } from "@/context/FilterContext";
import { useMemo } from "react";
import { categories, pieChartColors } from "@/data/categories";
import Balance from "./Balance";
import Expenses from "./Expenses";
import ExpensiveCategory from "./ExpensiveCategory";
import TitlePage from "@/components/TitlePage";

export default function DashBoard() {

  const {transaction} = useTransaction()
  const {dateRange, isInDateRange}   = useFilter()
  
  const transactionsDateFiltered = transaction.filter((transac) => isInDateRange(transac.createdAt, dateRange))
  
  const profits = transactionsDateFiltered.filter((transac) => transac.valueType === "entrada")
  const expenses = transactionsDateFiltered.filter((transac) => transac.valueType === "saida")

  const totalProfits = useMemo(() => {
    return profits.reduce((acc, curr) => acc + Number(curr.value), 0)
  }, [profits])
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + Number(curr.value), 0)
  }, [expenses])

  const balance = totalProfits + totalExpenses

  const chartData = useMemo(() => {
    if(!transactionsDateFiltered.length) return []
    return transactionsDateFiltered.reduce((acc, curr) => {
      const categoryId = curr.category?.toLowerCase() || "entrada" //pega id
      const existing = acc.find(item => item.id === categoryId) // procura se dentro do array chartData tem a mesma categoria
      const formatedValue = Math.abs(Number(curr.value))
      if (existing) {
        existing.value += formatedValue // se tem a mesma categoria, soma o valor atual com o que ja estava no array de obj
      } else {
        const categoryInfo = categories.find(c => c.id === categoryId) //se não, ele vai buscar em categories a categoria com o mesmo id, e depois joga dentro do array de obj
        
        acc.push({ 
          id: categoryId,
          name: categoryInfo?.name || "entrada", 
          value: formatedValue,
          fill: pieChartColors[categoryId]
        })
      }
      return acc
    }, [] as { id: string, name: string, value: number, fill: string}[])
  }, [transactionsDateFiltered])
  

  return(
    <div className="flex flex-col gap-6 w-full">
      <TitlePage title="Gráfico das Transações"/>
      <div className="flex">
        <DateFilter />
      </div>
      <div className="grid grid-cols-3 grid-rows-5 gap-4 h-150">
        <div className="col-span-1 row-span-2 p-2 rounded-xl border-2 border-blue-500 dark:bg-zinc-800 bg-white">
          <Balance balance={balance} expense={totalExpenses} profit={totalProfits}/>
        </div>
        <div className="flex flex-col justify-around gap-10 col-span-2 row-span-5 p-2 rounded-xl border-2  border-blue-200 dark:bg-zinc-800 bg-white">
          <PieExample chartData={chartData}/>
          <div className="flex justify-between w-full gap-10">
            <Summary chartData={chartData}/>
            <ExpensiveCategory chartData={chartData} showQuanti={3} items="items-end" padd="pr-4"/>
          </div>
        </div>
        <div className="col-span-1 row-span-1 p-2 rounded-xl border-2 dark:bg-zinc-800 bg-white border-blue-200">
          <Profit profit={totalProfits}/>
        </div>
        <div className="flex flex-col justify-around col-span-1 row-span-2 p-2 rounded-xl border-2 dark:bg-zinc-800 bg-white border-blue-200">
          <Expenses expense={totalExpenses}/>
          <div className="w-full h-0.5 bg-blue-500"></div>
          <ExpensiveCategory chartData={chartData} showQuanti={1} items="items-start" padd="pl-4"/>
        </div>
      </div>
    </div>
  )
}