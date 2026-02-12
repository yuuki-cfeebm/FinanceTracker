"use client"
import { useTransaction } from "@/context/TransactionContext"
import { categories } from "@/data/categories"
import { PieChart, Pie, Tooltip, Cell } from "recharts"

export function PieExample() {

  const { transaction } = useTransaction()
  const CATEGORY_COLORS: Record<string, string> = {
    comida: "#EAB308",    
    transporte: "#3B82F6", 
    casa: "#F97316",       
    saude: "#EC4899",      
    educacao: "#8B5CF6",   
    lazer: "#22C55E",      
    cartao: "#64748B",     
  }
  
  const chartData = transaction.reduce((acc, curr) => {

    const categoryId = curr.category?.toLowerCase() || "lucro" //pega id
    const existing = acc.find(item => item.name === categoryId) // procura se dentro do array chartData tem a mesma categoria
    const formatedValue = Math.abs(Number(curr.value))
    console.log(formatedValue)
    if (existing) {
      existing.value += formatedValue // se tem a mesma categoria, soma o valor atual com o que ja estava no array de obj
      console.log(existing.value)
    } else {
      const categoryInfo = categories.find(c => c.id === categoryId) //se não, ele vai buscar em categories a categoria com o mesmo id, e depois joga dentro do array de obj
      
      acc.push({ 
        id: categoryId,
        name: categoryInfo?.name || "auau", 
        value: formatedValue,
        // Atribui a cor exata baseada no ID
        fill: CATEGORY_COLORS[categoryId] || "#64748B" 
      })
    }
    return acc
  }, [] as { id: string, name: string, value: number, fill: string }[])
  console.log(transaction)
  console.log(chartData)

  return (
    <div className="flex justify-center w-full h-100">
      { chartData.length == 0 ? (
        <span>sem Dados</span>
      ) : (
      <PieChart width={400} height={400} key={JSON.stringify(chartData)}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx={200}
          cy={200}
          outerRadius={150}
          innerRadius={80}
          isAnimationActive={false} // Desativar animação ajuda a debugar
        />
        <Tooltip />
      </PieChart>
      )
      }
    </div>
  )
}
