"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { findTournament } from "@/actions/torneio.actions";
import Link from "next/link";

type Tournament = {
  name: string;
  sport_type: string;
  tournament_type: string;
  tournament_id: number;
  start_date: Date;
  end_date: Date;
  participants: number;
};

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [sport, setSport] = useState("");
  const [torneioNome, setTorneioNome] = useState("");

  const handleGetTournament = async () => {
    const torneios = await findTournament({
      name: torneioNome,
      tournament_type: sport,
    });
    setTournaments(torneios);
  };
  return (
    <div className="flex flex-col gap-10 items-center max-w-[70%] mx-auto py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Encontrar Torneios</h1>
        <p>Pesquise diversos torneios</p>
      </div>

      <div className="flex flex-col gap-5 w-[700px] items-center">
        <div className="flex flex-row gap-5 w-full">
          <Select
            onValueChange={(value) => {
              setSport(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="basquete">Basquete</SelectItem>
                <SelectItem value="Futebol">Futebol 11</SelectItem>
                <SelectItem value="futsal">Futsal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Qualquer nome"
          onChange={(e) => {
            setTorneioNome(e.target.value);
          }}
        />

        <Button
          type="button"
          onClick={handleGetTournament}
          className="w-1/2 rounded-full"
        >
          Encontrar Torneios (Max 10)
        </Button>
      </div>
      <div className="w-[700px]">
        <div className="grid grid-cols-4 gap-3 border-b pb-2">
          <Label className="col-span-1 text-center">Name</Label>
          <Label className="col-span-1 text-center">Sport</Label>
          <Label className="col-span-1 text-center">Participants</Label>
          <Label className="col-span-1 text-center">Date</Label>
        </div>
        {tournaments?.map((tor) => (
          <Link
            key={tor.tournament_id}
            className="grid grid-cols-4 gap-3 border-b p-4"
            href={`/torneios/${tor.tournament_id}/results`}
          >
            <Label className="col-span-1 text-center hover:cursor-pointer">
              {tor.name}
            </Label>
            <Label className="col-span-1 text-center hover:cursor-pointer">
              {tor.tournament_type}
            </Label>
            <Label className="col-span-1 text-center hover:cursor-pointer">
              {tor.participants}
            </Label>
            <Label className="col-span-1 text-center hover:cursor-pointer">
              {`${tor.start_date.toLocaleDateString()} - ${tor.end_date.toLocaleDateString()}`}
            </Label>
          </Link>
        ))}
      </div>
    </div>
  );
}
