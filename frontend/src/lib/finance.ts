import { Transaction } from "@/types/transaction"
import { Category } from "@/types/category"
import { getCategory } from "@/data/categories"
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from "date-fns"
import { ptBR } from "date-fns/locale"

export type Totals = {
  income: number
  expense: number
  balance: number
  count: number
}

export type CategoryTotal = {
  category: Category
  value: number
  count: number
  share: number
}

export type FlowPoint = {
  key: string
  label: string
  fullLabel: string
  income: number
  expense: number
  net: number
}

export type BalancePoint = {
  key: string
  label: string
  fullLabel: string
  balance: number
}

const amount = (t: Transaction) => Math.abs(Number(t.value))

export const isIncome = (t: Transaction) => t.valueType === "entrada"

export function inRange(date: Date, from: Date, to: Date) {
  return date >= startOfDay(from) && date <= endOfDay(to)
}

export function filterByRange(list: Transaction[], from: Date, to: Date) {
  return list.filter((t) => inRange(t.createdAt, from, to))
}

export function getTotals(list: Transaction[]): Totals {
  let income = 0
  let expense = 0
  for (const t of list) {
    if (isIncome(t)) income += amount(t)
    else expense += amount(t)
  }
  return { income, expense, balance: income - expense, count: list.length }
}

export function expensesByCategory(list: Transaction[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>()
  let total = 0

  for (const t of list) {
    if (isIncome(t)) continue
    const category = getCategory(t.category)
    const current = map.get(category.id) ?? { category, value: 0, count: 0, share: 0 }
    current.value += amount(t)
    current.count += 1
    total += amount(t)
    map.set(category.id, current)
  }

  return [...map.values()]
    .map((c) => ({ ...c, share: total ? c.value / total : 0 }))
    .sort((a, b) => b.value - a.value)
}

export function buildFlowSeries(list: Transaction[], from: Date, to: Date): FlowPoint[] {
  const days = differenceInCalendarDays(to, from)

  if (days > 62) {
    return eachMonthOfInterval({ start: from, end: to }).map((month) => {
      const items = list.filter((t) => isSameMonth(t.createdAt, month))
      const { income, expense } = getTotals(items)
      return {
        key: month.toISOString(),
        label: format(month, "MMM yy", { locale: ptBR }),
        fullLabel: format(month, "MMMM 'de' yyyy", { locale: ptBR }),
        income,
        expense,
        net: income - expense,
      }
    })
  }

  return eachDayOfInterval({ start: from, end: to }).map((day) => {
    const items = list.filter((t) => isSameDay(t.createdAt, day))
    const { income, expense } = getTotals(items)
    return {
      key: day.toISOString(),
      label: format(day, "dd/MM"),
      fullLabel: format(day, "EEEE, d 'de' MMMM", { locale: ptBR }),
      income,
      expense,
      net: income - expense,
    }
  })
}

export function buildBalanceSeries(all: Transaction[], from: Date, to: Date): BalancePoint[] {
  const start = startOfDay(from)
  let running = getTotals(all.filter((t) => t.createdAt < start)).balance

  return eachDayOfInterval({ start: from, end: to }).map((day) => {
    running += getTotals(all.filter((t) => isSameDay(t.createdAt, day))).balance
    return {
      key: day.toISOString(),
      label: format(day, "dd MMM", { locale: ptBR }),
      fullLabel: format(day, "EEEE, d 'de' MMMM", { locale: ptBR }),
      balance: running,
    }
  })
}

export function dailyValues(list: Transaction[], from: Date, to: Date, type: "entrada" | "saida") {
  return eachDayOfInterval({ start: from, end: to }).map((day) =>
    list
      .filter((t) => t.valueType === type && isSameDay(t.createdAt, day))
      .reduce((acc, t) => acc + amount(t), 0)
  )
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function expensesByWeekday(list: Transaction[]) {
  const totals = WEEKDAYS.map((label) => ({ label, value: 0, count: 0 }))
  for (const t of list) {
    if (isIncome(t)) continue
    const day = totals[t.createdAt.getDay()]
    day.value += amount(t)
    day.count += 1
  }
  return totals
}

export function largestExpenses(list: Transaction[], limit = 5) {
  return list
    .filter((t) => !isIncome(t))
    .sort((a, b) => amount(b) - amount(a))
    .slice(0, limit)
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return null
  return (current - previous) / Math.abs(previous)
}

export function dateBounds(list: Transaction[]) {
  if (!list.length) return null
  let min = list[0].createdAt
  let max = list[0].createdAt
  for (const t of list) {
    if (t.createdAt < min) min = t.createdAt
    if (t.createdAt > max) max = t.createdAt
  }
  return { from: startOfDay(min), to: endOfDay(max) }
}

export function monthStart(date = new Date()) {
  return startOfMonth(date)
}
