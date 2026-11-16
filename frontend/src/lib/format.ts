const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const compactFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
})

/** R$ 1.234,56 */
export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

/** + R$ 10,00 / − R$ 10,00 — o sinal ajuda quem não distingue as cores */
export function formatSignedCurrency(value: number) {
  const sign = value > 0 ? "+ " : value < 0 ? "− " : ""
  return `${sign}${currencyFormatter.format(Math.abs(value))}`
}

/** R$ 1,2 mil — para eixos de gráfico */
export function formatCompactCurrency(value: number) {
  if (Math.abs(value) < 1000) return `R$ ${Math.round(value)}`
  return `R$ ${compactFormatter.format(value)}`
}

/** 0.123 -> 12,3% */
export function formatPercent(ratio: number) {
  return percentFormatter.format(ratio)
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", options).format(date)
}

export function formatTime(date: Date) {
  return formatDate(date, { hour: "2-digit", minute: "2-digit" })
}
