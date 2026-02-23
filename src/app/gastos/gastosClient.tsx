"use client"
import { useTransaction } from "@/context/TransactionContext"
import { categories } from "@/data/categories"
import { AnimatePresence, motion } from "motion/react"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

export default function GastosClient() {

  const { addTransaction, cancelTransaction} = useTransaction()
  
  const [catSelected, setCatSelected] = useState<string>("")
  const [inputType, setInputType] = useState<"saida" | "entrada">("saida")
  const [input, setInput] = useState("")
  const [description, setDescription] = useState<string | undefined>(undefined)

  function handleSubmitForm(event: FormEvent) {
    event.preventDefault()
    const value = Number(input)

    if(input === "" || isNaN(value)){
      alert("Digite um valor válido")
      return
    }

    if(inputType == "entrada") {
      if(!input) {
        alert("Preencha todos os campos!")
        return
      }
    } else if(inputType == "saida") {
      if(!input || !catSelected) {
        alert("preencha os campos obrigatórios")
        return 
      }
    }

    addTransaction({
      id: crypto.randomUUID(),
      value: inputType == "saida" ? -value : value,
      valueType: inputType,
      category: inputType == "saida" ? catSelected : undefined,
      description: description,
      createdAt: new Date()
    })

    toast.success("Transação registrada com sucesso!", {position: "bottom-right"})
    setInput("")
    setDescription("")
    setCatSelected("")
  }

  return(
    <div className="flex flex-col items-center gap-12">
      <h1 className="text-4xl pt-6">Registrar Gastos</h1>
      <form className="flex flex-col items-center w-2xl bg-white p-4 mx-auto rounded-xl gap-10">
        <div className="flex text-xl justify-center items-center gap-18 bg-gray-100 w-80 mx-auto relative px-10 py-2 z-1 border-b-2 border-gray-300 rounded-t-xl">
          <div className={`absolute w-36 h-10 bg-white opacity-50 rounded-xl transition ${inputType == "saida" ? "-translate-x-20" : "translate-x-20"}`}></div>
          <button className="px-4 py-1 z-1 cursor-pointer" type="button" onClick={() => setInputType("saida")}>
            Saída
          </button>
          <button className="px-4 py-1 z-1 cursor-pointer" type="button" onClick={() => setInputType("entrada")}>
            Entrada
          </button>
        </div>
        <div className="flex justify-center">
          <input 
            type="number"
            step="0.01"
            className="text-center py-2 text-2xl border-b-2 border-gray-200 w-52 outline-none focus:border-blue-400 transition" placeholder="Digite o valor"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
        <AnimatePresence mode="wait">
          {inputType === "saida" && (
            <motion.div
              key={"category"}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0}}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <label className="text-gray-500 block mb-2">
                Categoria:
              </label>

              <div className="flex flex-wrap gap-4 justify-center">

              {categories.filter(cat => cat.id != "entrada").map(item => {
                const Icon = item.icon
                
                return(
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center gap-2 w-40 h-12 rounded-xl 
                      ${item.background} ${item.color} font-bold cursor-pointer border-2
                      ${catSelected === item.id ? item.border : "border-transparent"}
                    `}
                    onClick={() => setCatSelected(item.id)}
                    type="button"
                  >
                    {Icon && <Icon size={22}/>}
                    {item.name}
                  </motion.button>

                )
              })
              }
              </div>

            </motion.div>
          )}
        </AnimatePresence> 
        <div className="flex flex-col w-full">
          <textarea 
            className="max-h-20 p-1 bg-gray-100 rounded-lg focus:ring-2 ring-blue-400 outline-none transition" 
            placeholder="Descrição..." 
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="flex justify-around w-full">
          <button 
            type="button" 
            className="text-xl font-bold text-white bg-red-500 px-16 py-4 rounded-xl cursor-pointer hover:bg-red-600 transition"
            onClick={cancelTransaction}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="text-xl font-bold text-white bg-blue-500 px-16 py-4 rounded-xl cursor-pointer hover:bg-blue-600 transition"
            onClick={handleSubmitForm}
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  )
}