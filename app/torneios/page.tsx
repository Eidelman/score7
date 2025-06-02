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
import { useEffect, useState } from "react";
import { findTournament } from "@/actions/torneio.actions";
import Link from "next/link";
import { Loader, Trophy } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { SPORT_TYPES, TOURNAMENT_TYPES } from "../utils/constants";

type Tournament = {
  name: string;
  sport_type: string;
  tournament_type: string;
  tournament_id: number;
  start_date: Date;
  end_date: Date;
  participants: number;
};

export default function TorneiosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [sport, setSport] = useState("");
  const [torneioNome, setTorneioNome] = useState("");
  const [format, setFormat] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  const handleGetTournament = async () => {
    setPending(true);
    const torneios = await findTournament({
      name: torneioNome,
      sport_type: sport,
      tournament_type: format,
      year: year ? year : undefined,
    });
    setTournaments(torneios);
    setPending(false);
  };

  useEffect(() => {
    const fetchTorneios = async () => {
      const t = await findTournament({
        name: torneioNome,
        sport_type: sport,
        tournament_type: format,
      });
      setTournaments(t);
    };
    fetchTorneios();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center  pt-24 pb-10">
      <div className="max-w-[70%] mx-auto items-center border rounded-full py-8 px-14 bg-white shadow-lg">
        <div className="grid grid-cols-8 gap-2">
          <Select
            onValueChange={(value) => {
              setSport(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Selecione a modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                {SPORT_TYPES.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              setFormat(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                {TOURNAMENT_TYPES.map((formato) => (
                  <SelectItem key={formato.value} value={formato.value}>
                    {formato.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            className="col-span-2"
            placeholder="Titulo do Torneio"
            onChange={(e) => {
              setTorneioNome(e.target.value);
            }}
          />

          <Input
            type="number"
            placeholder="Ano"
            onChange={(e) => {
              const value = e.target.value;
              setYear(value ? Number(value) : null);
            }}
          />

          {pending ? (
            <Button
              disabled
              className="rounded-lg font-bold text-[#0070f3] border-[#0070f3]"
            >
              <Loader className="size-7 mr-2 animate-spin" /> Aguarde...
            </Button>
          ) : (
            <Button
              variant="outline"
              type="button"
              onClick={handleGetTournament}
              className="rounded-lg font-bold text-[#0070f3] border-[#0070f3] hover:bg-[#0070f3] hover:text-white transition-colors"
            >
              Procurar
            </Button>
          )}
        </div>
      </div>
      <div className="w-full max-w-[65%] mx-auto border rounded-lg shadow-md px-0">
        <div className="grid grid-cols-5 gap-3 border border-zinc-500 p-4  uppercase bg-zinc-500 rounded-t-lg text-zinc-50">
          <Label className="col-span-1 text-center font-semibold text-xs">
            Torneio
          </Label>
          <Label className="col-span-1 text-center font-semibold text-xs">
            Modalidade
          </Label>
          <Label className="col-span-1 text-center font-semibold text-xs">
            Formato
          </Label>
          <Label className="col-span-1 text-center font-semibold text-xs">
            Nº de Participantes
          </Label>
          <Label className="col-span-1 text-center font-semibold text-xs">
            Data
          </Label>
        </div>
        {tournaments.length === 0 && (
          <EmptyState title="Nenhum torneio foi encontrado" />
        )}
        {tournaments?.map((tor) => (
          <Link
            key={tor.tournament_id}
            className="grid grid-cols-5 gap-3 border-b p-4 text-muted-foreground hover:bg-zinc-200 transition-colors"
            href={`/torneios/${tor.tournament_id}/results`}
          >
            <Label className="col-span-1 flex flex-row items-center gap-2 justify-center hover:cursor-pointer">
              <Trophy size={18} /> {tor.name}
            </Label>
            <Label className="col-span-1 text-center hover:cursor-pointer">
              {tor.sport_type}
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
