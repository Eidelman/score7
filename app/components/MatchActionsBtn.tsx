import UpdateMatchScore from "./UpdateMatchScore";
import UpdateSechedule from "./UpdateSechedule";

export function MatchActionsBtn({
  torneio_id,
  match_id,
  schedule_id,
  team1,
  team2,
}: {
  torneio_id: number;
  match_id: number;
  schedule_id: number;
  team1: string;
  team2: string;
}) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <UpdateMatchScore
        torneio_id={torneio_id}
        match_id={match_id}
        team1={team1}
        team2={team2}
      />

      <UpdateSechedule schedule_id={schedule_id} />
    </div>
  );
}
