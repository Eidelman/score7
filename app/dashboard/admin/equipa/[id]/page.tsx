import TeamForm from "@/app/components/TeamForm";
import { PrismaClient } from "@prisma/client";

export async function getTeamById(id: number) {
  const prisma = new PrismaClient();

  const team = await prisma.team.findUnique({
    where: { team_id: Number(id) },
    include: { players: true },
  });
  return team;
}

export default async function EditarTeamForm({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const team = await getTeamById(id);

  return (
    <TeamForm formTile="Editar Equipa" defaultData={team ? team : undefined} />
  );
}
