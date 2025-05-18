"use server";

import { shuffleTeams } from "@/app/utils/shuffleTeams";
import { TournamentSchema } from "@/app/utils/zodSchemas";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

export async function createKnockoutTournament(
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
    teams,
  } = params;

  if (!Number.isInteger(Math.log2(teams.length))) {
    throw new Error(
      "Number of teams must be a power of 2 for knockout format."
    );
  }

  // 1. Create the tournament
  const newTournament = await prisma.tournament.create({
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

  // 2. Shuffle participants randomly
  const shuffled = shuffleTeams(teams);

  const currentStartDate = new Date(start_date);

  const roundMatches = [];

  const roundName = getRoundName(shuffled.length);

  for (let i = 0; i < shuffled.length; i += 2) {
    const team1_id = shuffled[i].team_id;
    const team2_id = shuffled[i + 1].team_id;

    roundMatches.push({
      tournament_id: newTournament.tournament_id,
      round: roundName,
      match_date: new Date(currentStartDate),
      team1_id,
      team2_id,
    });
  }

  // Save matches for this round
  await prisma.match.createMany({
    data: roundMatches,
  });

  // 5. Schedule matches at the venue
  const matches = await prisma.match.findMany({
    where: { tournament_id: newTournament.tournament_id },
  });

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + i); // Spread matches out by day

    await prisma.schedule.create({
      data: {
        match_id: match.match_id,
        //venue_id:, // Assuming you have a venue_id from the match
        start_time: startTime,
        end_time: new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000), // +1 hours e 30 minutes
      },
    });
  }

  console.log("Knockout tournament matches created.");

  return newTournament;
}

// Utility function to determine round name
function getRoundName(teamCount: number): string {
  switch (teamCount) {
    case 2:
      return "Final";
    case 4:
      return "Semifinal";
    case 8:
      return "Quarterfinal";
    default:
      return `Round of ${teamCount}`;
  }
}
