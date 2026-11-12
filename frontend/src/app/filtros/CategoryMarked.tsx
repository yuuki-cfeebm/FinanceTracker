import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

interface CategoryMarkedProps {
  onClick: () => void
  filterName?: string
  className?: string
}

/** Chip de filtro ativo; clicar remove o filtro. */
export default function CategoryMarked({ onClick, filterName, className }: CategoryMarkedProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remover filtro ${filterName}`}
      className={cn(
        "flex h-7 cursor-pointer items-center gap-1 rounded-full border pr-2 pl-3 text-xs font-medium transition hover:bg-muted",
        className
      )}
    >
      {filterName}
      <XIcon className="size-3.5 text-muted-foreground" />
    </button>
  )
}
