import { PrismaClient } from "@prisma/client";
import Image from "next/image";
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
      <h1 className="text-md font-semibold mb-2 text-muted-foreground uppercase">
        Equipas participantes
      </h1>
      <ul className="border rounded-lg shadow-md">
        <li
          className="grid grid-cols-7 text-center border-b p-2 text-xs font-semibold uppercase 
        text-muted-foreground bg-zinc-300"
        >
          <h2 className="col-span-1 ">Logo</h2>
          <h2 className="col-span-2 ">Nome</h2>
          <h2 className="col-span-2 ">Treinador</h2>
          <h2 className="col-span-2 ">Regiao</h2>
        </li>
        {teams.map((team) => (
          <li key={team.team_id}>
            <Link
              href={`/torneios/${id}/teams/${team.team_id}`}
              className="grid grid-cols-7 text-center items-center justify-center border-b py-2 hover:bg-zinc-200"
            >
              <div className="col-span-1 flex justify-center items-center">
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
              <h2 className="col-span-2">{team.team_name}</h2>
              <h2 className="col-span-2">{team.coach_name}</h2>
              <h2 className="col-span-2">{team.region}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TeamsListPage;
