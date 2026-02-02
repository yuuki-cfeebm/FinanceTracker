"use client"
// import { DateRange } from "@/types/DateRange";
import { Orderby } from "@/types/orderBy";
import { createContext, ReactNode, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

interface FilterContextType {
  //categories
  categoriesSelected: string[]
  handleCheckbox: (id: string) => void
  //data
  dateRange?: DateRange
  setDateRange: (range?: DateRange) => void
  //order
  orderBy: Orderby
  setOrderBy: (value: Orderby) => void
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: {children: ReactNode}) {

  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([])
  const [orderBy, setOrderBy] = useState<Orderby>("recente")
  const [dateRange, setDateRange ] = useState<DateRange | undefined>()

  function handleCheckbox(id: string) {
    setCategoriesSelected(prev => 
      prev.includes(id)
      ? prev.filter(catId => catId !== id)
      : [...prev, id]
    )
  }
  
  return(
    <FilterContext.Provider value={{ dateRange, setDateRange , orderBy, setOrderBy, categoriesSelected, handleCheckbox }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if(!context) throw new Error("deve ser usado dentro de FilterProvider")
    return context
}