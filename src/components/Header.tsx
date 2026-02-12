"use client"
import { Banknote, ChartPie, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {

  const pathName = usePathname()

  return(
    <header className="w-full">
      <div className="max-w-6xl mx-auto flex justify-center py-4 px-4 text-lg relative">  
        <div className="">FinanceTracker</div>
        <nav className="w-full h-full flex items-center justify-center">
          <ul className="flex gap-12 items-center text-black">
            <li className="flex gap-2 items-center">
              <Banknote color="#4CAF50" />
              <Link href={"/gastos"}>Registrar Transação</Link>
            </li>
            <li className="flex gap-2 items-center">
              <ClipboardList color="#FF9800" />
              <Link href={"/historico"}>Histórico de Transações</Link>
            </li >
            <li className="flex gap-2 items-center">
              <ChartPie color="#9C27B0"/>
              <Link href={"/dashboard"}>Gráficos</Link>
            </li>
          </ul>
        </nav>
        <div className="">naosei</div>
      </div>
    </header>
  )
}