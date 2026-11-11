"use client"
import TitlePage from "@/components/TitlePage"
import { useTransaction } from "@/context/TransactionContext"
import { categories } from "@/data/categories"
import { TransactionType } from "@/types/transaction"
import { AnimatePresence, motion } from "motion/react"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import TransactionInput from "@/components/TransactionInput"


export default function TransactionsClient() {
  const { addTransaction, cancelTransaction } = useTransaction()

  const [selectedCategory, setSelectedCategory] = useState("")
  const [type, setType] = useState<TransactionType>("saida")
  // const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [cents, setCents] = useState(0)


  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (cents <= 0) {
      toast.error("Enter a valid amount", { position: "bottom-right" })
      return
    }

    if (type === "saida" && !selectedCategory) {
      toast.error("Select a category", { position: "bottom-right" })
      return
    }

    const value = cents / 100

    const success = await addTransaction({
      value: type === "saida" ? -value : value,
      valueType: type,
      category: type === "saida" ? selectedCategory : "Entrada",
      description: description || undefined,
      createdAt: new Date(),
    })

    if (success) {
      setCents(0)
      setDescription("")
      setSelectedCategory("")
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <TitlePage title="Register Transactions" />
      <div className="flex text-xl justify-center items-center gap-18 dark:bg-zinc-700 bg-gray-100 w-80 h-14 mx-auto relative px-10 py-2 z-1 border-blue-500 rounded-full dark:text-white">
        <div
          className={`absolute w-36 h-10 dark:bg-blue-500 bg-blue-200 opacity-50 rounded-full transition ${
            type === "saida" ? "-translate-x-20" : "translate-x-20"
          }`}
        ></div>
        <button
          className="px-4 py-1 z-1 cursor-pointer absolute left-9"
          type="button"
          onClick={() => setType("saida")}
        >
          Saída
        </button>
        <button
          className="px-4 py-1 z-1 cursor-pointer absolute right-6"
          type="button"
          onClick={() => setType("entrada")}
        >
          Entrada
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center max-w-2xl w-full dark:bg-zinc-800 bg-white p-4 mx-auto rounded-xl gap-10 border border-blue-500"
      >
        <div className="flex justify-center">
          <TransactionInput
            cents={cents}
            onChange={setCents}
            className="text-center py-2 text-2xl border-b-2 border-gray-200 w-52 outline-none focus:border-blue-400 transition"
          />
        </div>  

        <AnimatePresence mode="wait">
          {type === "saida" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <label className="text-gray-500 block mb-2">Category:</label>

              <div className="flex flex-wrap gap-4 justify-center p-1">
                {categories
                  .filter((cat) => cat.id !== "income")
                  .map((item) => {
                    const Icon = item.icon

                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center justify-center gap-2 w-40 h-12 rounded-xl 
                          dark:bg-zinc-700 ${item.background} ${item.color} font-bold cursor-pointer border-2
                          ${selectedCategory === item.id ? item.border : "border-transparent"}
                        `}
                        onClick={() => setSelectedCategory(item.id)}
                        type="button"
                      >
                        {Icon && <Icon size={22} />}
                        {item.name}
                      </motion.button>
                    )
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col w-full">
          <textarea
            className="max-h-20 p-2 dark:bg-zinc-700 bg-gray-100 rounded-lg focus:ring-2 ring-blue-400 outline-none transition"
            placeholder="Description..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>

        <div className="flex justify-around w-full">
          <button
            type="button"
            className="text-xl font-bold text-white bg-red-500 px-16 py-4 rounded-xl cursor-pointer border border-transparent hover:border-red-500 hover:bg-red-100 dark:hover:bg-zinc-700 hover:text-red-500 transition"
            onClick={cancelTransaction}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="text-xl font-bold text-white bg-blue-500 px-16 py-4 rounded-xl cursor-pointer border border-transparent hover:border-blue-500 dark:hover:bg-zinc-700 hover:bg-blue-100 hover:text-blue-500 transition"
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  )
}