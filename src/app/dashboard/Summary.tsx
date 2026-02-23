import { categories, categoryColors } from "@/data/categories"
import { ChartData } from "@/types/chartData"

export default function Summary({ chartData }: {chartData: ChartData[]}) {

  const catColors = categoryColors

  return(
    <div className="flex flex-col flex-wrap gap-4 max-w-87.5 h-full">
      <p className="text-gray-400 font-bold">Legenda: </p>
      <div className="flex flex-wrap pl-4 gap-2">
        {categories.filter((cat) => chartData.some(data => data.id === cat.id)).map((item) => (
          <div key={item.id} className="flex items-center gap-2 w-28">
            <div className={`w-4 h-4 border ${catColors[item.id]}`}></div>
            <span className="text-gray-500">{item.name}</span>
          </div>
        ))}
        
      </div>
    </div>
  )
}