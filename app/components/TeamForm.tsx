"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createTeam, updateTeam } from "@/actions/team.actions";
import { TeamSchema } from "../utils/zodSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, List, Plus, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface TeamFormProps {
  formTile: string;
  defaultData: z.infer<typeof TeamSchema> | undefined;
}

export default function TeamForm({ formTile, defaultData }: TeamFormProps) {
  const { register, handleSubmit, control, reset } = useForm<
    z.infer<typeof TeamSchema>
  >({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      team_name: defaultData?.team_name || "",
      coach_name: defaultData?.coach_name || "",
      region: defaultData?.region || "",
      logo_url: defaultData?.logo_url || "",
      players: defaultData?.players,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });

  const onSubmitCreate = async (data: z.infer<typeof TeamSchema>) => {
    const team = await createTeam(data); // Call the createTeam function with the form data
    if (team) {
      alert("Team created successfully!");
      reset(); // Reset the form after successful submission
      redirect("/dashboard/admin/equipa"); // Redirect to the team list page
    } else {
      console.error("Failed to create team.");
    }
  };

  const onSubmitUpdate = async (data: z.infer<typeof TeamSchema>) => {
    data.team_id = defaultData?.team_id; // Add the team_id to the data object
    const team = await updateTeam(data); // Call the createTeam function with the form data
    if (team) {
      alert("Team created successfully!");
      reset(); // Reset the form after successful submission
      redirect("/dashboard/admin/equipa"); // Redirect to the team list page
    } else {
      console.error("Failed to create team.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(defaultData ? onSubmitUpdate : onSubmitCreate)}
    >
      <Card className="p-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-mono">{formTile}</CardTitle>
            <Link href="/dashboard/admin/equipa">
              <Button variant="outline" className="rounded-full">
                <List className="mr-2" size={16} /> Lista de Equipa
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-9 gap-2">
            <div className="col-span-3">
              <Label htmlFor="team_name">Nome da Equipa</Label>
              <Input
                id="team_name"
                {...register("team_name", { required: true })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="coach_name">Treinador</Label>
              <Input
                id="coach_name"
                {...register("coach_name", { required: true })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="region">Região</Label>
              <Input id="region" {...register("region", { required: true })} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="logo_url">Logo</Label>
              <Input
                id="logo_url"
                {...register("logo_url", { required: true })}
              />
            </div>
          </div>

          <Card className="space-y-4 p-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-mono">Jogadores</CardTitle>
                <Button
                  variant="outline"
                  className="rounded-full"
                  type="button"
                  onClick={() =>
                    append({
                      first_name: "",
                      last_name: "",
                      email: "",
                      date_of_birth: new Date(),
                      number: null,
                      position: "",
                      photo_url: null,
                    })
                  }
                >
                  <Plus size={16} className="mr-2" />
                  Jogador
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-2 p-2 pr-10 relative"
                >
                  <div className="grid grid-cols-8 gap-1">
                    <Input
                      className="col-span-2"
                      placeholder="Nome"
                      {...register(`players.${index}.first_name`, {
                        required: true,
                      })}
                    />
                    <Input
                      className="col-span-2"
                      placeholder="Apelido"
                      {...register(`players.${index}.last_name`, {
                        required: true,
                      })}
                    />
                    <Input
                      type="number"
                      className="col-span-1"
                      placeholder="Camisola"
                      {...register(`players.${index}.number`, {
                        required: true,
                      })}
                    />
                    <Controller
                      name={`players.${index}.position`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="col-span-2">
                            <SelectValue placeholder="Posição" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Guardaredes">
                              Guardaredes
                            </SelectItem>
                            <SelectItem value="Defesa">Defesa</SelectItem>
                            <SelectItem value="Médio">Médio</SelectItem>
                            <SelectItem value="Avançado">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <Controller
                      control={control}
                      name={`players.${index}.date_of_birth`}
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

                    <Input
                      className="col-span-2"
                      placeholder="Foto URL"
                      type="text"
                      {...register(`players.${index}.photo_url`, {
                        required: true,
                      })}
                    />

                    <Input
                      className="col-span-2"
                      placeholder="Email"
                      type="email"
                      {...register(`players.${index}.email`, {
                        required: true,
                      })}
                    />
                  </div>

                  <div className="flex justify-end absolute right-0 top-2">
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
        <CardFooter className="justify-end">
          <Button
            variant="default"
            type="submit"
            className="w-1/3 rounded-full"
            size="lg"
          >
            {defaultData ? "Atualizar" : "Criar"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
