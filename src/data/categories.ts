import { Category } from "@/types/category";
import { Car, CreditCard, GraduationCap, HeartPulse, Home, PartyPopper, Utensils } from "lucide-react";

export const categories: Category[] = [
  {id: "comida", name: "Comida", background:"bg-yellow-100" , color: "text-yellow-500", icon: Utensils},
  {id: "transporte", name: "Transporte", background:"bg-blue-100" , color: "text-blue-500", icon: Car },
  {id: "casa", name: "Casa", background:"bg-orange-100" , color: "text-orange-500", icon: Home},
  {id: "saude", name: "Saúde", background:"bg-pink-100" , color: "text-pink-500", icon: HeartPulse},
  {id: "educacao", name: "Educação", background:"bg-violet-100" , color: "text-violet-500", icon: GraduationCap},
  {id: "lazer", name: "Lazer", background:"bg-green-100" , color: "text-green-500", icon: PartyPopper},
  {id: "cartao", name: "Cartão", background:"bg-slate-100" , color: "text-slate-500", icon: CreditCard}
]