import { Transaction } from "@/types/transaction"
import { categories } from "@/data/categories"
import { BanknoteArrowDown } from "lucide-react"

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem( { transaction }: TransactionItemProps) {
  const { value, description, valueType, category, createdAt } = transaction
  const categoryInfo = categories.find(cat => cat.id === category)
  const Icon = categoryInfo?.icon

  return(
    <div className={`bg-white rounded-lg border ${valueType == "saida" ? categoryInfo?.color : "border-green-700"} py-2 px-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-16">
          <span className={` text-xl ${value < 0 ? "text-red-500" : "text-green-500"}`}>R$ {value}</span>
          <span className="text-gray-400">{description}</span>
        </div>
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-2">
            {valueType === "saida" ? Icon && <Icon key={category} size={30}/> : <BanknoteArrowDown color="#4CAF50"/>}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-lg">{new Date(createdAt).toLocaleDateString("pt-br")}</span>
            <span className="text-gray-400">{new Date(createdAt).toLocaleTimeString("pt-br")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}