"use client"
import { ChangeEvent, InputHTMLAttributes } from "react"

const formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

interface MoneyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  cents: number
  onChange: (cents: number) => void
  maxDigits?: number
}

export default function MoneyInput({
  cents,
  onChange,
  maxDigits = 11,
  ...props
}: MoneyInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // keeps only digits: "R$ 1.234,5" -> "12345"
    const digits = e.target.value.replace(/\D/g, "").slice(0, maxDigits)
    onChange(Number(digits))
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="R$ 0,00"
      value={cents === 0 ? "" : `R$ ${formatter.format(cents / 100)}`}
      onChange={handleChange}
    />
  )
}