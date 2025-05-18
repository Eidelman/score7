import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ id: string }>;
}

// Get tournament by id
const findMatcesByTournament = async (id: number) => {
  const allMatches = await prisma.match.findMany({
    where: { tournament_id: id },
    select: {
      match_id: true,
    },
  });

  if (!allMatches) {
    throw new Error(`Matches with tournament ID ${id} not found`);
  }

  const teamsList = allMatches.map(async (m) => {
    const teams = await getTeamsByMatchId(m.match_id);
    return teams;
  });

  const resolvedPairs = await Promise.all(teamsList);

  const allTeams = [];

  for (const pair of resolvedPairs) {
    allTeams.push(pair.team1, pair.team2);
  }

  const uniqueTeams = Array.from(
    new Map(allTeams.map((team) => [team.team_id, team])).values()
  );

  return uniqueTeams;
};

async function getTeamsByMatchId(matchId: number) {
  const match = await prisma.match.findUnique({
    where: { match_id: matchId },
    include: {
      team1: true,
      team2: true,
    },
  });

  if (!match) {
    throw new Error(`Match with ID ${matchId} not found`);
  }

  return {
    team1: match.team1,
    team2: match.team2,
  };
}

const TeamsListPage = async ({ params }: Props) => {
  const { id } = await params;

  const teams = await findMatcesByTournament(Number(id));

  console.log("Teams: ", teams.length);

  return (
    <main className="max-w-5xl mx-auto ">
      <h1 className="text-xl font-bold mb-10 text-center">
        Equipas participantes
      </h1>
      <ul className="">
        <li className="grid grid-cols-3 text-center border-b border-t p-2">
          <h2 className="text-sm font-semibold uppercase">Nome</h2>
          <h2 className="text-sm font-semibold uppercase">Treinador</h2>
          <h2 className="text-sm font-semibold uppercase">Regiao</h2>
        </li>
        {teams.map((team) => (
          <li key={team.team_id}>
            <Link
              href={`/torneios/${id}/teams/${team.team_id}`}
              className="grid grid-cols-3 text-center border-b py-2"
            >
              <h2 className="text-md">{team.team_name}</h2>
              <h2 className="text-md">{team.coach_name}</h2>
              <h2 className="text-md">{team.region}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TeamsListPage;
