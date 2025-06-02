import { generateNextRoundNewMatches } from "@/actions/createSorteio";
import { EditarTorneioForm } from "@/app/components/EditarTorneioForm";
import { MatchActionsBtn } from "@/app/components/MatchActionsBtn";
import { checkTournamentMatches } from "@/app/utils/checkTournamentMatches";
import { TournamentSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { Label } from "@radix-ui/react-label";

import { format } from "date-fns";
import { z } from "zod";

async function getTorneioById(id: number) {
  const prisma = new PrismaClient();

  const torneio = await prisma.tournament.findUnique({
    where: { tournament_id: Number(id) },
    include: {
      matches: {
        include: { team1: true, team2: true, schedule: true },
        orderBy: { round: "asc" },
      },
    },
  });
  return torneio;
}

export default async function TorneioEditar({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const torneio = await getTorneioById(id);

  const torneioData: z.infer<typeof TournamentSchema> = torneio
    ? {
        tournament_id: torneio.tournament_id,
        name: torneio.name,
        location: torneio.location,
        start_date: torneio.start_date,
        end_date: torneio.end_date,
        tournament_type: torneio.tournament_type,
        description: torneio.description ?? "",
        participants: torneio.participants,
        sport_type: torneio?.sport_type,
        teams: [],
      }
    : {
        name: "",
        start_date: new Date(),
        end_date: new Date(),
        tournament_type: "",
        participants: 0,
        teams: [],
        sport_type: "",
      };

  const { allPlayed } = await checkTournamentMatches(Number(id));

  return (
    <Card className="">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Torneio: {torneio?.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditarTorneioForm data={torneioData} />

        <Card className="">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex flex-row justify-between w-full items-center text-xl font-mono">
                <div>Partidas</div>
                <div
                  className={
                    torneio?.tournament_type !== "knockout" ? "hidden" : ""
                  }
                >
                  <form action={generateNextRoundNewMatches}>
                    <input
                      type="hidden"
                      name="tournamentId"
                      value={torneio?.tournament_id}
                    />

                    <Button
                      type="submit"
                      className="rounded-full"
                      disabled={!allPlayed}
                    >
                      Gerar Próxima Rodada
                    </Button>
                  </form>
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {torneio?.matches.map((match) => (
              <Match key={match.match_id} match={match} />
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Match({ match }: { match: any }) {
  const day = format(match.schedule?.start_time, "MMMM d, yyyy"); // e.g., "May 4, 2025"
  const time = format(match.schedule?.start_time, "HH:mm a");
  return (
    <div className="flex flex-col gap-2 w-full border border-gray-200 py-4 px-5 rounded-md mb-2">
      <div className="flex flex-row justify-between items-center border-b border-gray-200 pb-1">
        <Label className="text-xs font-semibold">{day}</Label>
        <div className="flex flex-row justify-between items-center gap-5">
          <Label className="text-xs">{match.round}</Label>
          <MatchActionsBtn
            match_id={match.match_id}
            team1={match.team1.team_name}
            team2={match.team2.team_name}
            torneio_id={match.tournament_id}
            schedule_id={match.schedule?.schedule_id}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between gap-2 w-full items-center px-2">
        <div className="flex flex-col space-y-2">
          <Label
            className={
              match.team1_id === match.winner_team_id ? `font-semibold` : ""
            }
          >
            {match.team1.team_name}
          </Label>
          <Label
            className={
              match.team2_id === match.winner_team_id ? `font-semibold` : ""
            }
          >
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
