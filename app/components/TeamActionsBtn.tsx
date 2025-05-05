"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { deleteTeam } from "@/actions/team.actions";

export function TeamActionsBtn({ teamId }: { teamId: number }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/dashboard/admin/equipa/" + teamId);
  };

  const handleDelete = async () => {
    const team = await deleteTeam(teamId);
    if (team) {
      alert("Team deleted successfully!");
      router.refresh(); // Refresh the page after successful deletion
    } else {
      console.error("Failed to delete team.");
    }
  };
  return (
    <div className="space-x-2">
      <Button
        onClick={() => handleEdit()}
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Edit size={4} />
      </Button>

      <Button
        onClick={() => handleDelete()}
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Trash2 size={4} color="red" />
      </Button>
    </div>
  );
}
