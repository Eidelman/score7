import { Label } from "@/components/ui/label";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

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
      <div className="flex flex-col items-center gap-2 py-4 w-full justify-center">
        <Image
          src={
            team?.logo_url ? team.logo_url : "/equipas/default-team-logo.png"
          }
          alt="team"
          width={60}
          height={60}
          className=""
        />
        <h1 className="text-lg font-semibold">{team?.team_name}</h1>
      </div>

      <h2 className="text-sm uppercase font-semibold text-muted-foreground mb-2">
        Lista de Jogadores
      </h2>
      <ul className="flex flex-col p-0 border rounded-md">
        <li className="grid grid-cols-7 gap-2 p-4 border-b rounded-t-md bg-zinc-400">
          <Label className="col-span-1"></Label>
          <Label className="col-span-3 font-semibold ">Nome</Label>
          <Label className="col-span-1 font-semibold text-center">Idade</Label>
          <Label className="col-span-1 font-semibold text-center">
            Posição
          </Label>
          <Label className="col-span-1 font-semibold text-center">
            Camisola
          </Label>
        </li>
        {players?.map((player) => (
          <li
            key={player.player_id}
            className="grid grid-cols-7 gap-2 p-4 items-center"
          >
            <div className="col-span-1 flex justify-center items-center">
              <Image
                src={
                  player.photo_url ? player.photo_url : "/jogadores/player.png"
                }
                alt="player"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <Label className="col-span-3">{`${player.first_name} ${player.last_name}`}</Label>
            <Label className="col-span-1 text-center">
              {new Date().getFullYear() - player.date_of_birth.getFullYear()}
            </Label>
            <Label className="col-span-1 text-center">{player.position}</Label>
            <Label className="col-span-1 text-center">{player.number}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersPage;
