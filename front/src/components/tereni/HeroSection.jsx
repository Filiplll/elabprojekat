import { useNavigate } from "react-router-dom";
import { ShieldAlert, Building2, Calendar } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const renderHeroTitle = () => {
    switch (user?.type) {
      case "admin":
        return (
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Upravljanje i nadzor <span className="text-amber-400">sistema</span>
          </h1>
        );
      case "vlasnik":
        return (
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Upravljaj svojim{" "}
            <span className="text-emerald-400">sportskim terenima</span>
          </h1>
        );
      case "igrac":
      default:
        return (
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Pronađi i rezerviši{" "}
            <span className="text-emerald-400">idealan teren</span>
          </h1>
        );
    }
  };

  const renderHeroButton = () => {
    switch (user?.type) {
      case "admin":
        return (
          <Button
            onClick={() => navigate("/korisnici")}
            variant="primary"
            icon={ShieldAlert}
            className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-slate-900 font-bold"
          >
            Upravljaj Korisnicima
          </Button>
        );
      case "vlasnik":
        return (
          <Button
            onClick={() => navigate("/create-teren")}
            variant="primary"
            icon={Building2}
          >
            Unesi Svoj Teren
          </Button>
        );
      case "igrac":
      default:
        return (
          <Button
            onClick={() => navigate("/rezervacije")}
            variant="primary"
            icon={Calendar}
          >
            Moje rezervacije
          </Button>
        );
    }
  };

  return (
    <section className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [16px_16px]"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {renderHeroTitle()}

        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          {user?.type === "admin"
            ? "Pregled svih korisnika, verifikacija novih terena i uvid u kompletnu statistiku platforme."
            : user?.type === "vlasnik"
              ? "Dodajte nove terene, podesite radno vreme, cene po satu i pratite sve dolazne rezervacije."
              : "Jednostavan pregled slobodnih termina, brza rezervacija i upravljanje sportskim terminima na jednom mestu."}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {renderHeroButton()}
        </div>
      </div>
    </section>
  );
}
