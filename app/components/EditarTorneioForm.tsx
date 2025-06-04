"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TournamentModifySchema, TournamentSchema } from "../utils/zodSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Send } from "lucide-react";
import { updateTournament } from "@/actions/torneio.actions";
import { SPORT_TYPES } from "../utils/constants";
import { redirect } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface EditarTorneioFormProps {
  data: z.infer<typeof TournamentSchema>;
}

export const EditarTorneioForm = ({ data }: EditarTorneioFormProps) => {
  const { register, handleSubmit, control } = useForm<
    z.infer<typeof TournamentModifySchema>
  >({
    resolver: zodResolver(TournamentModifySchema),
    defaultValues: {
      tournament_id: data?.tournament_id,
      name: data?.name,
      location: data?.location,
      start_date: new Date(data?.start_date),
      end_date: new Date(data?.end_date),
      description: data?.description,
      sport_type: data?.sport_type,
    },
  });

  const onSubmitUpdate = async (
    data: z.infer<typeof TournamentModifySchema>
  ) => {
    const t = await updateTournament(data);
    if (t) {
      alert("Torneio atualizado com sucesso!");
      redirect("/dashboard/admin/torneio"); // Redirect to the team list page
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitUpdate)}>
      <Card className="">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="">Informação Geral</CardTitle>
          <Button type="submit" variant="default" className="rounded-full">
            <Send className="mr-2" size={16} /> Modificar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            <Input
              id="tournament_id"
              {...register("tournament_id")}
              className="hidden"
            />
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2">
                <Label htmlFor="name">Nome do torneio</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="sport_type">Modalidade</Label>
                <Controller
                  name="sport_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPORT_TYPES.map((sport) => (
                          <SelectItem key={sport.value} value={sport.value}>
                            {sport.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="start_date">Inico</Label>
                <Controller
                  control={control}
                  name="start_date"
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
                            ? format(field.value, "P")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="end_date">Termino</Label>
                <Controller
                  control={control}
                  name="end_date"
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
                            ? format(field.value, "P")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Label htmlFor="name">Local</Label>
                <Input
                  id="location"
                  {...register("location", { required: true })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição do torneio"
                  {...register("description")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
