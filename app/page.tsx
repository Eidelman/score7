import Hero from "./components/Hero";
import HeroImg from "@/public/football.jpg";
import TournamentSection from "./components/TournamentSection";

export default function Home() {
  return (
    <div className="h-screen space-y-4 flex flex-col bg-gray-100">
      <Hero imageUrl={HeroImg} title="Club de Desporto" />
      <TournamentSection />
    </div>
  );
}
