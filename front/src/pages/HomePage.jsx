import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/tereni/HeroSection";
import FeaturesSection from "../components/tereni/FeaturesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 space-y-12 pb-16">
        <HeroSection />

        <FeaturesSection />
      </main>
    </div>
  );
}
