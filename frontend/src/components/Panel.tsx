import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface PanelProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/** Cartão padrão das páginas: título, descrição opcional e uma ação à direita. */
export default function Panel({ title, description, action, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={cn("flex flex-col rounded-2xl border bg-card shadow-xs", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="flex flex-col gap-0.5">
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  )
}
