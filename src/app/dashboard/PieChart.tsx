"use client"
import { ChartData } from "@/types/chartData"
import { PieChart, Pie, Tooltip} from "recharts"

interface PieExampleProps {
  chartData: ChartData[]
}

export function PieExample({ chartData }: PieExampleProps) {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-4">
      { chartData.length == 0 ? (
        <span>sem Dados</span>
      ) : (
      <PieChart width={320} height={320} key={JSON.stringify(chartData)}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx={150}
          cy={150}
          outerRadius={150}
          innerRadius={80}
          isAnimationActive={false} // Desativar animação ajuda a debugar
          fill="cover"
        />
        <Tooltip />
      </PieChart>
      )
      }
    </div>
  )
}
