import { DateFilter } from "../filtros/DateFilter";

export default function Expenses() {
  return(
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-2">
        <span className="text-gray-400">Valor total gasto:</span>
        <span className="text-4xl text-red-500">R$: 1010101</span>
      </div>
    </div>
  )
}