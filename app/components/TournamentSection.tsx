import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import React from "react";

type Tournament = {
  tournament_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
};

// Get all tournaments
const getCurrentTournaments = async () => {
  const prisma = new PrismaClient();
  const tournaments = await prisma.tournament.findMany({
    select: {
      tournament_id: true,
      name: true,
      start_date: true,
      end_date: true,
    },
  });

  return tournaments;
};

const TournamentSection = async () => {
  const recentTournaments = await getCurrentTournaments();

  return (
    <section className="h-1/3 flex flex-col px-28 gap-1">
      <h2 className="text-lx font-bold">Torneios Atuais</h2>
      <div className="grid grid-cols-4 overflow-x-auto gap-4">
        {recentTournaments.map((tournament, idx) => (
          <CurrentTournaments
            key={tournament.tournament_id ?? idx}
            name={tournament.name}
            tournament_id={tournament.tournament_id}
            start_date={tournament.start_date}
            end_date={tournament.end_date}
          />
        ))}
      </div>
    </section>
  );
};

export default TournamentSection;

function CurrentTournaments({
  tournament_id,
  name,
  start_date,
  end_date,
}: Tournament) {
  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {start_date.toLocaleDateString()} - {end_date.toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <div className="flex justify-between w-full">
          <Link
            href={`/torneios/${tournament_id}/results`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Ver Detalhes
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
