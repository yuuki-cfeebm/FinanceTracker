import { CategoryTotal } from "@/lib/finance"
import { formatCurrency, formatPercent } from "@/lib/format"
import { CategoryIcon } from "./TransactionRow"

interface CategoryBreakdownProps {
  data: CategoryTotal[]
  limit?: number
  showCount?: boolean
}

export default function CategoryBreakdown({ data, limit, showCount }: CategoryBreakdownProps) {
  const rows = limit ? data.slice(0, limit) : data

  return (
    <ul className="flex flex-col gap-4">
      {rows.map(({ category, value, share, count }) => (
        <li key={category.id} className="flex items-center gap-3">
          <CategoryIcon category={category} size="sm" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate font-medium">
                {category.name}
                {showCount && (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    {count} {count === 1 ? "transação" : "transações"}
                  </span>
                )}
              </span>
              <span className="shrink-0 font-semibold tabular-nums">{formatCurrency(value)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.max(share * 100, 2)}%`, background: category.hex }}
                />
              </div>
              <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">{formatPercent(share)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
