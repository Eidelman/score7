"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

type UpdateMatchInput = {
  match_id: number;
  round?: string;
  match_date?: Date;
  score_team1?: number;
  score_team2?: number;
  winner_team_id?: number | null; // allow null to reset winner
};

type Score = {
  match_id: number;
  score_team1: number;
  score_team2: number;
  torneio_id: number;
};

export async function updateMatch(data: UpdateMatchInput) {
  const { match_id, ...updateFields } = data;

  try {
    const updatedMatch = await prisma.match.update({
      where: { match_id },
      data: updateFields,
    });

    return updatedMatch;
  } catch (error) {
    console.error("Error updating match:", error);
    throw new Error("Failed to update match");
  }
}

export async function updateMatchScore({
  match_id,
  score_team1,
  score_team2,
  torneio_id,
}: Score) {
  try {
    await prisma.match.update({
      where: { match_id },
      data: {
        score_team1,
        score_team2,
      },
    });

    const match = await prisma.match.findUnique({
      where: { match_id },
      select: {
        score_team1: true,
        score_team2: true,
        team1_id: true,
        team2_id: true,
      },
    });

    if (!match) {
      throw new Error(`Match with ID ${match_id} not found`);
    }

    let winner_team_id: number | null = null;

    if ((match.score_team1 ?? 0) > (match.score_team2 ?? 0)) {
      winner_team_id = match.team1_id;
    } else if ((match.score_team2 ?? 0) > (match.score_team1 ?? 0)) {
      winner_team_id = match.team2_id;
    } else {
      winner_team_id = null; // draw, no winner
    }

    await prisma.match.update({
      where: { match_id },
      data: { winner_team_id },
    });

    revalidatePath("/dashboard/amdin/torneio/" + torneio_id);
  } catch (error) {
    console.error("Error updating match score:", error);
    throw new Error("Failed to update match score");
  }
}

type Schedule = {
  torneio_id: number;
  scheduleId: number;
  start_time: Date;
};
export async function updateSchedule({
  scheduleId,
  start_time,
  torneio_id,
}: Schedule) {
  try {
    await prisma.schedule.update({
      where: { schedule_id: scheduleId },
      data: {
        start_time: start_time,
      },
    });

    revalidatePath("/dashboard/amdin/torneio/" + torneio_id);
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
}
