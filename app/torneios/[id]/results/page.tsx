import { Label } from "@/components/ui/label";

import { format } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

async function getTorneioById(id: number) {
  const prisma = new PrismaClient();

  const formatResult = await prisma.tournament.findUnique({
    select: { tournament_type: true },
    where: { tournament_id: Number(id) },
  });

  const orderedField =
    formatResult?.tournament_type === "knockout" ? "match_id" : "round";

  const torneio = await prisma.tournament.findUnique({
    where: { tournament_id: Number(id) },
    include: {
      matches: {
        include: { team1: true, team2: true, schedule: true },
        orderBy: [
          {
            [orderedField]: "asc",
          },
          {
            schedule: {
              start_time: "asc",
            },
          },
        ],
      },
    },
  });
  return torneio;
}

const ResultsPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const torneio = await getTorneioById(id);
  const cols = torneio!.participants / 2;

  return (
    <div className="max-w-5xl mx-auto p-0">
      <h1 className="text-md font-semibold mb-2 text-muted-foreground uppercase">
        Calendario & resultados
      </h1>
      <div
        className={`grid gap-4`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {torneio?.matches.map((match) => (
          <Match key={match.match_id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Match({ match }: { match: any }) {
  const day = format(match.schedule?.start_time, "MMMM d, yyyy"); // e.g., "May 4, 2025"
  const time = format(match.schedule?.start_time, "HH:mm a");
  return (
    <div className="col-span-1 flex flex-col gap-2 w-full border border-gray-200 py-3 px-5 rounded-md">
      <div className="flex flex-row justify-between items-center border-b border-gray-200 pb-0">
        <Label className="text-xs font-semibold text-muted-foreground">
          {day}
        </Label>
        <div className="flex flex-row justify-between items-center gap-5 text-muted-foreground">
          <Label className="text-xs text-blue-800">{match.round}</Label>
        </div>
      </div>

      <div className="flex flex-row justify-between gap-2 w-full items-center px-0">
        <div className="flex flex-col space-y-3">
          <Label
            className={cn(
              Number(match.team1_id) === Number(match.winner_team_id)
                ? "font-semibold"
                : "",
              "flex flex-row items-center gap-2"
            )}
          >
            <Image
              src={
                match.team1?.logo_url
                  ? match.team1.logo_url
                  : "/equipas/default-team-logo.png"
              }
              alt="team"
              width={18}
              height={18}
            />{" "}
            {match.team1.team_name}
          </Label>
          <Label
            className={cn(
              Number(match.team2_id) === Number(match.winner_team_id)
                ? "font-semibold"
                : "",
              "flex flex-row items-center gap-2"
            )}
          >
            <Image
              src={
                match.team2?.logo_url
                  ? match.team2.logo_url
                  : "/equipas/default-team-logo.png"
              }
              alt="team"
              width={18}
              height={18}
            />{" "}
            {match.team2.team_name}
          </Label>
        </div>
        {match.score_team1 === null || match.score_team2 === null ? (
          <Label className="text-sm">{time}</Label>
        ) : (
          <div className="flex flex-col space-y-2">
            <Label
              className={
                match.team1_id === match.winner_team_id ? `font-semibold` : ""
              }
            >
              {match.score_team1}
            </Label>
            <Label
              className={
                match.team2_id === match.winner_team_id ? `font-semibold` : ""
              }
            >
              {match.score_team2}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
