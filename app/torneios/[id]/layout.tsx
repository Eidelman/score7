import TorneioNavbar from "@/app/components/TorneioNavbar";
import { PrismaClient } from "@prisma/client";
import { ReactNode } from "react";

async function getTorneioById(id: number) {
  const prisma = new PrismaClient();

  const torneio = await prisma.tournament.findUnique({
    where: { tournament_id: Number(id) },
    select: {
      name: true,
    },
  });
  return torneio;
}

export default async function TorneioLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const basePath = `/torneios/${id}`;

  const torneio = await getTorneioById(Number(id));

  return (
    <div>
      <h1 className="text-center py-5 font-bold text-2xl">{torneio?.name}</h1>
      <TorneioNavbar basePath={basePath} />
      <main className="pt-8 pb-20">{children}</main>
    </div>
  );
}
