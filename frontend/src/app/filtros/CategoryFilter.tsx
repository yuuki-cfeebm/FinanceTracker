"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFilter } from "@/context/FilterContext"
import { categories } from "@/data/categories"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Tags } from "lucide-react"
import { filterButtonClass } from "./DateFilter"

export default function CategoryFilter({ className }: { className?: string }) {
  const { categoriesSelected, handleCheckbox } = useFilter()
  const count = categoriesSelected.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cn(filterButtonClass, count > 0 && "border-brand/40", className)}>
          <Tags className="size-4 text-muted-foreground" />
          Categorias
          {count > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[11px] text-white">{count}</span>
          )}
          <ChevronDown className="ml-auto size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 rounded-2xl p-1.5" align="start" sideOffset={8}>
        {categories.map((cat) => {
          const Icon = cat.icon
          const checked = categoriesSelected.includes(cat.id)
          return (
            <button
              key={cat.id}
              type="button"
              role="menuitemcheckbox"
              aria-checked={checked}
              onClick={() => handleCheckbox(cat.id)}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition hover:bg-muted"
            >
              <span className={cn("flex size-7 items-center justify-center rounded-lg", cat.background, cat.color)}>
                <Icon className="size-4" />
              </span>
              {cat.name}
              <span
                className={cn(
                  "ml-auto flex size-4.5 items-center justify-center rounded border transition",
                  checked && "border-brand bg-brand text-white"
                )}
              >
                {checked && <Check className="size-3" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
