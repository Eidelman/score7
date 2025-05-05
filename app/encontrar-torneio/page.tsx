import React from "react";

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

export default function EncontrarTorneioRoute() {
  return (
    <div className="flex flex-col gap-5 items-center max-w-6xl mx-auto py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Encontrar Torneios</h1>
        <p>Pesquise diversos torneios</p>
      </div>

      <form className="flex flex-col gap-4 w-[700px]">
        <div className="flex flex-row gap-5">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Qualquer esporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Qualquer esporte</SelectItem>
                <SelectItem value="badminton">Badminton</SelectItem>
                <SelectItem value="basquete">Basquete</SelectItem>
                <SelectItem value="futebol">Futebol 11</SelectItem>
                <SelectItem value="futsal">Futsal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Qualquer formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="mata-mata">Mata-mata</SelectItem>
                <SelectItem value="liga">Liga</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input placeholder="Qualquer nome" />

        <Button type="submit">Encontrar Torneios (Max 10)</Button>
      </form>
    </div>
  );
}
