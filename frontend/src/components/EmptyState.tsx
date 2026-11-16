import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
  compact?: boolean
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 py-8" : "gap-3 py-14",
        className
      )}
    >
      <div className="relative mb-1">
        <div className="absolute inset-0 -m-3 rounded-full bg-brand/5" />
        <div
          className={cn(
            "relative flex items-center justify-center rounded-2xl border bg-card text-muted-foreground shadow-sm",
            compact ? "size-10" : "size-14"
          )}
        >
          <Icon className={compact ? "size-5" : "size-6"} strokeWidth={1.75} />
        </div>
      </div>
      <p className={cn("font-medium", compact ? "text-sm" : "text-base")}>{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-balance text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
