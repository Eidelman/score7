"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const torneioMenus = [
  {
    id: 0,
    name: "Visão Geral",
    href: "/",
  },
  {
    id: 1,
    name: "Calendário & Resultados",
    href: "/calendario",
  },
  {
    id: 2,
    name: "Equipas",
    href: "/teams",
  },
  {
    id: 3,
    name: "Estatísticas",
    href: "/",
  },
];

export function TorneioMenu() {
  const pathname = usePathname();
  return (
    <>
      {torneioMenus.map((link) => (
        <Link
          className={cn(
            pathname === link.href
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
            "transition-all hover:text-primary uppercase font-semibold"
          )}
          href={link.href}
          key={link.id}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}
