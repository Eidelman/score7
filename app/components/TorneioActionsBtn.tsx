"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { deleteTournament } from "@/actions/torneio.actions";

export function TorneioActionsBtn({ torneioId }: { torneioId: number }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/dashboard/admin/torneio/" + torneioId);
  };

  const handleDelete = async () => {
    const torneio = await deleteTournament(torneioId);
    if (torneio) {
      alert("Torneio deleted successfully!");
      router.refresh(); // Refresh the page after successful deletion
    } else {
      console.error("Failed to delete torneio.");
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
