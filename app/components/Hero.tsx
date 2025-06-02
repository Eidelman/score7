import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface HeroProps {
  title: string;
  imageUrl: StaticImageData | string;
  alt?: string;
}

const Hero: React.FC<HeroProps> = ({ title, imageUrl }) => (
  <section className="w-full h-2/3 relative overflow-hidden flex items-center px-28">
    <div className="absolute inset-0 z-1">
      <Image src={imageUrl} alt="Logo" fill />
    </div>
    <div className="flex flex-col w-full text-left gap-10">
      <div className="z-10">
        <h1
          className="text-6xl font-extrabold uppercase tracking-wide drop-shadow-md pl-1"
          style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
        >
          {title}
        </h1>
        <h3
          className="text-lg tracking-wide uppercase drop-shadow-md pl-2  text-blue-800"
          style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
        >
          Organize e Acompanhe os resultados dos torneios
        </h3>
      </div>
      <div className="z-10">
        <Link
          href="/torneios"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-[250px] h-14 rounded-full text-md uppercase font-bold text-[#0070f3] border-[#0070f3] hover:bg-[#0070f3] hover:text-white transition-colors"
          )}
        >
          Seguir Torneios
        </Link>
      </div>
    </div>
  </section>
);

export default Hero;
