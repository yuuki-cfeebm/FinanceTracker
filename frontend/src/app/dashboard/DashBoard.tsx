"use client"
import CategoryBreakdown from "@/components/CategoryBreakdown"
import BalanceChart from "@/components/charts/BalanceChart"
import CashflowChart from "@/components/charts/CashflowChart"
import CategoryDonut from "@/components/charts/CategoryDonut"
import WeekdayChart from "@/components/charts/WeekdayChart"
import EmptyState from "@/components/EmptyState"
import PageHeader from "@/components/PageHeader"
import Panel from "@/components/Panel"
import StatCard from "@/components/StatCard"
import TransactionRow from "@/components/TransactionRow"
import { buttonVariants } from "@/components/ui/button"
import { useFilter } from "@/context/FilterContext"
import { useTransaction } from "@/context/TransactionContext"
import {
  buildBalanceSeries,
  buildFlowSeries,
  dateBounds,
  expensesByCategory,
  expensesByWeekday,
  filterByRange,
  getTotals,
  largestExpenses,
  percentChange,
} from "@/lib/finance"
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { differenceInCalendarDays, endOfDay, startOfDay, subDays } from "date-fns"
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  ChartPie,
  PiggyBank,
  Plus,
  Scale,
  Table2,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { DateFilter, rangeLabel } from "../filtros/DateFilter"

