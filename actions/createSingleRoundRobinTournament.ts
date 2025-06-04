"use server";

import { TournamentSchema } from "@/app/utils/zodSchemas";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export async function createSingleRoundRobinTournament(
  params: z.infer<typeof TournamentSchema>
) {
  const {
    name,
    location,
    start_date,
    end_date,
    tournament_type,
    description,
    sport_type,
    teams: inputTeams,
  } = params;

  const teams = [...inputTeams];

  if (teams.length < 2) {
    throw new Error(
      "At least 2 participants are required for a league tournament."
    );
  }
  // 1. Create the tournament
  const tournament = await prisma.tournament.create({
    data: {
      name,
      location,
      start_date,
      end_date,
      tournament_type,
      description,
      sport_type,
      participants: teams.length,
    },
  });
  // 2. Create matches for each pair of teams
  const matchesToCreate = [];
  const matchDurationMinutes = 60;
  let currentTime = new Date(tournament.start_date);
  const endTime = new Date(tournament.end_date);
  let round = 1;

  for (let i = 0; i < teams.length - 1; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      if (currentTime > endTime)
        throw new Error("Not enough time to schedule all matches");

      matchesToCreate.push({
        tournament_id: tournament.tournament_id,
        round: `Jornada ${round++}`,
        match_date: currentTime,
        team1_id: teams[i].team_id,
        team2_id: teams[j].team_id,
        score_team1: null,
        score_team2: null,
        winner_team_id: null,
      });

      // Update time for next match
      currentTime = new Date(
        currentTime.getTime() + (matchDurationMinutes + 15) * 60000
      );
    }
  }

  // Create matches in DB
  const createdMatches = await prisma.match.createMany({
    data: matchesToCreate,
  });

  const allMatches = await prisma.match.findMany({
    where: { tournament_id: tournament.tournament_id },
  });

  const schedules = allMatches.map((match) => ({
    match_id: match.match_id,
    start_time: match.match_date,
    end_time: new Date(
      new Date(match.match_date).getTime() + matchDurationMinutes * 60000
    ),
    venue_id: null, // Optional, or assign based on logic
  }));

  await prisma.schedule.createMany({ data: schedules });

  console.log(`${createdMatches.count} matches created successfully.`);

  return {
    tournament,
    totalRounds: (teams.length - 1) * 2,
    totalMatches: createdMatches.count,
  };
}
