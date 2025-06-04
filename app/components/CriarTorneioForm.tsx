"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, List, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { TournamentSchema } from "../utils/zodSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSingleRoundRobinTournament } from "@/actions/createSingleRoundRobinTournament";
import { createDoubleRoundRobinTournament } from "@/actions/createDoubleRoundRobinTournament";
import { createKnockoutTournament } from "@/actions/knockout.action";
import { SPORT_TYPES, TOURNAMENT_TYPES } from "../utils/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type TeamType = {
  team_id: number;
  team_name: string;
};

interface TorneioFormProps {
  formTile: string;
  equipas: TeamType[];
  defaultData: z.infer<typeof TournamentSchema> | undefined;
}

export default function CriarTorneioForm({
  formTile,
  equipas,
}: //defaultData,
TorneioFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    //formState: { errors },
  } = useForm<z.infer<typeof TournamentSchema>>({
    resolver: zodResolver(TournamentSchema),
    defaultValues: {
      name: "",
      location: "",
      start_date: new Date(),
      end_date: new Date(),
      tournament_type: "",
      description: null,
      teams: [],
      participants: 4,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teams", // name of the field array
  });

  const onSubmitCreate = async (data: z.infer<typeof TournamentSchema>) => {
    // Check if the start date is in the past
    if (data.start_date < new Date()) {
      alert("Start date cannot be in the past.");
      return;
    }
    // Check if the end date is before the start date
    if (data.end_date < data.start_date) {
      alert("End date cannot be before start date.");
      return;
    }

    if (data.participants !== data.teams.length) {
      alert("Number of participants must match the number of teams.");
      return;
    }

    let torneio = null;

    if (data.tournament_type === TOURNAMENT_TYPES[0].value) {
      torneio = await createKnockoutTournament(data);
    }

    if (data.tournament_type === TOURNAMENT_TYPES[1].value) {
      torneio = await createSingleRoundRobinTournament(data);
    }

    if (data.tournament_type === TOURNAMENT_TYPES[2].value) {
      torneio = await createDoubleRoundRobinTournament(data);
    }

    //const torneio = await createTournament(data);

    if (torneio) {
      alert("Torneio created successfully!");
      reset(); // Reset the form after successful submission
      redirect("/dashboard/admin/torneio"); // Redirect to the team list page
    } else {
      console.error("Failed to create team.");
    }
  };

  const addTeam = (value: string) => {
    const parsedValue = JSON.parse(value) as TeamType;
    // Check if the team already exists in the array
    const teamExists = fields.some(
      (team) => team.team_id === parsedValue.team_id
    );
    if (teamExists) {
      alert("Team already added!");
      return;
    }
    // Append the new team to the array
    append({
      team_id: parsedValue.team_id,
      team_name: parsedValue.team_name,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitCreate)}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-mono">{formTile}</CardTitle>
            <Link href="/dashboard/admin/torneio">
              <Button variant="outline" className="rounded-full">
                <List className="mr-2" size={16} /> Lista de Tornios
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label htmlFor="name">Nome do torneio</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>

              <div className="col-span-1">
                <Label htmlFor="name">Local</Label>
                <Input
                  id="location"
                  {...register("location", { required: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
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

              <div className="col-span-2">
                <Label htmlFor="tournament_type">Tipo de torneio</Label>
                <Controller
                  name="tournament_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOURNAMENT_TYPES.map((formato) => (
                          <SelectItem key={formato.value} value={formato.value}>
                            {formato.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="participants">Participantes</Label>
                <Controller
                  name="participants"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="16">16</SelectItem>
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
          </div>

          <Card className="space-y-4">
            <CardHeader>
              <div className="flex flex-col items-center space-y-1">
                <CardTitle className="w-full text-xl font-mono">
                  Lista de Participantes
                </CardTitle>
                <Select
                  onValueChange={(value) => {
                    addTeam(value);
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Adicione participante" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipas?.map((team) => (
                      <SelectItem
                        key={team.team_id}
                        value={JSON.stringify(team)}
                      >
                        {team.team_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-row justify-between space-x-4"
                >
                  <Input
                    className=""
                    disabled
                    {...register(`teams.${index}.team_name`, {
                      required: true,
                    })}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={4} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="default" type="submit" className="w-1/3">
            {"Criar"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
