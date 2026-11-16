"use client"
import EmptyState from "@/components/EmptyState"
import PageHeader from "@/components/PageHeader"
import Panel from "@/components/Panel"
import TransactionInput from "@/components/TransactionInput"
import TransactionRow, { TransactionRowSkeleton } from "@/components/TransactionRow"
import { useTransaction } from "@/context/TransactionContext"
import { categories } from "@/data/categories"
import { filterByRange, getTotals } from "@/lib/finance"
import { formatCurrency, formatDate, formatSignedCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { TransactionType } from "@/types/transaction"
import { endOfDay, startOfMonth } from "date-fns"
import ReceiptUpload from "@/components/ReceiptUpload"
import { ReceiptData } from "@/services/transactions"
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Check, Loader2, ReceiptText, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { FormEvent, useMemo, useState } from "react"
import { toast } from "sonner"

/**
 * "2026-11-10" -> Date local nesse dia, com a hora atual.
 * (new Date("2026-11-10") seria meia-noite UTC = dia anterior no Brasil)
 * Datas inválidas ou no futuro são ignoradas.
 */
function parseReceiptDate(value: string | null): Date | null {
  if (!value) return null
  const [y, m, d] = value.split("-").map(Number)
  const now = new Date()
  const date = new Date(y, m - 1, d, now.getHours(), now.getMinutes())
  if (Number.isNaN(date.getTime()) || date.getDate() !== d || date > now) return null
  return date
}

const typeOptions: { value: TransactionType; label: string; icon: typeof ArrowUpRight }[] = [
  { value: "saida", label: "Saída", icon: ArrowUpRight },
  { value: "entrada", label: "Entrada", icon: ArrowDownLeft },
]

export default function TransactionsClient() {
  const { addTransaction, cancelTransaction, transactions, isLoading } = useTransaction()

  const [selectedCategory, setSelectedCategory] = useState("")
  const [type, setType] = useState<TransactionType>("saida")
  const [description, setDescription] = useState("")
  const [cents, setCents] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Data lida do comprovante; sem comprovante, a transação usa "agora"
  const [receiptDate, setReceiptDate] = useState<Date | null>(null)
  // Trocar a key remonta o upload e limpa a miniatura depois de salvar
  const [uploadKey, setUploadKey] = useState(0)

  const isExpense = type === "saida"

  const sidebar = useMemo(() => {
    const now = new Date()
    return {
      month: getTotals(filterByRange(transactions, startOfMonth(now), endOfDay(now))),
      monthName: formatDate(now, { month: "long" }),
      recent: [...transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 4),
    }
  }, [transactions])

  function resetForm() {
    setCents(0)
    setDescription("")
    setSelectedCategory("")
    setReceiptDate(null)
    setUploadKey((k) => k + 1)
  }

  function handleReceipt(data: ReceiptData) {
    setCents(Math.round(data.value * 100))
    if (data.description) setDescription(data.description.slice(0, 80))
    if (data.category && categories.some((c) => c.id === data.category)) setSelectedCategory(data.category)
    setReceiptDate(parseReceiptDate(data.date))
  }

  function handleCancel() {
    resetForm()
    cancelTransaction()
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (cents <= 0) {
      toast.error("Informe um valor válido", { position: "bottom-right" })
      return
    }

    if (isExpense && !selectedCategory) {
      toast.error("Selecione uma categoria", { position: "bottom-right" })
      return
    }

    const value = cents / 100
    setIsSubmitting(true)

    const success = await addTransaction({
      value: isExpense ? -value : value,
      valueType: type,
      category: isExpense ? selectedCategory : "Entrada",
      description: description || undefined,
      createdAt: receiptDate ?? new Date(),
    })

    setIsSubmitting(false)
    if (success) resetForm()
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Nova transação" description="Registre uma entrada ou uma saída de dinheiro." />

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
          {/* Tipo */}
          <div role="radiogroup" aria-label="Tipo de transação" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
            {typeOptions.map((option) => {
              const active = type === option.value
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setType(option.value)}
                  className={cn(
                    "relative flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="type-pill"
                      className="absolute inset-0 rounded-lg bg-card shadow-sm"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative size-4",
                      active && (option.value === "saida" ? "text-rose-600 dark:text-rose-400" : "text-teal-600 dark:text-teal-400")
                    )}
                  />
                  <span className="relative">{option.label}</span>
                </button>
              )
            })}
          </div>

          {/* Comprovante (só para saídas — a IA sempre lê como gasto) */}
          <AnimatePresence initial={false}>
            {isExpense && (
              <motion.div
                key="receipt"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="-m-1 flex flex-col gap-4 overflow-hidden p-1"
              >
                <ReceiptUpload key={uploadKey} onExtracted={handleReceipt} disabled={isSubmitting} />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  ou preencha manualmente
                  <span className="h-px flex-1 bg-border" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Valor */}
          <div className="flex flex-col items-center gap-1 py-2">
            <label htmlFor="amount" className="text-sm text-muted-foreground">
              {isExpense ? "Quanto você gastou?" : "Quanto você recebeu?"}
            </label>
            <TransactionInput
              id="amount"
              cents={cents}
              onChange={setCents}
              autoFocus
              className={cn(
                "w-full bg-transparent text-center text-4xl font-semibold tracking-tight tabular-nums outline-none placeholder:text-muted-foreground/40 sm:text-5xl",
                isExpense ? "text-rose-600 dark:text-rose-400" : "text-teal-600 dark:text-teal-400"
              )}
            />
            {receiptDate && (
              <button
                type="button"
                onClick={() => setReceiptDate(null)}
                aria-label="Usar a data de hoje em vez da data do comprovante"
                className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <CalendarDays className="size-3.5" />
                Data do comprovante: {formatDate(receiptDate, { day: "numeric", month: "short", year: "numeric" })}
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Categoria */}
          <AnimatePresence initial={false}>
            {isExpense && (
              <motion.fieldset
                key="category"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <legend className="mb-3 text-sm font-medium">Categoria</legend>
                <div className="grid grid-cols-2 gap-2 p-0.5 sm:grid-cols-4">
                  {categories.map((item) => {
                    const Icon = item.icon
                    const selected = selectedCategory === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedCategory(item.id)}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-left text-sm font-medium transition",
                          selected ? cn(item.border, item.background) : "hover:bg-muted"
                        )}
                      >
                        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", item.background, item.color)}>
                          <Icon className="size-4" />
                        </span>
                        <span className="truncate">{item.name}</span>
                        {selected && <Check className={cn("ml-auto size-4 shrink-0", item.color)} />}
                      </button>
                    )
                  })}
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>

          {/* Descrição */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="description"
              className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
              placeholder={isExpense ? "Ex.: Mercado do mês" : "Ex.: Salário"}
              maxLength={80}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="h-11 cursor-pointer rounded-xl border px-6 text-sm font-medium transition hover:bg-muted"
            >
              Limpar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Adicionar {isExpense ? "saída" : "entrada"}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          <Panel title={`Resumo de ${sidebar.monthName}`}>
            <dl className="flex flex-col gap-3 text-sm">
              <SummaryLine label="Entradas" value={sidebar.month.income} className="text-teal-600 dark:text-teal-400" />
              <SummaryLine label="Saídas" value={-sidebar.month.expense} signed />
              <div className="border-t pt-3">
                <SummaryLine label="Saldo do mês" value={sidebar.month.balance} strong />
              </div>
            </dl>
          </Panel>

          <Panel
            title="Últimas registradas"
            action={
              <Link href="/historico" className="text-sm font-medium text-brand hover:underline">
                Ver todas
              </Link>
            }
            bodyClassName="pt-1"
          >
            {isLoading ? (
              <div className="divide-y">{[0, 1, 2].map((i) => <TransactionRowSkeleton key={i} />)}</div>
            ) : sidebar.recent.length ? (
              <div className="divide-y">
                {sidebar.recent.map((t) => (
                  <TransactionRow key={t.id} transaction={t} showDate />
                ))}
              </div>
            ) : (
              <EmptyState compact icon={ReceiptText} title="Nada por aqui ainda" description="Suas transações aparecem aqui assim que forem salvas." />
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}

function SummaryLine({ label, value, className, strong, signed }: { label: string; value: number; className?: string; strong?: boolean; signed?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("tabular-nums", strong ? "text-base font-semibold" : "font-medium", className)}>{signed ? formatSignedCurrency(value) : formatCurrency(value)}</dd>
    </div>
  )
}
