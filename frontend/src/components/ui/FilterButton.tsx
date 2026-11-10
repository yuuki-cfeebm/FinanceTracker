import { ReactNode } from "react";

interface FilterButtonProps {
  children: ReactNode
  onClick: () => void
  className?: string
}

export default function FilterButton( { children, onClick, className }: FilterButtonProps) {
  return(
    <button className={`flex items-center gap-1 shadow bg-white p-2 rounded-md border-slate-300 hover:bg-slate-100 transition cursor-pointer text-gray-600 ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}