export default function DashBoard() {
  const { transactions, isLoading } = useTransaction()
  const { dateRange, setDateRange } = useFilter()
  const [flowView, setFlowView] = useState<"chart" | "table">("chart")

  const data = useMemo(() => {
    const bounds = dateBounds(transactions)
    if (!bounds) return null

    // Sem filtro = do primeiro ao último registro
    const from = dateRange?.from ? startOfDay(dateRange.from) : bounds.from
    const to = dateRange?.from ? endOfDay(dateRange.to ?? dateRange.from) : endOfDay(new Date(Math.max(bounds.to.getTime(), Date.now())))
    const days = differenceInCalendarDays(to, from) + 1

    const list = filterByRange(transactions, from, to)
    const totals = getTotals(list)

    // Período anterior com o mesmo tamanho, só quando há filtro
    let prev = null
    if (dateRange?.from) {
      const prevTo = endOfDay(subDays(from, 1))
      const prevFrom = startOfDay(subDays(from, days))
      prev = getTotals(filterByRange(transactions, prevFrom, prevTo))
    }

    const expenseCount = list.filter((t) => t.valueType === "saida").length

    return {
      from,
      to,
      days,
      list,
      totals,
      incomeDelta: prev ? percentChange(totals.income, prev.income) : undefined,
      expenseDelta: prev ? percentChange(totals.expense, prev.expense) : undefined,
      balanceDelta: prev ? percentChange(totals.balance, prev.balance) : undefined,
      savingsRate: totals.income > 0 ? totals.balance / totals.income : null,
      dailyAverage: totals.expense / days,
      averageTicket: expenseCount ? totals.expense / expenseCount : 0,
      expenseCount,
      flow: buildFlowSeries(list, from, to),
      balance: buildBalanceSeries(transactions, from, to),
      categories: expensesByCategory(list),
      weekday: expensesByWeekday(list),
      largest: largestExpenses(list, 5),
    }
  }, [transactions, dateRange])

  const header = (
    <PageHeader
      title="Gráficos"
      description={data ? `Análise detalhada · ${rangeLabel(dateRange)}` : "Análise detalhada das suas finanças"}
      action={transactions.length > 0 && <DateFilter />}
    />
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border bg-card" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl border bg-card" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <Panel>
          <EmptyState
            icon={BarChart3}
            title="Ainda não há o que analisar"
            description="Os gráficos de fluxo de caixa, categorias e evolução do saldo aparecem assim que você registrar transações."
            action={
              <Link href="/gastos" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
                <Plus /> Registrar transação
              </Link>
            }
          />
        </Panel>
      </div>
    )
  }

  if (!data.list.length) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <Panel>
          <EmptyState
            icon={CalendarRange}
            title="Nenhuma transação nesse período"
            description={`Não encontramos nada entre as datas escolhidas (${rangeLabel(dateRange)}). Escolha outro período ou veja tudo.`}
            action={
              <button
                type="button"
                onClick={() => setDateRange(undefined)}
                className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer rounded-full")}
              >
                Ver todo o período
              </button>
            }
          />
        </Panel>
      </div>
    )
  }

  const { totals } = data
  const deltaLabel = "vs. período anterior"

  return (
    <div className="flex flex-col gap-6">
      {header}

      {/* KPIs principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Entradas"
          value={totals.income}
          icon={ArrowDownLeft}
          iconClassName="bg-teal-500/10 text-teal-600 dark:text-teal-400"
          delta={data.incomeDelta}
          deltaLabel={deltaLabel}
        />
        <StatCard
          label="Saídas"
          value={totals.expense}
          icon={ArrowUpRight}
          iconClassName="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          delta={data.expenseDelta}
          deltaLabel={deltaLabel}
          invertDelta
        />
        <StatCard
          label="Saldo do período"
          value={totals.balance}
          icon={Scale}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          valueClassName={totals.balance < 0 ? "text-rose-600 dark:text-rose-400" : undefined}
          delta={data.balanceDelta}
          deltaLabel={deltaLabel}
        />
        <StatCard
          label="Taxa de economia"
          value={0}
          display={data.savingsRate === null ? "—" : formatPercent(data.savingsRate)}
          icon={PiggyBank}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          hint={
            data.savingsRate === null
              ? "Sem entradas no período"
              : data.savingsRate >= 0
                ? "do que entrou ficou guardado"
                : "você gastou mais do que recebeu"
          }
        />
      </div>

      {/* Indicadores secundários */}
      <div className="grid grid-cols-2 divide-x divide-y rounded-2xl border bg-card shadow-xs lg:grid-cols-4 lg:divide-y-0">
        <Metric label="Média de gasto por dia" value={formatCurrency(data.dailyAverage)} hint={`em ${data.days} ${data.days === 1 ? "dia" : "dias"}`} />
        <Metric label="Gasto médio por compra" value={formatCurrency(data.averageTicket)} hint={`${data.expenseCount} ${data.expenseCount === 1 ? "saída" : "saídas"}`} />
        <Metric
          label="Maior gasto"
          value={data.largest[0] ? formatCurrency(Math.abs(data.largest[0].value)) : "—"}
          hint={data.largest[0]?.description && data.largest[0].description !== "No description" ? data.largest[0].description : "—"}
        />
        <Metric label="Transações" value={String(totals.count)} hint={`${totals.count - data.expenseCount} entradas · ${data.expenseCount} saídas`} />
      </div>

      {/* Fluxo de caixa */}
      <Panel
        title="Fluxo de caixa"
        description={data.days > 62 ? "Entradas e saídas por mês" : "Entradas e saídas por dia"}
        action={
          <div className="flex rounded-lg border p-0.5" role="radiogroup" aria-label="Visualização">
            {(
              [
                { value: "chart", label: "Gráfico", icon: BarChart3 },
                { value: "table", label: "Tabela", icon: Table2 },
              ] as const
            ).map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={flowView === o.value}
                onClick={() => setFlowView(o.value)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
                  flowView === o.value ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <o.icon className="size-3.5" />
                <span className="hidden sm:inline">{o.label}</span>
              </button>
            ))}
          </div>
        }
      >
        {flowView === "chart" ? (
          <CashflowChart data={data.flow} />
        ) : (
          <div className="max-h-80 overflow-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Período</th>
                  <th className="px-3 py-2 text-right font-medium">Entradas</th>
                  <th className="px-3 py-2 text-right font-medium">Saídas</th>
                  <th className="px-3 py-2 text-right font-medium">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.flow
                  .filter((p) => p.income || p.expense)
                  .map((p) => (
                    <tr key={p.key}>
                      <td className="px-3 py-2 first-letter:uppercase">{p.fullLabel}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(p.income)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(p.expense)}</td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">{formatSignedCurrency(p.net)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Gastos por categoria" description="Para onde foi o seu dinheiro">
          {data.categories.length ? (
            <div className="flex flex-col gap-6">
              <CategoryDonut data={data.categories} total={totals.expense} />
              <CategoryBreakdown data={data.categories} showCount />
            </div>
          ) : (
            <EmptyState compact icon={ChartPie} title="Sem saídas no período" description="Só houve entradas nesse intervalo." />
          )}
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Evolução do saldo" description="Saldo acumulado ao fim de cada dia">
            <BalanceChart data={data.balance} height={220} />
          </Panel>

          <Panel title="Gastos por dia da semana" description="Em quais dias você mais gasta">
            {data.expenseCount ? (
              <WeekdayChart data={data.weekday} height={200} />
            ) : (
              <EmptyState compact icon={BarChart3} title="Sem saídas no período" />
            )}
          </Panel>
        </div>
      </div>

      <Panel
        title="Maiores gastos"
        description="As 5 saídas de maior valor no período"
        action={
          <Link href="/historico" className="text-sm font-medium text-brand hover:underline">
            Ver histórico
          </Link>
        }
        bodyClassName="pt-1"
      >
        {data.largest.length ? (
          <div className="divide-y">
            {data.largest.map((t) => (
              <TransactionRow key={t.id} transaction={t} showDate />
            ))}
          </div>
        ) : (
          <EmptyState compact icon={ArrowUpRight} title="Sem saídas no período" />
        )}
      </Panel>
    </div>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-base font-semibold tabular-nums">{value}</span>
      {hint && <span className="truncate text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}
