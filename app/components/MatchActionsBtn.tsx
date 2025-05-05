"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Volleyball } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { updateMatchScore } from "@/actions/match.actions";

export function MatchActionsBtn({
  match_id,
  team1,
  team2,
  torneio_id,
}: {
  match_id: number;
  team1: string;
  team2: string;
  torneio_id: number;
}) {
  const [open, setOpen] = useState(false);
  const [scoreTeam1, setScoreTeam1] = useState("");
  const [scoreTeam2, setScoreTeam2] = useState("");

  const updateSchedule = async () => {};

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMatchScore({
      match_id: match_id,
      score_team1: Number(scoreTeam1),
      score_team2: Number(scoreTeam2),
      torneio_id: torneio_id,
    });
    setScoreTeam1(""); // Reset form value
    setScoreTeam2("");
    setOpen(false);
  };

  return (
    <div className="space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setOpen(true)}
          >
            <Volleyball />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form onSubmit={handleSubmitScore} className="space-y-2">
            <div className="flex flex-row justify-between gap-2 items-center">
              <Label className="w-full">{team1}</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={scoreTeam1}
                onChange={(e) => setScoreTeam1(e.target.value)}
                className="text-right"
              />
            </div>
            <div className="flex flex-row justify-between gap-2 items-center">
              <Label className="w-full">{team2}</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={scoreTeam2}
                onChange={(e) => setScoreTeam2(e.target.value)}
                className="text-right"
              />
            </div>

            <Button type="submit" size="sm">
              Submit
            </Button>
          </form>
        </PopoverContent>
      </Popover>

      <Button
        onClick={() => updateSchedule()}
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Calendar />
      </Button>
    </div>
  );
}
