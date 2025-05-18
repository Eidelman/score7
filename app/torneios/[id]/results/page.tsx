import { Label } from "@/components/ui/label";

import { format } from "date-fns";
import { PrismaClient } from "@prisma/client";

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
      <h1 className="text-2xl font-bold mb-3 text-center">Calendario</h1>
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
    <div className="col-span-1 flex flex-col gap-2 w-full border border-gray-200 py-4 px-5 rounded-md mb-2">
      <div className="flex flex-row justify-between items-center border-b border-gray-200 pb-1">
        <Label className="text-xs font-semibold">{day}</Label>
        <div className="flex flex-row justify-between items-center gap-5">
          <Label className="text-xs">{match.round}</Label>
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
