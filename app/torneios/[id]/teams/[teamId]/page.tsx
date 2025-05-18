import { Label } from "@/components/ui/label";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getTeamById = async (teamId: number) =>
  prisma.team.findUnique({
    where: { team_id: teamId },
    include: {
      players: {
        orderBy: { number: "asc" },
      },
    },
  });

interface Props {
  params: Promise<{ teamId: string }>;
}

const PlayersPage = async ({ params }: Props) => {
  const { teamId } = await params;

  const team = await getTeamById(Number(teamId));
  const players = team?.players;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-center text-lg uppercase font-semibold">
        {team?.team_name}
      </h1>
      <h2 className="text-center text-lg font-thin py-4">Lista de Jogadores</h2>
      <ul className="flex flex-col p-5 border rounded-md">
        <li className="grid grid-cols-3 gap-2 pt-4 text-center border-b">
          <Label className="col-span-1 font-semibold ">Camisola</Label>
          <Label className="col-span-1 font-semibold ">Nome</Label>
          <Label className="col-span-1 font-semibold">Posição</Label>
        </li>
        {players?.map((player) => (
          <li
            key={player.player_id}
            className="grid grid-cols-3 gap-2 text-center py-4"
          >
            <Label className="col-span-1">{player.number}</Label>
            <Label className="col-span-1">{`${player.first_name} ${player.last_name}`}</Label>
            <Label className="col-span-1">{player.position}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersPage;
