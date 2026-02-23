"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFilter } from "@/context/FilterContext"

export function DateFilter() {

  const { dateRange, setDateRange } = useFilter()

  return (
    <Field className="w-auto gap-1">
      <FieldLabel className="text-gray-600" htmlFor="date-picker-range">Selecione um intervalo de data:</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="text-gray-600 justify-start p-2 font-normal text-md"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Selecione uma data: </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="end" side="bottom" sideOffset={8}>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
