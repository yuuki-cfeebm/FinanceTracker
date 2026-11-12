"use client"
import { CategoryTotal } from "@/lib/finance"
import { formatCurrency, formatPercent } from "@/lib/format"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { TooltipBox } from "./ChartTooltip"

interface CategoryDonutProps {
  data: CategoryTotal[]
  total: number
  size?: number
}

/** Rosca de gastos por categoria, com o total no centro. */
export default function CategoryDonut({ data, total, size = 220 }: CategoryDonutProps) {
  const chartData = data.map((d) => ({ name: d.category.name, value: d.value, fill: d.category.hex, share: d.share }))

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={chartData.length > 1 ? 1.5 : 0}
            cornerRadius={4}
            stroke="var(--card)"
            strokeWidth={2}
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const p = payload[0].payload as (typeof chartData)[number]
              return <TooltipBox rows={[{ label: p.name, value: p.value, color: p.fill, extra: formatPercent(p.share) }]} />
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">Total gasto</span>
        <span className="text-lg font-semibold tabular-nums">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
