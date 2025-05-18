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

  const numTeams = teams.length;
  const roundsPerLeg = numTeams - 1;
  const totalRounds = roundsPerLeg * 2;
  const matchesPerRound = numTeams / 2;

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
      participants: numTeams,
    },
  });

  // 2. Generate the round-robin schedule
  const schedule: {
    round: number;
    match_date: Date;
    player1: number;
    player2: number;
  }[] = [];

  const fixed = teams[0];
  const rotating = teams.slice(1);

  for (let round = 0; round < roundsPerLeg; round++) {
    const roundNumber = round + 1;

    const pairings: [number, number][] = [];
    const left = [fixed, ...rotating.slice(0, matchesPerRound - 1)];
    const right = [...rotating.slice(matchesPerRound - 1)].reverse();

    for (let i = 0; i < matchesPerRound; i++) {
      const team1 = left[i];
      const team2 = right[i];

      pairings.push([team1.team_id, team2.team_id]);
    }

    // First leg
    pairings.forEach(([p1, p2]) => {
      schedule.push({
        round: roundNumber,
        match_date: new Date(
          start_date.getTime() + round * 24 * 60 * 60 * 1000
        ),
        player1: p1,
        player2: p2,
      });
    });
  }

  // 3. Insert matches into the database
  const matchData = schedule.map((match) => ({
    tournament_id: tournament.tournament_id,
    round: `Jornada ${match.round}`,
    match_date: match.match_date,
    team1_id: match.player1,
    team2_id: match.player2,
  }));

  await prisma.match.createMany({
    data: matchData,
  });

  // 5. Schedule matches at the venue
  const matches = await prisma.match.findMany({
    where: { tournament_id: tournament.tournament_id },
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

  return {
    tournament,
    totalRounds,
    totalMatches: matchData.length,
  };
}
