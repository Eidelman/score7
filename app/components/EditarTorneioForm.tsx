"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TournamentSchema } from "../utils/zodSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { updateTournament } from "@/actions/torneio.actions";

interface EditarTorneioFormProps {
  data: z.infer<typeof TournamentSchema>;
}

export const EditarTorneioForm = ({ data }: EditarTorneioFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    //formState: { errors },
  } = useForm<z.infer<typeof TournamentSchema>>({
    resolver: zodResolver(TournamentSchema),
    defaultValues: {
      name: data?.name,
      location: data?.location,
      start_date: new Date(data?.start_date),
      end_date: new Date(data?.end_date),
      tournament_type: data?.tournament_type,
      description: data?.description,
      participants: data?.participants,
      sport_type: data?.sport_type,
    },
  });

  const onSubmitUpdate = async (data: z.infer<typeof TournamentSchema>) => {
    await updateTournament(data);
    alert("Torneio atualizado com sucesso!");
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="">General Info</CardTitle>
        <Button type="submit" variant="outline" className="rounded-full">
          <Send className="mr-2" size={16} /> Modificar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <div className="col-span-2">
                <Label htmlFor="name">Nome do torneio</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div className="col-span-1">
                <Label htmlFor="participants"># de Participantes</Label>
                <Input
                  id="participants"
                  type="number"
                  placeholder="4, 6, 8..."
                  {...register("participants", { required: true })}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <Label htmlFor="tournament_type">Modalidade</Label>
                <Controller
                  name="tournament_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Futebol">Futebol</SelectItem>
                        <SelectItem value="Futsal">Futsal</SelectItem>
                        <SelectItem value="Basquetebol">Basquetebol</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="start_date">Inico</Label>
                <Input
                  id="start_date"
                  placeholder="Data de inicio"
                  type="date"
                  {...register("start_date", {
                    required: true,
                  })}
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="end_date">Termino</Label>
                <Input
                  id="end_date"
                  placeholder="Data de fim"
                  type="date"
                  {...register("end_date", {
                    required: true,
                  })}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
