import { XIcon } from "lucide-react"

interface CategoryMarkedProps {
  onClick: () => void
  filterName?: string
  color?: string
}

export default function CategoryMarked({ onClick, filterName, color }: CategoryMarkedProps) {
  return(
    <button 
      className={`flex items-center gap-1 shadow dark:bg-zinc-700 bg-white p-2 rounded-md  border-slate-300 dark:hover:bg-zinc-600  hover:bg-slate-100 transition cursor-pointer`}
      onClick={onClick}
    >
      <XIcon size={20} className="dark:text-zinc-400 text-gray-600"/>
      <span className={`${color}`}>{filterName}</span>
    </button>
  )
}