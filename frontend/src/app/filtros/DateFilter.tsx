"use client"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFilter } from "@/context/FilterContext"
import { cn } from "@/lib/utils"
import { endOfDay, endOfMonth, format, isSameDay, startOfDay, startOfMonth, subDays, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"

export const filterButtonClass =
  "flex h-10 cursor-pointer items-center gap-2 rounded-xl border bg-card px-3 text-sm font-medium shadow-xs transition hover:bg-muted"

function presets(): { label: string; range: DateRange | undefined }[] {
  const now = new Date()
  const lastMonth = subMonths(now, 1)
  return [
    { label: "Últimos 7 dias", range: { from: startOfDay(subDays(now, 6)), to: endOfDay(now) } },
    { label: "Últimos 30 dias", range: { from: startOfDay(subDays(now, 29)), to: endOfDay(now) } },
    { label: "Este mês", range: { from: startOfMonth(now), to: endOfDay(now) } },
    { label: "Mês passado", range: { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) } },
    { label: "Todo o período", range: undefined },
  ]
}

function sameRange(a?: DateRange, b?: DateRange) {
  if (!a?.from || !b?.from) return !a?.from && !b?.from
  return isSameDay(a.from, b.from) && isSameDay(a.to ?? a.from, b.to ?? b.from)
}

export function rangeLabel(range?: DateRange) {
  if (!range?.from) return "Todo o período"
  const preset = presets().find((p) => sameRange(p.range, range))
  if (preset) return preset.label
  const from = format(range.from, "dd MMM", { locale: ptBR })
  if (!range.to || isSameDay(range.from, range.to)) return format(range.from, "dd MMM yyyy", { locale: ptBR })
  return `${from} – ${format(range.to, "dd MMM yyyy", { locale: ptBR })}`
}

export function DateFilter({ className }: { className?: string }) {
  const { dateRange, setDateRange } = useFilter()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={cn(filterButtonClass, dateRange?.from && "border-brand/40", className)}>
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="truncate">{rangeLabel(dateRange)}</span>
          <ChevronDown className="ml-auto size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(20rem,calc(100vw-2rem))] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-2xl p-0 sm:w-auto"
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        <div className="flex flex-col sm:flex-row">
          {/* mobile: grade 2 colunas; desktop: coluna lateral */}
          <div className="grid grid-cols-2 gap-1 border-b p-2 sm:flex sm:w-40 sm:flex-col sm:border-r sm:border-b-0">
            {presets().map((p) => {
              const active = sameRange(p.range, dateRange)
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setDateRange(p.range)
                    setOpen(false)
                  }}
                  className={cn(
                    "cursor-pointer truncate rounded-lg px-3 py-2 text-left text-sm transition last:col-span-2",
                    active ? "bg-brand/10 font-medium text-brand" : "hover:bg-muted"
                  )}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col">
            <Calendar
              mode="range"
              locale={ptBR}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              className="mx-auto"
            />
            {dateRange?.from && (
              <button
                type="button"
                onClick={() => setDateRange(undefined)}
                className="mx-3 mb-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" /> Limpar período
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
