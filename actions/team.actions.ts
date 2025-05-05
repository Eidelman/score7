"use server";

import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import { TeamSchema } from "../app/utils/zodSchemas";
const prisma = new PrismaClient();

export async function createTeam(data: z.infer<typeof TeamSchema>) {
  const { team_name, coach_name, region, players } = data;
  // Create Teams & Players
  console.log("Creating team with data:", data);
  const team = await prisma.team.create({
    data: {
      team_name: team_name,
      coach_name: coach_name,
      region: region,
      players: {
        create: players
          .filter((player) => player && player.date_of_birth) // just in case
          .map((player) => {
            const dob = new Date(player.date_of_birth);
            if (isNaN(dob.getTime())) {
              throw new Error(`Invalid date_of_birth: ${player.date_of_birth}`);
            }

            return {
              first_name: player.first_name,
              last_name: player.last_name,
              email: player.email,
              date_of_birth: dob,
            };
          }),
      },
    },
    include: { players: true },
  });

  return team;
}

export async function getOneTeam(id: number) {
  // Get one Team and Playyers
  const team = await prisma.team.findUnique({
    where: {
      team_id: id,
    },
    include: {
      players: true,
    },
  });

  return team;
}

export async function deleteTeam(id: number) {
  // Delete Team and Players
  const team = await prisma.team.delete({
    where: { team_id: id },
  });

  return team;
}

export async function updateTeam(data: z.infer<typeof TeamSchema>) {
  const { team_name, coach_name, region, players } = data;
  // Update Team and Players
  const team = await prisma.team.update({
    where: { team_id: data.team_id },
    data: {
      team_name: team_name,
      coach_name: coach_name,
      region: region,
      players: {
        updateMany: players.map((player) => ({
          where: { player_id: player.player_id },
          data: {
            first_name: player.first_name,
            last_name: player.last_name,
            email: player.email,
            date_of_birth: new Date(player.date_of_birth),
          },
        })),
        createMany: {
          data: players
            .filter((player) => !player.player_id) // Only create new players
            .map((player) => {
              return {
                first_name: player.first_name,
                last_name: player.last_name,
                email: player.email,
                date_of_birth: new Date(player.date_of_birth),
              };
            }),
        },
      },
    },
  });

  return team;
}
