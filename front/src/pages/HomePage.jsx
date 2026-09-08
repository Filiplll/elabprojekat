import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/tereni/HeroSection";
import SearchSection from "../components/tereni/SearchSection";
import FeaturesSection from "../components/tereni/FeaturesSection";
import { useSportovi } from "../hooks/useSportovi";
import { useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { sportovi, fetchSportovi } = useSportovi();
  const { user } = useAuth();

  useEffect(() => {
    fetchSportovi();
  }, []);

  const sportsOptions = useMemo(() => {
    return sportovi.map((sport) => ({
      value: String(sport.id),
      label: sport.naziv,
    }));
  }, [sportovi]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 space-y-12 pb-16">
        <HeroSection />

        {user.type === "igrac" && (
          <SearchSection sportsOptions={sportsOptions} />
        )}

        <FeaturesSection />
      </main>
    </div>
  );
}
