import { categoryColors } from "@/data/categories"
import { ChartData } from "@/types/chartData"

interface ExpensiveCategoryProps {
  chartData: ChartData[]
  showQuanti: number
  items?: string
  padd?: string
}

export default function ExpensiveCategory({ chartData, showQuanti, items, padd}: ExpensiveCategoryProps) {

  const expensiveCategories = chartData.filter(item => item.id != "entrada").sort((a,b) => b.value - a.value).slice(0, showQuanti)

  return(
    <div className={`flex flex-col gap-4 w-full ${items}`}>
      <p className="text-gray-400 font-bold">{showQuanti == 1 ? "Categoria com maior gasto:" : "Categorias com mais gastos: "}</p>
      <div className={`flex flex-col gap-2 w-60 ${padd} ${items}`}>
        {expensiveCategories.map(cat => 
          <div key={cat.id} className="flex gap-2 items-center">
            <div className={`w-4 h-4 ${categoryColors[cat.id]}`} ></div>
            <p className="text-gray-500">{cat.name}: </p>
            <p>{cat.value.toLocaleString("pt-br", {style: "currency", currency: "BRL"})}</p>
          </div>
        )}
      </div>
    </div>
  )
}