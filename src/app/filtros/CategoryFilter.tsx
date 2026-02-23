"use client"
import { FieldLabel } from "@/components/ui/field";
import { useFilter } from "@/context/FilterContext";
import { categories } from "@/data/categories";
import { FilterIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function CategoryFilter() {

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { categoriesSelected, handleCheckbox } = useFilter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if(ref.current && !ref.current.contains(event.target as Node)) {
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
      <FieldLabel className="text-gray-600" >
        Selecione uma categoria:
      </FieldLabel>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex gap-1 items-center bg-white py-2 px-4 rounded-md border border-slate-300 hover:bg-slate-100 transition text-gray-600 cursor-pointer shadow"
      >
        <FilterIcon size={20}/>
        Categorias
      </button>

      <AnimatePresence>
        {open && 
          <motion.div
            key="category-dropdown"
            initial={{ opacity: 0, scaleY: 0.8 ,y: -5 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.8, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="bg-white p-4 rounded-lg shadow flex flex-col gap-4 absolute z-10"
          >
            {categories.filter(cat => cat.id != "entrada").map(cat => {
              const Icon = cat.icon 
              const checked = categoriesSelected.includes(cat.id)
              return (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2 cursor-pointer text-lg ${cat.color}`}
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5" 
                    onChange={() => handleCheckbox(cat.id)}
                    checked={checked}
                  />
                  {Icon && <Icon size={20} />}
                  {cat.name}
                </label>
              )
            })}
          </motion.div>
          }
      </AnimatePresence>
    </div>
  )
}