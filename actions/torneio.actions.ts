"use server";

import { TournamentSchema } from "@/app/utils/zodSchemas";
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
  // Check if the tournament type is valid
  /*const validTournamentTypes = ["League", "Knockout", "Friendly"];
  if (!validTournamentTypes.includes(tournament_type)) {
    throw new Error("Invalid tournament type.");
  }*/

  // Check if the number of participants matches the number of teams
  if (data.participants !== data.teams.length) {
    throw new Error("Number of participants must match the number of teams.");
  }
  // Check if the teams are valid
  if (data.teams.length < 2) {
    throw new Error("At least 2 teams are required.");
  }
  // Check if the teams are unique
  const teamIds = data.teams.map((team) => team.team_id);
  const uniqueTeamIds = new Set(teamIds);

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

  // 2. Create Matches (simple round-robin logic)
  for (let i = 0; i < uniqueTeamIds.size; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      await prisma.match.create({
        data: {
          tournament_id: tournament.tournament_id,
          round: "Group Stage",
          match_date: new Date(start_date.getTime() + i * 24 * 60 * 60 * 1000), // Example: match date is one day after the start date
          team1_id: teamIds[i],
          team2_id: teamIds[j],
          score_team1: 0,
          score_team2: 0,
          matchOfficials: undefined,
        },
      });
    }
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
  data: z.infer<typeof TournamentSchema>
) => {
  try {
    await prisma.tournament.update({
      where: { tournament_id: data.tournament_id },
      data: {
        name: data.name,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        tournament_type: data.tournament_type,
        description: data.description,
        participants: data.participants,
        sport_type: data.sport_type ?? undefined,
      },
    });
    // 2. Revalidate a specific path
    revalidatePath("/dashboard/admin/torneio/" + data.tournament_id); // or '/', '/dashboard', etc.
    //return tournament;
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
