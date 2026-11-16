import { LucideIcon } from "lucide-react"

export type Category = {
  id: string
  name: string
  /** cor do texto/ícone (com variante dark) */
  color: string
  /** fundo suave (com variante dark) */
  background: string
  /** borda quando selecionada */
  border: string
  /** cor usada nos gráficos (paleta validada para daltonismo) */
  hex: string
  icon: LucideIcon
}
