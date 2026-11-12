"use client"
import { formatCompactCurrency } from "@/lib/format"
import { BalancePoint } from "@/lib/finance"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { axisProps, TooltipBox } from "./ChartTooltip"

interface BalanceChartProps {
  data: BalancePoint[]
  height?: number
}

/** Saldo acumulado ao longo do tempo (uma série — sem legenda, o título do painel nomeia). */
export default function BalanceChart({ data, height = 260 }: BalanceChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" {...axisProps} minTickGap={32} tickMargin={8} />
          <YAxis {...axisProps} width={80} tickFormatter={formatCompactCurrency} />
          <Tooltip
            cursor={{ stroke: "var(--chart-axis)", strokeDasharray: "4 4" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const point = payload[0].payload as BalancePoint
              return (
                <TooltipBox title={point.fullLabel} rows={[{ label: "Saldo", value: point.balance, color: "var(--brand)" }]} />
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--brand)"
            strokeWidth={2}
            fill="url(#balance-fill)"
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
