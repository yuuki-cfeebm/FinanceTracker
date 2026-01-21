import Link from "next/link";

export default function Header() {
  return(
    <header className="w-full ">
      <div className="max-w-7xl mx-auto flex p-4">  
        <div className="">FinanceTracker</div>
        <nav className="w-full flex items-center justify-center ">
          <ul className="flex gap-12 items-center ">
            <li className="">
              <Link href={"/gastos"}>Registrar</Link>
            </li>
            <li>
              outro
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