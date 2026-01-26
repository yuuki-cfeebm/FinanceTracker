import { ReactNode } from "react";

interface FilterButtonProps {
  children: ReactNode
  onClick: () => void
}

export default function FilterButton( { children, onClick }: FilterButtonProps) {
  return(
    <button className="flex items-center gap-1 shadow bg-white p-2 rounded-md border-slate-300 hover:bg-slate-100 transition cursor-pointer text-gray-600" onClick={onClick}>
      {children}
    </button>
  )
}