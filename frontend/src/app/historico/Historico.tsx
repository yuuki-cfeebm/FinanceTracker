"use client"
import EmptyState from "@/components/EmptyState"
import PageHeader from "@/components/PageHeader"
import TransactionRow, { TransactionRowSkeleton } from "@/components/TransactionRow"
import { buttonVariants } from "@/components/ui/button"
import { useFilter } from "@/context/FilterContext"
import { useTransaction } from "@/context/TransactionContext"
import { getCategory } from "@/data/categories"
import { getTotals } from "@/lib/finance"
import { formatCurrency, formatDate, formatSignedCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Transaction } from "@/types/transaction"
import { format, isToday, isYesterday } from "date-fns"
import { Plus, ReceiptText, Search, SearchX, X } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import CategoryFilter from "../filtros/CategoryFilter"
import CategoryMarked from "../filtros/CategoryMarked"
import { DateFilter, rangeLabel } from "../filtros/DateFilter"
import OrderBy from "../filtros/OrderBy"

type TypeFilter = "todas" | "entrada" | "saida"

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "entrada", label: "Entradas" },
  { value: "saida", label: "Saídas" },
]

function dayLabel(date: Date) {
  if (isToday(date)) return "Hoje"
  if (isYesterday(date)) return "Ontem"
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return formatDate(date, sameYear ? { weekday: "short", day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" })
}

export default function Historico() {
  const { transactions, isLoading } = useTransaction()
  const { orderBy, dateRange, setDateRange, categoriesSelected, handleCheckbox, isInDateRange, clearFilters } = useFilter()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("todas")

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return transactions
      .filter((t) => typeFilter === "todas" || t.valueType === typeFilter)
      .filter((t) => {
        if (categoriesSelected.length === 0) return true
        return !!t.category && categoriesSelected.includes(t.category.toLowerCase())
      })
      .filter((t) => isInDateRange(t.createdAt, dateRange))
      .filter((t) => {
        if (!term) return true
        const category = getCategory(t.valueType === "entrada" ? "entrada" : t.category).name
        return `${t.description ?? ""} ${category}`.toLowerCase().includes(term)
      })
      .sort((a, b) =>
        orderBy === "recente"
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : a.createdAt.getTime() - b.createdAt.getTime()
      )
  }, [transactions, typeFilter, categoriesSelected, dateRange, isInDateRange, search, orderBy])

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const t of filtered) {
      const key = format(t.createdAt, "yyyy-MM-dd")
      map.set(key, [...(map.get(key) ?? []), t])
    }
    return [...map.entries()].map(([key, items]) => ({ key, date: items[0].createdAt, items, totals: getTotals(items) }))
  }, [filtered])

  const totals = getTotals(filtered)
  const hasFilters = categoriesSelected.length > 0 || !!dateRange?.from || typeFilter !== "todas" || search.trim() !== ""

  function resetAll() {
    clearFilters()
    setSearch("")
    setTypeFilter("todas")
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Histórico"
        description={
          isLoading
            ? "Carregando transações…"
            : `${transactions.length} ${transactions.length === 1 ? "transação registrada" : "transações registradas"}`
        }
        action={
          <Link href="/gastos" className={cn(buttonVariants(), "rounded-full")}>
            <Plus /> Nova transação
          </Link>
        }
      />

      {/* Barra de filtros */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-xs">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descrição ou categoria"
              className="h-10 w-full rounded-xl border bg-background pr-9 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
            )}
          </label>

          <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1 lg:w-72" role="radiogroup" aria-label="Tipo">
            {typeOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={typeFilter === o.value}
                onClick={() => setTypeFilter(o.value)}
                className={cn(
                  "h-8 cursor-pointer rounded-lg text-sm font-medium transition",
                  typeFilter === o.value ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <CategoryFilter />
          <DateFilter />
          <OrderBy className="col-span-2 sm:col-span-1" />
        </div>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 border-t pt-3">
            <span className="text-xs text-muted-foreground">Filtros ativos:</span>
            {typeFilter !== "todas" && (
              <CategoryMarked filterName={typeFilter === "entrada" ? "Entradas" : "Saídas"} onClick={() => setTypeFilter("todas")} />
            )}
            {categoriesSelected.map((id) => (
              <CategoryMarked key={id} filterName={getCategory(id).name} onClick={() => handleCheckbox(id)} />
            ))}
            {dateRange?.from && <CategoryMarked filterName={rangeLabel(dateRange)} onClick={() => setDateRange(undefined)} />}
            {search.trim() && <CategoryMarked filterName={`“${search.trim()}”`} onClick={() => setSearch("")} />}
            <button type="button" onClick={resetAll} className="cursor-pointer text-xs font-medium text-brand hover:underline">
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      {/* Resumo do que está filtrado */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-3 divide-x rounded-2xl border bg-card shadow-xs">
          <MiniStat label="Entradas" value={formatCurrency(totals.income)} className="text-teal-600 dark:text-teal-400" />
          <MiniStat label="Saídas" value={formatCurrency(totals.expense)} />
          <MiniStat label="Resultado" value={formatSignedCurrency(totals.balance)} />
        </div>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="rounded-2xl border bg-card px-5 shadow-xs">
          {[0, 1, 2, 3, 4].map((i) => (
            <TransactionRowSkeleton key={i} />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border bg-card shadow-xs">
          <EmptyState
            icon={ReceiptText}
            title="Nenhuma transação ainda"
            description="Tudo o que você registrar aparece aqui, organizado por dia."
            action={
              <Link href="/gastos" className={cn(buttonVariants(), "rounded-full")}>
                <Plus /> Registrar transação
              </Link>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card shadow-xs">
          <EmptyState
            icon={SearchX}
            title="Nenhum resultado"
            description="Nenhuma transação bate com os filtros escolhidos. Tente ampliar o período ou remover algum filtro."
            action={
              <button type="button" onClick={resetAll} className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer rounded-full")}>
                Limpar filtros
              </button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group.key} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between px-1">
                <h2 className="text-sm font-semibold first-letter:uppercase">{dayLabel(group.date)}</h2>
                <span className="text-xs text-muted-foreground tabular-nums">{formatSignedCurrency(group.totals.balance)}</span>
              </div>
              <div className="divide-y rounded-2xl border bg-card px-4 shadow-xs sm:px-5">
                {group.items.map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 sm:p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("truncate text-sm font-semibold tabular-nums sm:text-base", className)}>{value}</span>
    </div>
  )
}
