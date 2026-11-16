"use client"
import { useId } from "react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface SparklineProps {
  values: number[]
  color: string
  height?: number
}

export default function Sparkline({ values, color, height = 40 }: SparklineProps) {
  const id = useId().replace(/:/g, "")
  const data = values.map((value, index) => ({ index, value }))
  const hasData = values.some((v) => v !== 0)

  if (!hasData) {
    return (
      <div style={{ height }} className="flex items-end" aria-hidden>
        <div className="h-px w-full border-t border-dashed border-border" />
      </div>
    )
  }

  return (
    <div style={{ height }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#spark-${id})`}
            isAnimationActive={false}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
