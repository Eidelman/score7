"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updateSchedule } from "@/actions/match.actions";

import React from "react";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";

interface Props {
  schedule_id: number;
}

const UpdateSechedule = ({ schedule_id }: Props) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState("");

  const { control } = useForm();

  const handleUpdateTime = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSchedule({
      scheduleId: schedule_id,
      start_time: startTime,
      venue_id: 1,
    });
    setStartTime(""); // Reset form value
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
            <Calendar />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form onSubmit={handleUpdateTime} className="space-y-2">
            <div className="grid grid-cols-1 space-y-4">
              <div className="flex flex-row items-center">
                <Label className="w-full">Horario</Label>
                <Input
                  type="time"
                  placeholder="Enter value"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-fit"
                />
              </div>

              <div className="flex flex-col">
                <Label>Estadio</Label>
                <Controller
                  name="tournament_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Futebol">Estadio 1</SelectItem>
                        <SelectItem value="Futsal">Estadio 2</SelectItem>
                        <SelectItem value="Basquetebol">Estadio 3</SelectItem>
                      </SelectContent>
                    </Select>
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
