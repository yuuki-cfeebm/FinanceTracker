"use client"
import CategoryBreakdown from "@/components/CategoryBreakdown"
import BalanceChart from "@/components/charts/BalanceChart"
import EmptyState from "@/components/EmptyState"
import PageHeader from "@/components/PageHeader"
import Panel from "@/components/Panel"
import StatCard, { DeltaBadge } from "@/components/StatCard"
import TransactionRow from "@/components/TransactionRow"
import { buttonVariants } from "@/components/ui/button"
import { useTransaction } from "@/context/TransactionContext"
import {
  buildBalanceSeries,
  dailyValues,
  expensesByCategory,
  filterByRange,
  getTotals,
  percentChange,
} from "@/lib/finance"
import { formatCurrency, formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { endOfDay, startOfMonth, subDays, subMonths } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, ChartPie, PiggyBank, Plus, ReceiptText, Wallet } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

export default function HomeClient() {
  const { transactions, isLoading } = useTransaction()

  const data = useMemo(() => {
    const now = new Date()
    const today = endOfDay(now)

    // Mês atual até hoje x mesmo intervalo do mês passado (comparação justa)
    const monthFrom = startOfMonth(now)
    const prevFrom = startOfMonth(subMonths(now, 1))
    const prevTo = endOfDay(subMonths(now, 1))

    const month = getTotals(filterByRange(transactions, monthFrom, today))
    const prevMonth = getTotals(filterByRange(transactions, prevFrom, prevTo))
    const all = getTotals(transactions)

    const sparkFrom = subDays(now, 13)
    const balanceFrom = subDays(now, 29)
    const balanceSeries = buildBalanceSeries(transactions, balanceFrom, now)
    const balanceStart = balanceSeries[0]?.balance ?? 0
    const balanceBefore = balanceStart - getTotals(filterByRange(transactions, balanceFrom, balanceFrom)).balance

    return {
      all,
      month,
      incomeDelta: percentChange(month.income, prevMonth.income),
      expenseDelta: percentChange(month.expense, prevMonth.expense),
      incomeSpark: dailyValues(transactions, sparkFrom, now, "entrada"),
      expenseSpark: dailyValues(transactions, sparkFrom, now, "saida"),
      balanceSeries,
      balanceDelta: percentChange(all.balance, balanceBefore),
      categories: expensesByCategory(filterByRange(transactions, monthFrom, today)),
      recent: [...transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6),
      monthName: formatDate(now, { month: "long" }),
    }
  }, [transactions])

  const header = (
    <PageHeader
      title="Visão geral"
      description={capitalize(formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" }))}
      action={
        <Link href="/gastos" className={cn(buttonVariants(), "rounded-full")}>
          <Plus /> Nova transação
        </Link>
      }
    />
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border bg-card" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl border bg-card" />
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <Panel>
          <EmptyState
            icon={Wallet}
            title="Seu painel ainda está vazio"
            description="Registre sua primeira entrada ou saída e aqui aparecem seu saldo, a evolução no mês e onde seu dinheiro está indo."
            action={
              <Link href="/gastos" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
                <Plus /> Registrar primeira transação
              </Link>
            }
          />
        </Panel>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {header}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Saldo atual"
          value={data.all.balance}
          icon={PiggyBank}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          valueClassName={data.all.balance < 0 ? "text-rose-600 dark:text-rose-400" : undefined}
          hint={`${data.all.count} ${data.all.count === 1 ? "transação registrada" : "transações registradas"}`}
          spark={data.balanceSeries.slice(-14).map((p) => p.balance)}
          sparkColor="var(--brand)"
        />
        <StatCard
          label={`Entradas em ${data.monthName}`}
          value={data.month.income}
          icon={ArrowDownLeft}
          iconClassName="bg-teal-500/10 text-teal-600 dark:text-teal-400"
          delta={data.incomeDelta}
          deltaLabel="vs. mês passado"
          spark={data.incomeSpark}
          sparkColor="var(--income)"
        />
        <StatCard
          label={`Saídas em ${data.monthName}`}
          value={data.month.expense}
          icon={ArrowUpRight}
          iconClassName="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          delta={data.expenseDelta}
          deltaLabel="vs. mês passado"
          invertDelta
          spark={data.expenseSpark}
          sparkColor="var(--expense)"
        />
      </div>

      <Panel
        title="Meu saldo"
        description="Últimos 30 dias"
        action={
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}>
            <ChartPie /> Ver gráficos
          </Link>
        }
      >
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{formatCurrency(data.all.balance)}</span>
          <DeltaBadge delta={data.balanceDelta} label="nos últimos 30 dias" />
        </div>
        <BalanceChart data={data.balanceSeries} />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title="Transações recentes"
          action={
            <Link href="/historico" className="text-sm font-medium text-brand hover:underline">
              Ver todas
            </Link>
          }
          bodyClassName="pt-2"
        >
          <div className="divide-y">
            {data.recent.map((t) => (
              <TransactionRow key={t.id} transaction={t} showDate />
            ))}
          </div>
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Gastos por categoria"
          description={`Em ${data.monthName}`}
          action={
            <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline">
              Detalhes
            </Link>
          }
        >
          {data.categories.length ? (
            <CategoryBreakdown data={data.categories} limit={5} />
          ) : (
            <EmptyState
              compact
              icon={ReceiptText}
              title="Nenhum gasto este mês"
              description="Quando você registrar uma saída, ela aparece aqui separada por categoria."
            />
          )}
        </Panel>
      </div>
    </div>
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
