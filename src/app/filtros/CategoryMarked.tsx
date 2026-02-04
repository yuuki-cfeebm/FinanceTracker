import { XIcon } from "lucide-react"

interface CategoryMarkedProps {
  onClick: () => void
  filterName?: string
  color?: string
}

export default function CategoryMarked({ onClick, filterName, color }: CategoryMarkedProps) {
  return(
    <button 
      className={`flex items-center gap-1 shadow bg-white p-2 rounded-md border-slate-300 hover:bg-slate-100 transition cursor-pointer`}
      onClick={onClick}
    >
      <XIcon size={20} className="text-gray-600"/>
      <span className={`${color}`}>{filterName}</span>
    </button>
  )
}