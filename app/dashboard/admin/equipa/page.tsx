import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { TeamActionsBtn } from "../../../components/TeamActionsBtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

export async function getAllTeams() {
  const prisma = new PrismaClient();
  // Get all Teams
  const teams = await prisma.team.findMany();

  // Get first 10 Teams
  //const teams = await prisma.team.findMany({ take: 10 })

  return teams;
}

const TeamList = async () => {
  const teams = await getAllTeams();

  return (
    <Card className="p-8">
      <CardHeader className="pb-0 space-y-8">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-mono">Lista de Equipas</CardTitle>
          <Link href="/dashboard/admin/equipa/adicionar">
            <Button variant="outline" className="rounded-full">
              <Plus className="mr-2" size={16} /> Criar Equipa
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-200 pt-3 items-center">
          <Label className="col-span-1 font-semibold text-muted-foreground">
            Logo
          </Label>
          <Label className="col-span-2 font-semibold text-muted-foreground">
            Nome
          </Label>
          <Label className="col-span-2 font-semibold text-muted-foreground">
            Treinador
          </Label>
          <Label className="col-span-1 font-semibold text-muted-foreground">
            Região
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        {teams?.map((team) => (
          <div
            key={team.team_id}
            className="grid grid-cols-7 border-b border-gray-200 py-2 items-center"
          >
            <div className="col-span-1 flex justify-start items-center">
              <Image
                src={
                  team?.logo_url
                    ? team.logo_url
                    : "/equipas/default-team-logo.png"
                }
                alt="team"
                width={28}
                height={28}
                className=""
              />
            </div>
            <Label className="col-span-2">{team.team_name}</Label>
            <Label className="col-span-2">{team.coach_name}</Label>
            <Label className="col-span-1 ">{team.region}</Label>
            <div className="flex justify-end">
              <TeamActionsBtn teamId={team.team_id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamList;
