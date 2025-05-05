import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { TorneioActionsBtn } from "@/app/components/TorneioActionsBtn";

// Get all tournaments
export const getAllTournaments = async () => {
  const prisma = new PrismaClient();
  try {
    const tournaments = await prisma.tournament.findMany();
    return tournaments;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tournament: ${error.message}`);
    }
    throw new Error("Error fetching tournament: Unknown error");
  }
};

const TorneioRoute = async () => {
  const torneios = await getAllTournaments();

  return (
    <Card className="max-w-4xl mx-auto my-5">
      <CardHeader className="pb-0 space-y-8">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-mono">Lista de Torneios</CardTitle>
          <Link href="/dashboard/admin/torneio/novo">
            <Button variant="outline" className="rounded-full">
              <Plus className="mr-2" size={16} /> Criar Torneio
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-9 border-b border-gray-200 pt-3 items-center">
          <Label className="col-span-2 font-semibold">Nome</Label>
          <Label className="col-span-2 font-semibold">Modalidade</Label>
          <Label className="col-span-2 font-semibold">Local</Label>
          <Label className="col-span-1 font-semibold text-center">Iicio</Label>
          <Label className="col-span-1 font-semibold text-center">Fim</Label>
        </div>
      </CardHeader>
      <CardContent>
        {torneios.map((torneio) => (
          <div
            key={torneio.tournament_id}
            className="grid grid-cols-9 border-b border-gray-200 py-2 items-center"
          >
            <Label className="col-span-2">{torneio.name}</Label>
            <Label className="col-span-2">{torneio.tournament_type}</Label>
            <Label className="col-span-2 ">{torneio.location}</Label>
            <Label className="col-span-1 text-center">
              {torneio.start_date.toLocaleDateString()}
            </Label>
            <Label className="col-span-1 text-center">
              {torneio.end_date.toLocaleDateString()}
            </Label>
            <div className="flex justify-end">
              <TorneioActionsBtn torneioId={torneio.tournament_id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TorneioRoute;
