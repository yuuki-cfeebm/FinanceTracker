import Link from "next/link";

export default function Header() {
  return(
    <header className="w-full bg-white shadow-md shadow-blue-100">
      <div className="max-w-6xl mx-auto flex py-6 px-2 text-xl">  
        <div className="">FinanceTracker</div>
        <nav className="w-full flex items-center justify-center ">
          <ul className="flex gap-12 items-center text-gray-500">
            <li className="">
              <Link href={"/gastos"}>Registrar Transação</Link>
            </li>
            <li>
              <Link href={"/historico"}>Histórico de Transações</Link>
            </li>
            <li>
              outro
            </li>
            <li>
              outro
              </li>
          </ul>
        </nav>
        <div className="">naosei</div>
      </div>
    </header>
  )
}