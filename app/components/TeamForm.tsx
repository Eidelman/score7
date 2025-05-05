"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { List, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
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

interface TeamFormProps {
  formTile: string;
  defaultData: z.infer<typeof TeamSchema> | undefined;
}

export default function TeamForm({ formTile, defaultData }: TeamFormProps) {
  const modifiedPlayers = defaultData?.players.map((player) => ({
    ...player,
    date_of_birth: new Date(format(player.date_of_birth, "dd/mm/yyyy")),
  }));

  const { register, handleSubmit, control, reset } = useForm<
    z.infer<typeof TeamSchema>
  >({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      team_name: defaultData?.team_name || "",
      coach_name: defaultData?.coach_name || "",
      region: defaultData?.region || "",
      players:
        (modifiedPlayers ?? []).map((player) => ({
          ...player,
          date_of_birth: new Date(player.date_of_birth),
        })) || [],
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
      <Card className="max-w-3xl mx-auto my-5">
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
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <Label htmlFor="team_name">Nome da Equipa</Label>
              <Input
                id="team_name"
                {...register("team_name", { required: true })}
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="coach_name">Coach Name</Label>
              <Input
                id="coach_name"
                {...register("coach_name", { required: true })}
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="region">Region</Label>
              <Input id="region" {...register("region", { required: true })} />
            </div>
          </div>

          <Card className="space-y-4">
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
                    })
                  }
                >
                  <Plus size={16} className="mr-2" />
                  Jogador
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-9 gap-1">
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
                    className="col-span-2"
                    placeholder="Email"
                    type="email"
                    {...register(`players.${index}.email`, {
                      required: true,
                    })}
                  />
                  <Input
                    placeholder="Data de nascimento"
                    type="date"
                    {...register(`players.${index}.date_of_birth`, {
                      required: true,
                    })}
                    className="col-span-2"
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
        <CardFooter>
          <Button variant="default" type="submit" className="w-1/4">
            {defaultData ? "Atualizar" : "Criar"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
