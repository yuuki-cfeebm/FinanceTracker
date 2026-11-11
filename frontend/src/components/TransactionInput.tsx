"use client"
import { ChangeEvent, InputHTMLAttributes } from "react"

const formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

interface TransactionInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  cents: number
  onChange: (cents: number) => void
  maxDigits?: number
}

export default function TransactionInput({
  cents,
  onChange,
  maxDigits = 11,
  ...props
}: TransactionInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
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