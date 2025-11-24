"use client"

import * as React from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from "dayjs"

interface DateSelectionProps {
  date: Date | undefined;
  onDateSelect: (date: Date) => void;
}

export function DateSelection({ date, onDateSelect }: DateSelectionProps) {
  const [open, setOpen] = React.useState(false)

  const onDateChange = (date: Date) => {
    setOpen(false)
    onDateSelect(date)
  }
 
  return (
    <div className="flex flex-1 flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal cursor-pointer"
          >
            {date ? dayjs(date).format("dddd, DD MMM YYYY") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full overflow-hidden p-2 flex flex-col gap-2" align="start">
          <Calendar
            mode="single"
            selected={date ? dayjs(date).toDate() : undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onDateChange(date)
              }
            }}

            disabled={{
              before: dayjs().toDate(),
            }}
            endMonth={dayjs().add(10, 'years').toDate()}
            startMonth={dayjs().toDate()}
          />
          <div className="flex gap-2">
            {/* Show the date range of the next 7 days */}
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => onDateChange(dayjs().toDate())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => onDateChange(dayjs().add(1, 'day').toDate())}
            >
              Tomorrow
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
