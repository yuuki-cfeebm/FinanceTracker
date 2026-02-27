"use client"
import { FieldLabel } from "@/components/ui/field";
import FilterButton from "@/components/ui/FilterButton";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ListFilter } from "lucide-react";
import { useFilter } from "@/context/FilterContext";

export default function OrderBy() {

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { orderBy, setOrderBy} = useFilter()

  const optionSelect = [
    {name: "Mais Antigo", onclick: () => setOrderBy("antigo")},
    {name: "Mais Recente", onclick: () => setOrderBy("recente")},
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if(ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
      if(orderBy === "antigo" || orderBy === "recente"){
        setOpen(false)
      } 
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return(
    <div className="relative" ref={ref}>
      <FieldLabel className=" text-gray-600" >
        Ordenar por:
      </FieldLabel>
      <FilterButton 
        onClick={() => setOpen(!open)}
        className="dark:bg-zinc-700 w-40 gap-2"
      >
        <ListFilter size={20} color="#a1a1aa"/>
        <span className="dark:text-zinc-400">{orderBy === "antigo" ? "Mais Antigo" : "Mais Recente" }</span>
      </FilterButton>
        
      <AnimatePresence>
        {open &&
          <motion.div
            key="order-dropdown"
            initial={{ opacity: 0, scaleY: 0.8 ,y: -5 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.8, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="flex flex-col absolute dark:bg-zinc-700 bg-white rounded-lg shadow mt-0.5 overflow-hidden w-30"
          >
            {optionSelect.map(option => 
              (
               <button 
                onClick={option.onclick}
                className="dark:hover:bg-zinc-500 hover:bg-gray-200 px-2 py-2 text-start"
              >
                <span className="dark:text-zinc-400">{option.name}</span>
              </button>
              )
            )}
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}