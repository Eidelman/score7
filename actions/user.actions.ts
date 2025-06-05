"use server";

import { requireUser } from "@/app/utils/hooks";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

type UpdateUser = {
  name: string;
};

export async function updateUser(data: UpdateUser) {
  const session = await requireUser();

  console.log("Updating user with data:", data);
  console.log("Session user ID:", session.user?.id);

  await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      name: data.name,
    },
  });

  return redirect("/dashboard/admin/torneio");
}
