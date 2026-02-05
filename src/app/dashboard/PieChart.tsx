"use client"
import { PieChart, Pie, Tooltip } from "recharts"

const data = [
  { name: "Alimentação", value: 400 },
  { name: "Transporte", value: 300 },
  { name: "Lazer", value: 300 },
]

export function PieExample() {
  return (
    <PieChart width={500} height={500}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={200}
      />
      <Tooltip />
    </PieChart>
  )
}
