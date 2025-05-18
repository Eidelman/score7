import { z } from "zod";

export const onboardingSchema = z.object({
  nif: z.string().min(2, "NIF é obrigatório."),
  bi: z.string().min(2, "B.I é obrigatório."),
});

export const PlayerSchema = z.object({
  player_id: z.number().int().optional(),
  first_name: z.string().max(50),
  last_name: z.string().max(50),
  number: z.coerce.number().int().nullable(),
  position: z.string().min(1, ""),
  email: z.string().email().max(100),
  date_of_birth: z.coerce.date(), // accepts string/date and converts
  team_id: z.number().int().optional(),
});

export const TeamSchema = z.object({
  team_id: z.number().int().optional(),
  team_name: z.string().max(100),
  coach_name: z.string().max(100),
  region: z.string().max(100),
  players: z.array(PlayerSchema),
});

export const TournamentSchema = z.object({
  tournament_id: z.number().int().optional(), // Optional for creation (auto-incremented)
  name: z.string().max(100).min(2, "Nome é obrigatório."),
  location: z.string().max(100).nullable().optional(),
  start_date: z.coerce.date(), // Accepts string, coerced to Date
  end_date: z.coerce.date(),
  tournament_type: z.string().min(1, "Tipo de torneio é obrigatória."),
  description: z.string().nullable().optional(),
  participants: z.coerce.number().int(),
  sport_type: z.string().min(1, "Tipo de modalidade é obrigatória."),
  teams: z.array(
    z.object({ team_id: z.number().int(), team_name: z.string() })
  ),
});
