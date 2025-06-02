import prisma from "@/app/utils/db";

interface TorneioPageProps {
  params: Promise<{ id: number }>;
}

const TorneioPage: React.FC<TorneioPageProps> = async ({ params }) => {
  const { id } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { tournament_id: Number(id) },
    select: {
      name: true,
      start_date: true,
      end_date: true,
      location: true,
      description: true,
      tournament_type: true,
      sport_type: true,
    },
  });

  // Step 1: Get all matches for the tournament with related teams
  const matches = await prisma.match.findMany({
    where: { tournament_id: Number(id) },
    select: {
      team1_id: true,
      team2_id: true,
    },
  });

  // Step 2: Collect unique team IDs
  const uniqueTeamIds = new Set<number>();
  for (const match of matches) {
    uniqueTeamIds.add(match.team1_id);
    uniqueTeamIds.add(match.team2_id);
  }

  // Step 3: Return results
  const totalMatches = matches.length;
  const totalTeams = uniqueTeamIds.size;

  return (
    <main className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Torneio: {tournament?.name}</h1>
      {/* Conteúdo do torneio será adicionado aqui */}
      <section>
        <p>{tournament?.description}</p>
        <p>{tournament?.location}</p>
        <p>{tournament?.sport_type}</p>
        <p>{tournament?.tournament_type}</p>
        <p>{tournament?.start_date.toLocaleDateString()}</p>
        <p>{tournament?.end_date.toLocaleDateString()}</p>
        <p>{totalMatches}</p>
        <p>{totalTeams}</p>
      </section>
    </main>
  );
};

export default TorneioPage;
