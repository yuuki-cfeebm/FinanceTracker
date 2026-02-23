export default function Profit( {profit}: {profit: number}) {
  return(
    <div className="flex flex-col gap-4">
      <p className="text-gray-400 font-bold">Entrada Total:</p>
      <p className="text-green-500 text-4xl pl-4">{profit.toLocaleString("pt-br", { style: "currency", currency: "BRL"})}</p>
  </div>
  )
}