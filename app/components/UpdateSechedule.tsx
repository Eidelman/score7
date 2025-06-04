"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { updateSchedule } from "@/actions/match.actions";

import React from "react";
import { Label } from "@radix-ui/react-label";

import { Controller, useForm } from "react-hook-form";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  schedule_id: number;
  startTime: Date;
  torneio_id: number;
}

type FormValues = {
  date: Date;
};

const TimePicker = ({
  value,
  onChange,
}: {
  value: Date;
  onChange: (date: Date) => void;
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const selectedHour = value ? value.getHours() : 0;
  const selectedMinute = value ? value.getMinutes() : 0;

  const updateTime = (hour: number, minute: number) => {
    if (value) {
      const updated = setMinutes(setHours(value, hour), minute);
      onChange(updated);
    }
  };

  return (
    <div className="flex gap-4 p-2 border-t">
      <select
        className="border rounded px-2 py-1"
        value={selectedHour}
        onChange={(e) => updateTime(parseInt(e.target.value), selectedMinute)}
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        className="border rounded px-2 py-1"
        value={selectedMinute}
        onChange={(e) => updateTime(selectedHour, parseInt(e.target.value))}
      >
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
};

const UpdateSechedule = ({ schedule_id, startTime, torneio_id }: Props) => {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      date: new Date(startTime),
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.date) {
      // Optionally, handle the error (e.g., show a message)
      return;
    }
    await updateSchedule({
      scheduleId: schedule_id,
      start_time: data.date,
      torneio_id: torneio_id,
    });
    setOpen(false);
  };

  return (
    <div className="space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setOpen(true)}
          >
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-1 space-y-4">
              <div className="flex flex-row items-center">
                <Label className="w-full">Horario</Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PP p")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={(date) => {
                            if (date) {
                              const updated = field.value
                                ? setHours(
                                    setMinutes(date, field.value.getMinutes()),
                                    field.value.getHours()
                                  )
                                : date;
                              field.onChange(updated);
                            }
                          }}
                          initialFocus
                        />
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>

            <Button type="submit" size="sm">
              Submit
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UpdateSechedule;
