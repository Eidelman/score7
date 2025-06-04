"use server";

import {
  TournamentModifySchema,
  TournamentSchema,
} from "@/app/utils/zodSchemas";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

// Create a new tournament
export const createTournament = async (
  data: z.infer<typeof TournamentSchema>
) => {
  const {
    name,
    location,
    start_date,
    end_date,
    tournament_type,
    description,
    participants,
    sport_type,
  } = data;

  console.log("Data received:", data);
  // Check if the start date is in the past
  if (start_date < new Date()) {
    throw new Error("Start date cannot be in the past.");
  }
  // Check if the end date is before the start date
  if (end_date < start_date) {
    throw new Error("End date cannot be before start date.");
  }

  //Check if the tournament type is valid
  const validTournamentTypes = [
    "knockout",
    "single-round-robin",
    "double-round-robin",
  ];
  if (!validTournamentTypes.includes(tournament_type)) {
    throw new Error("Invalid tournament type.");
  }

  // Check if the number of participants matches the number of teams
  if (data.participants !== data.teams.length) {
    throw new Error("Number of participants must match the number of teams.");
  }
  // Check if the teams are valid
  if (data.teams.length < 2) {
    throw new Error("At least 2 teams are required.");
  }
  // Check if the teams are unique
  //const teamIds = data.teams.map((team) => team.team_id);
  //const uniqueTeamIds = new Set(teamIds);

  // 1. Create Tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: name,
      location: location ? location : "",
      start_date: start_date,
      end_date: end_date,
      tournament_type: tournament_type,
      description: description ? description : "",
      participants: participants,
      sport_type: sport_type ?? "",
    },
  });

  // Create knockout format
  if (tournament_type === validTournamentTypes[0]) {
  }

  // Create league format
  // Generate single round-robin matchups
  if (tournament_type === validTournamentTypes[1]) {
    const matchesData = [];
    let roundNumber = 1;

    for (let i = 0; i < participants - 1; i++) {
      for (let j = i + 1; j < participants; j++) {
        matchesData.push({
          tournament_id: tournament.tournament_id,
          round: `Jornada ${roundNumber}`,
          match_date: new Date(start_date.getTime() + i * 24 * 60 * 60 * 1000),
          team1_id: data.teams[i].team_id,
          team2_id: data.teams[j].team_id,
        });
        roundNumber++;
      }
      roundNumber = 1;
    }

    // 2. Create matches in the database
    await prisma.match.createMany({
      data: matchesData,
    });
  }

  // Create league format
  // Generate double round-robin matchups
  if (tournament_type === validTournamentTypes[2]) {
    const matchesData = [];
    let matchNumber = 1;

    for (let i = 0; i < participants - 1; i++) {
      for (let j = i + 1; j < participants; j++) {
        // First leg
        matchesData.push({
          tournament_id: tournament.tournament_id,
          round: `Match ${matchNumber}`,
          match_date: new Date(start_date.getTime() + i * 24 * 60 * 60 * 1000),
          team1_id: data.teams[i].team_id,
          team2_id: data.teams[j].team_id,
        });
        matchNumber++;

        // Second leg (reverse)
        matchesData.push({
          tournament_id: tournament.tournament_id,
          round: `Match ${matchNumber}`,
          match_date: new Date(start_date.getTime() + i * 24 * 60 * 60 * 1000),
          team1_id: data.teams[j].team_id,
          team2_id: data.teams[i].team_id,
        });
        matchNumber++;
      }
    }

    // 3. Insert all matches
    await prisma.match.createMany({
      data: matchesData,
    });
  }

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

  console.log("Tournament setup complete ✅");

  return tournament;
};

// Update a tournament
export const updateTournament = async (
  data: z.infer<typeof TournamentModifySchema>
) => {
  console.log("Data received for update:", data);
  try {
    const t = await prisma.tournament.update({
      where: { tournament_id: data.tournament_id },
      data: {
        name: data.name,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        description: data.description,
        sport_type: data.sport_type ?? undefined,
      },
    });
    // 2. Revalidate a specific path
    revalidatePath("dashboard/admin/torneio");
    return t;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tournament: ${error.message}`);
    }
    throw new Error("Error fetching tournament: Unknown error");
  }
};

// Delete a tournament
export const deleteTournament = async (tournament_id: number) => {
  try {
    await prisma.tournament.delete({
      where: { tournament_id },
    });
    return { message: "Tournament deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tournament: ${error.message}`);
    }
    throw new Error("Error fetching tournament: Unknown error");
  }
};

interface TournamentSearchParams {
  name?: string;
  tournament_type?: string;
  sport_type?: string;
  year?: number;
  start_date?: Date;
}

export async function findTournament({
  name,
  sport_type,
  tournament_type,
  year,
}: TournamentSearchParams) {
  // Build dynamic filter object
  const whereClause: TournamentSearchParams = {};

  if (name) whereClause.name = name;
  if (tournament_type) whereClause.tournament_type = tournament_type;
  if (sport_type) whereClause.sport_type = sport_type;
  if (year) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    whereClause.start_date = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      gte: startOfYear,
      lt: endOfYear,
    };
  }

  // Perform the search using the constructed where clause
  const tournaments = await prisma.tournament.findMany({
    where: whereClause,
  });

  return tournaments;
}
