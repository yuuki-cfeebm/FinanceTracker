import { Category } from "@/types/category"
import {
  ArrowDownLeft,
  Car,
  CircleHelp,
  CreditCard,
  GraduationCap,
  HeartPulse,
  Home,
  PartyPopper,
  Utensils,
} from "lucide-react"

/**
 * A ordem e os `hex` foram validados (contraste, separação para daltonismo)
 * nos temas claro e escuro. Se mudar uma cor, valide de novo.
 */
export const categories: Category[] = [
  { id: "alimentacao", name: "Alimentação", icon: Utensils, hex: "#B7791F", color: "text-yellow-700 dark:text-yellow-400", background: "bg-yellow-100 dark:bg-yellow-500/15", border: "border-yellow-500" },
  { id: "transporte", name: "Transporte", icon: Car, hex: "#3B82F6", color: "text-blue-600 dark:text-blue-400", background: "bg-blue-100 dark:bg-blue-500/15", border: "border-blue-500" },
  { id: "casa", name: "Casa", icon: Home, hex: "#EA580C", color: "text-orange-600 dark:text-orange-400", background: "bg-orange-100 dark:bg-orange-500/15", border: "border-orange-500" },
  { id: "saude", name: "Saúde", icon: HeartPulse, hex: "#DB2777", color: "text-pink-600 dark:text-pink-400", background: "bg-pink-100 dark:bg-pink-500/15", border: "border-pink-500" },
  { id: "educacao", name: "Educação", icon: GraduationCap, hex: "#8B5CF6", color: "text-violet-600 dark:text-violet-400", background: "bg-violet-100 dark:bg-violet-500/15", border: "border-violet-500" },
  { id: "lazer", name: "Lazer", icon: PartyPopper, hex: "#16A34A", color: "text-green-600 dark:text-green-400", background: "bg-green-100 dark:bg-green-500/15", border: "border-green-500" },
  { id: "cartao", name: "Cartão", icon: CreditCard, hex: "#0891B2", color: "text-cyan-600 dark:text-cyan-400", background: "bg-cyan-100 dark:bg-cyan-500/15", border: "border-cyan-500" },
]

export const incomeCategory: Category = {
  id: "entrada",
  name: "Entrada",
  icon: ArrowDownLeft,
  hex: "#0D9488",
  color: "text-teal-600 dark:text-teal-400",
  background: "bg-teal-100 dark:bg-teal-500/15",
  border: "border-teal-500",
}

const otherCategory: Category = {
  id: "outros",
  name: "Outros",
  icon: CircleHelp,
  hex: "#71717A",
  color: "text-zinc-600 dark:text-zinc-400",
  background: "bg-zinc-100 dark:bg-zinc-500/15",
  border: "border-zinc-500",
}

/** Resolve o id salvo na transação ("comida", "Entrada"...) para a categoria. */
export function getCategory(id?: string): Category {
  const key = id?.toLowerCase()
  if (!key) return otherCategory
  if (key === incomeCategory.id) return incomeCategory
  return categories.find((c) => c.id === key) ?? otherCategory
}
