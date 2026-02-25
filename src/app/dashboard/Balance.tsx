interface BalanceProps {
  balance: number
  expense: number
  profit: number
}

export default function Balance({ balance, expense, profit }: BalanceProps) {
  return (
    <div className="flex flex-col justify-around gap-6 w-full h-full">
      <div className="flex w-full gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 font-bold">Total Saída: </p>
          <p className="text-red-500 text-2xl pl-4">{expense.toLocaleString("pt-br", { style: "currency", currency: "BRL"})}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 font-bold">Total Entrada: </p>
          <p className="text-green-500 text-2xl pl-4">{profit.toLocaleString("pt-br", { style: "currency", currency: "BRL"})}</p>
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-400"></div>
      <div className="flex flex-col gap-4">
        <p className="text-gray-400 font-bold">Saldo:</p>
        <p className={`text-4xl pl-4 ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>{balance.toLocaleString("pt-br", { style: "currency", currency: "BRL"})}</p>
      </div>
    </div>
  )
}