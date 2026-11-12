"use client"
import { useFilter } from "@/context/FilterContext"
import { cn } from "@/lib/utils"
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react"
import { filterButtonClass } from "./DateFilter"

/** Alterna entre mais recente e mais antigo com um clique. */
export default function OrderBy({ className }: { className?: string }) {
  const { orderBy, setOrderBy } = useFilter()
  const recent = orderBy === "recente"
  const Icon = recent ? ArrowDownWideNarrow : ArrowUpNarrowWide

  return (
    <button
      type="button"
      onClick={() => setOrderBy(recent ? "antigo" : "recente")}
      aria-label={`Ordenação: ${recent ? "mais recentes primeiro" : "mais antigas primeiro"}. Clique para inverter.`}
      className={cn(filterButtonClass, className)}
    >
      <Icon className="size-4 text-muted-foreground" />
      {recent ? "Mais recentes" : "Mais antigas"}
    </button>
  )
}
