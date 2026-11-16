"use client"
import { Orderby } from "@/types/orderBy"
import { endOfDay, startOfDay } from "date-fns"
import { createContext, ReactNode, useContext, useState } from "react"
import { DateRange } from "react-day-picker"

interface FilterContextType {
  //categories
  categoriesSelected: string[]
  handleCheckbox: (id: string) => void
  //data
  dateRange?: DateRange
  setDateRange: (range?: DateRange) => void
  isInDateRange: (date: Date, range: DateRange | undefined) => boolean
  //order
  orderBy: Orderby
  setOrderBy: (value: Orderby) => void
  clearFilters: () => void
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([])
  const [orderBy, setOrderBy] = useState<Orderby>("recente")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  function handleCheckbox(id: string) {
    setCategoriesSelected((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    )
  }

  // Aceita intervalo com só o início (um único dia) e inclui o último dia inteiro
  function isInDateRange(date: Date, range?: DateRange) {
    if (!range?.from) return true
    const to = range.to ?? range.from
    return date >= startOfDay(range.from) && date <= endOfDay(to)
  }

  function clearFilters() {
    setCategoriesSelected([])
    setDateRange(undefined)
  }

  return (
    <FilterContext.Provider
      value={{
        dateRange,
        setDateRange,
        orderBy,
        setOrderBy,
        categoriesSelected,
        handleCheckbox,
        isInDateRange,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) throw new Error("deve ser usado dentro de FilterProvider")
  return context
}
