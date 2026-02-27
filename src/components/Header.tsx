"use client"
import { Banknote, ChartPie, ClipboardList, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    {name: "Registrar", href: "/gastos", bgColor: "bg-green-500", underline: "after:bg-green-500", icon: <Banknote color="#4CAF50"/>},
    {name: "Histórico", href: "/historico", bgColor: "bg-orange-500", underline: "after:bg-orange-500", icon: <ClipboardList color="#FF9800"/>},
    {name: "Gráficos", href: "/dashboard", bgColor: "bg-violet-500", underline: "after:bg-violet-500", icon: <ChartPie color="#9C27B0"/>}
  ]

  const pathName = usePathname()

  return(
    <header className="w-full ">
      <div className="max-w-6xl mx-auto flex justify-center items-center py-4 px-4 text-lg">  
        <div className="">FinanceTracker</div>
        <nav className="w-full h-full flex items-center justify-center ">
          <ul className="flex gap-12 items-center ">
            {navItems.map((item) => {
              const isActive = pathName === item.href

            return(
              <li
                className={`flex gap-2 items-center relative transition-all after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform after:duration-300 pb-2 ${item.underline}
                ${isActive ? "after:scale-x-100" : "after:scale-x-0"}
                `}
              > 
                {item.icon}
                <Link href={item.href}>{item.name}</Link>
              </li>
            ) 
            } 
            )}
          </ul>
        </nav>
        <button 
          onClick={toggleTheme}
          className="cursor-pointer p-1"
        >
          {theme === "dark" ? <Sun size={26}/> : <Moon size={26}/>}

        </button>
      </div>
    </header>
  )
}