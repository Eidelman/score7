import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Checks total matches and if all have been played for a given tournament
 * @param tournamentId ID of the tournament
 * @returns Object with total and played match count, and whether all are played
 */
export async function checkTournamentMatches(tournamentId: number) {
  const totalMatches = await prisma.match.count({
    where: { tournament_id: tournamentId },
  });

  const playedMatches = await prisma.match.count({
    where: {
      tournament_id: tournamentId,
      NOT: [
        { score_team1: null },
        { score_team2: null },
        { winner_team_id: null },
      ],
    },
  });

  const allPlayed = totalMatches > 0 && totalMatches === playedMatches;

  return {
    totalMatches,
    playedMatches,
    allPlayed,
  };
}
