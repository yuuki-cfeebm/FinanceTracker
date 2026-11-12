"use client"
import { formatCompactCurrency } from "@/lib/format"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { axisProps, TooltipBox } from "./ChartTooltip"

type WeekdayPoint = { label: string; value: number; count: number }

/** Total gasto por dia da semana (uma série). */
export default function WeekdayChart({ data, height = 220 }: { data: WeekdayPoint[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" {...axisProps} tickMargin={8} />
          <YAxis {...axisProps} width={80} tickFormatter={formatCompactCurrency} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const p = payload[0].payload as WeekdayPoint
              return (
                <TooltipBox
                  title={`${p.label} · ${p.count} ${p.count === 1 ? "transação" : "transações"}`}
                  rows={[{ label: "Gasto", value: p.value, color: "var(--expense)" }]}
                />
              )
            }}
          />
          <Bar dataKey="value" fill="var(--expense)" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
