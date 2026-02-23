import { Category } from "@/types/category";
import { Car, CreditCard, GraduationCap, HeartPulse, Home, PartyPopper, Utensils } from "lucide-react";

export const categories: Category[] = [
  {id: "comida", name: "Comida", background:"bg-yellow-100" , color: "text-yellow-500", icon: Utensils, border: "border-yellow-500"},
  {id: "transporte", name: "Transporte", background:"bg-blue-100" , color: "text-blue-500", icon: Car, border: "border-blue-500" },
  {id: "casa", name: "Casa", background:"bg-orange-100" , color: "text-orange-500", icon: Home, border: "border-orange-500"},
  {id: "saude", name: "Saúde", background:"bg-pink-100" , color: "text-pink-500", icon: HeartPulse, border: "border-pink-500"},
  {id: "educacao", name: "Educação", background:"bg-violet-100" , color: "text-violet-500", icon: GraduationCap, border: "border-violet-500"},
  {id: "lazer", name: "Lazer", background:"bg-green-100" , color: "text-green-500", icon: PartyPopper, border: "border-green-500"},
  {id: "cartao", name: "Cartão", background:"bg-slate-100" , color: "text-slate-500", icon: CreditCard, border: "border-slate-500"},
  {id: "entrada", name: "Entrada"}
]

export const categoryColors: Record<string, string> = {
  comida: "bg-yellow-500",    
  transporte: "bg-blue-500", 
  casa: "bg-orange-500",       
  saude: "bg-pink-500",      
  educacao: "bg-violet-500",   
  lazer: "bg-green-500",      
  cartao: "bg-gray-500",    
  entrada: "bg-green-200"
}

export const pieChartColors: Record<string, string> = {
  comida: "#EAB308",    
  transporte: "#3B82F6", 
  casa: "#F97316",       
  saude: "#EC4899",      
  educacao: "#8B5CF6",   
  lazer: "#22C55E",      
  cartao: "#64748B",  
  entrada: "#A5D6A7"   
}