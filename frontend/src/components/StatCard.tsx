import { formatCurrency, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, LucideIcon, Minus } from "lucide-react"
import Sparkline from "./Sparkline"

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconClassName?: string
  valueClassName?: string
  delta?: number | null
  deltaLabel?: string
  invertDelta?: boolean
  spark?: number[]
  sparkColor?: string
  display?: string
  hint?: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  valueClassName,
  delta,
  deltaLabel = "vs. mês anterior",
  invertDelta,
  spark,
  sparkColor,
  display,
  hint,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-8 items-center justify-center rounded-lg", iconClassName)}>
          <Icon className="size-4" />
        </span>
      </div>

      <span className={cn("text-2xl font-semibold tracking-tight tabular-nums", valueClassName)}>
        {display ?? formatCurrency(value)}
      </span>

      {delta !== undefined && <DeltaBadge delta={delta} label={deltaLabel} invert={invertDelta} />}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}

      {spark && sparkColor && <Sparkline values={spark} color={sparkColor} />}
    </div>
  )
}

export function DeltaBadge({ delta, label, invert }: { delta: number | null; label: string; invert?: boolean }) {
  if (delta === null) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Minus className="size-3.5" /> sem dados para comparar
      </span>
    )
  }

  const up = delta > 0
  const flat = Math.abs(delta) < 0.0005
  const good = flat ? null : invert ? !up : up
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight

  return (
    <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular-nums",
          good === null && "bg-muted text-muted-foreground",
          good === true && "bg-teal-500/10 text-teal-700 dark:text-teal-400",
          good === false && "bg-rose-500/10 text-rose-700 dark:text-rose-400"
        )}
      >
        <Icon className="size-3.5" />
        {formatPercent(Math.abs(delta))}
      </span>
      {label}
    </span>
  )
}
