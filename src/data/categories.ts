import { Category } from "@/types/category";
import { Car, CreditCard, GraduationCap, HeartPulse, Home, PartyPopper, Utensils } from "lucide-react";

export const categories: Category[] = [
  {id: "comida", name: "Comida", background:"bg-yellow-100" , color: "text-yellow-500", icon: Utensils, border: "border-yellow-500"},
  {id: "transporte", name: "Transporte", background:"bg-blue-100" , color: "text-blue-500", icon: Car, border: "border-blue-500" },
  {id: "casa", name: "Casa", background:"bg-orange-100" , color: "text-orange-500", icon: Home, border: "border-orange-500"},
  {id: "saude", name: "Saúde", background:"bg-pink-100" , color: "text-pink-500", icon: HeartPulse, border: "border-pink-500"},
  {id: "educacao", name: "Educação", background:"bg-violet-100" , color: "text-violet-500", icon: GraduationCap, border: "border-violet-500"},
  {id: "lazer", name: "Lazer", background:"bg-green-100" , color: "text-green-500", icon: PartyPopper, border: "border-green-500"},
  {id: "cartao", name: "Cartão", background:"bg-slate-100" , color: "text-slate-500", icon: CreditCard, border: "border-slate-500"}
]