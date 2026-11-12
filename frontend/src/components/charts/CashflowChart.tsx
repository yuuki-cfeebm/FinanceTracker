"use client"
import { formatCompactCurrency } from "@/lib/format"
import { FlowPoint } from "@/lib/finance"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { axisProps, TooltipBox } from "./ChartTooltip"

interface CashflowChartProps {
  data: FlowPoint[]
  height?: number
}

export const INCOME_COLOR = "var(--income)"
export const EXPENSE_COLOR = "var(--expense)"

/** Entradas x saídas por período, barras lado a lado no mesmo eixo. */
export default function CashflowChart({ data, height = 280 }: CashflowChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <LegendDot color={INCOME_COLOR} label="Entradas" />
        <LegendDot color={EXPENSE_COLOR} label="Saídas" />
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey="label" {...axisProps} minTickGap={16} tickMargin={8} />
            <YAxis {...axisProps} width={80} tickFormatter={formatCompactCurrency} />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const p = payload[0].payload as FlowPoint
                return (
                  <TooltipBox
                    title={p.fullLabel}
                    rows={[
                      { label: "Entradas", value: p.income, color: INCOME_COLOR },
                      { label: "Saídas", value: p.expense, color: EXPENSE_COLOR },
                      { label: "Resultado", value: p.net, color: "transparent" },
                    ]}
                  />
                )
              }}
            />
            <Bar dataKey="income" name="Entradas" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expense" name="Saídas" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}
