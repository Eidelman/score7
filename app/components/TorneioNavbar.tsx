"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TorneioNavbar = ({ basePath }: { basePath: string }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row justify-center pb-2 pt-4">
      <ul className="flex flex-row gap-5 justify-center items-center">
        {navItems.map((item) => {
          const href = item.href ? `${basePath}/${item.href}` : basePath;
          const isActive = pathname === href;
          return (
            <li key={item.name}>
              <Link
                href={href}
                className={cn(
                  "uppercase text-xs",
                  isActive
                    ? "text-[#0070f3] font-bold"
                    : "text-[#222] font-normal"
                )}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const navItems = [
  { name: "Reseultados", href: "results" },
  { name: "Equipas", href: "teams" },
  { name: "Stats", href: "stats" },
  { name: "Sobre o torneio", href: "overview" },
];

export default TorneioNavbar;
