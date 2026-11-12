import { formatCurrency } from "@/lib/format"

export type TooltipRow = {
  label: string
  value: number
  color: string
  /** texto extra à direita (ex.: "12%") */
  extra?: string
}

/** Caixa de tooltip com o visual do app; usada dentro do `content` do Tooltip do Recharts. */
export function TooltipBox({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  return (
    <div className="min-w-40 rounded-xl border bg-popover px-3 py-2.5 text-popover-foreground shadow-lg">
      {title && <p className="mb-1.5 text-xs font-medium text-muted-foreground first-letter:uppercase">{title}</p>}
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ background: row.color }} />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums">{formatCurrency(row.value)}</span>
            {row.extra && <span className="text-xs text-muted-foreground tabular-nums">{row.extra}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--chart-axis)", fontSize: 12 },
} as const
