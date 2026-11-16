import { getCategory } from "@/data/categories"
import { formatDate, formatSignedCurrency, formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Category } from "@/types/category"
import { Transaction } from "@/types/transaction"

export function CategoryIcon({ category, size = "md" }: { category: Category; size?: "sm" | "md" }) {
  const Icon = category.icon
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        category.background,
        category.color,
        size === "md" ? "size-10" : "size-8"
      )}
    >
      <Icon className={size === "md" ? "size-5" : "size-4"} />
    </span>
  )
}

interface TransactionRowProps {
  transaction: Transaction
  /** mostra a data junto da hora (listas que não são agrupadas por dia) */
  showDate?: boolean
}

export default function TransactionRow({ transaction, showDate }: TransactionRowProps) {
  const { value, description, valueType, category, createdAt } = transaction
  const info = getCategory(valueType === "entrada" ? "entrada" : category)
  const isIncome = valueType === "entrada"
  const signed = isIncome ? Math.abs(value) : -Math.abs(value)
  const title = description && description !== "No description" ? description : info.name

  return (
    <div className="flex items-center gap-3 py-3">
      <CategoryIcon category={info} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium max-w-[160px] xs:max-w-none">{title}</span>
        <span className="truncate text-xs text-muted-foreground">
          {info.name} ·{" "}
          {showDate ? `${formatDate(createdAt, { day: "2-digit", month: "short" })}, ` : ""}
          {formatTime(createdAt)}
        </span>
      </div>
      <span
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          isIncome ? "text-teal-600 dark:text-teal-400" : "text-foreground"
        )}
      >
        {formatSignedCurrency(signed)}
      </span>
    </div>
  )
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 py-3">
      <div className="size-10 rounded-xl bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-2.5 w-1/5 rounded bg-muted" />
      </div>
      <div className="h-3 w-16 rounded bg-muted" />
    </div>
  )
}
