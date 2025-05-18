"use server";

import { checkTournamentMatches } from "@/app/utils/checkTournamentMatches";
import { shuffleTeams } from "@/app/utils/shuffleTeams";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

export async function generateNextRoundNewMatches(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"));
  if (!tournamentId) throw new Error("Invalid tournament ID");

  const { allPlayed } = await checkTournamentMatches(tournamentId);

  if (allPlayed) {
    const winners = await prisma.match.findMany({
      select: { winner_team_id: true },
      where: {
        tournament_id: tournamentId,
      },
    });

    // 2. Shuffle participants randomly
    //const shuffled = winners.sort(() => Math.random() - 0.5);
    const shuffled = shuffleTeams(winners);

    const currentStartDate = new Date();
    const roundName = getRoundName(shuffled.length);
    const roundMatches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      const winner1 = Number(shuffled[i].winner_team_id);
      const winner2 = Number(shuffled[i + 1].winner_team_id);

      roundMatches.push({
        tournament_id: tournamentId,
        round: roundName,
        match_date: new Date(currentStartDate),
        team1_id: winner1,
        team2_id: winner2,
      });
    }

    // Save matches for this round
    await prisma.match.createMany({
      data: roundMatches,
    });

    // 5. Schedule matches at the venue
    const matches = await prisma.match.findMany({
      where: { tournament_id: tournamentId, round: roundName },
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
    revalidatePath("dashboard/admin/torneio/" + tournamentId);
  }
}

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
