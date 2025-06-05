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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">{tournament?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600 font-semibold">Tipo de Torneio</p>
          <p className="text-gray-900">{tournament?.tournament_type}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Modalidade</p>
          <p className="text-gray-900">{tournament?.sport_type}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Data de Início</p>
          <p className="text-gray-900">
            {tournament?.start_date
              ? new Date(tournament.start_date).toLocaleDateString()
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Data de Fim</p>
          <p className="text-gray-900">
            {tournament?.end_date
              ? new Date(tournament.end_date).toLocaleDateString()
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Localização</p>
          <p className="text-gray-900">{tournament?.location || "-"}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Equipas</p>
          <p className="text-gray-900">{totalTeams}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Jogos</p>
          <p className="text-gray-900">{totalMatches}</p>
        </div>
      </div>
      {tournament?.description && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p className="text-gray-800">{tournament.description}</p>
        </div>
      )}
    </div>
  );
};

export default TorneioPage;
