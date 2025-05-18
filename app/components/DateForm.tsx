// components/DateTimePickerForm.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

type FormValues = {
  dateTime: Date;
};

export function DateTimeForm() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dateTime: new Date(),
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Submitted DateTime:", data.dateTime);
    alert(`Submitted: ${data.dateTime.toISOString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="dateTime"
        render={({ field }) => {
          const date = field.value;
          const [time, setTime] = React.useState(() =>
            date ? format(date, "HH:mm") : "12:00"
          );

          const updateDateTime = (
            newDate: Date | undefined,
            newTime?: string
          ) => {
            if (!newDate) return;
            const [hours, minutes] = (newTime || time).split(":").map(Number);
            const updated = new Date(newDate);
            updated.setHours(hours);
            updated.setMinutes(minutes);
            field.onChange(updated);
          };

          return (
            <div className="flex flex-col gap-2">
              <Label>Date and Time</Label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => updateDateTime(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    updateDateTime(date, e.target.value);
                  }}
                  className="w-[100px]"
                />
              </div>
            </div>
          );
        }}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}
