interface ExpensesProps {
  expense: number
}

export default function Expenses({ expense }: ExpensesProps) {
  return(
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <span className="text-gray-400 font-bold">Saída Total:</span>
        <span className="text-4xl text-red-500">{expense.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</span>
      </div>
    </div>
  )
}