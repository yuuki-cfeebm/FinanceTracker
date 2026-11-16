"use client"
import { cn } from "@/lib/utils"
import { ChartPie, ClipboardList, LayoutDashboard, Moon, Sun, Wallet, CirclePlus } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// As classes precisam estar escritas por inteiro para o Tailwind gerar o CSS
const navItems = [
  {
    name: "Início",
    href: "/",
    icon: LayoutDashboard,
    active: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    pill: "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    name: "Registrar",
    href: "/gastos",
    icon: CirclePlus,
    active: "bg-green-500/10 text-green-600 dark:text-green-400",
    pill: "bg-green-500/12 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
  {
    name: "Histórico",
    href: "/historico",
    icon: ClipboardList,
    active: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    pill: "bg-orange-500/12 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  },
  {
    name: "Gráficos",
    href: "/dashboard",
    icon: ChartPie,
    active: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    pill: "bg-violet-500/12 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
  },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border bg-card text-muted-foreground transition hover:text-foreground"
    >
      {mounted ? isDark ? <Sun className="size-4" /> : <Moon className="size-4" /> : <span className="size-4" />}
    </button>
  )
}

export default function Header() {
  const pathName = usePathname()

  return (
    <>
      {/* Topo */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
              <Wallet className="size-4" />
            </span>
            <span className="tracking-tight">FinanceTracker</span>
          </Link>

          <nav className="hidden md:block" aria-label="Principal">
            <ul className="flex items-center gap-1 rounded-full border bg-card p-1 shadow-xs">
              {navItems.map((item) => {
                const isActive = pathName === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition",
                        isActive ? item.active : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {/* Barra inferior (mobile) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => {
            const isActive = pathName === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="flex flex-col items-center justify-center gap-1 py-2"
                >
                  <span
                    className={cn(
                      "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                      isActive ? item.pill : "text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
                  </span>
                  <span
                    className={cn(
                      "text-[11px] leading-none",
                      isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
