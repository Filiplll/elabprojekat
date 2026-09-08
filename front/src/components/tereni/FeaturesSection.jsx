import {
  Building2,
  Calendar,
  CheckCircle,
  Users,
  ShieldAlert,
  Search,
  UserPlus,
  Star,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function FeaturesSection() {
  const { user } = useAuth();

  return (
    <section className="max-w-5xl mx-auto px-4 pt-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900">
          {user?.type === "admin"
            ? "Brze administratorske akcije"
            : user?.type === "vlasnik"
              ? "Upravljanje poslovanjem"
              : "Mogućnosti na platformi"}
        </h2>
        <p className="text-slate-500 text-sm">
          {user?.type === "admin"
            ? "Kontrolišite rad platforme, sadržaj i korisničke naloge"
            : user?.type === "vlasnik"
              ? "Sve alatke za vođenje i organizaciju vaših terena"
              : "Rezervišite terene, organizujte mečeve i delite utiske"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {user?.type === "igrac" && (
          <>
            <FeatureCard
              icon={Search}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Pretraga i rezervacije"
              description="Lako pronađi terene, pregledaj dostupne termine, kreiraj nova zakazivanja ili izmeni i otkaži postojeće rezervacije."
            />
            <FeatureCard
              icon={UserPlus}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Javni pozivi"
              description="Fali ti igrač? Organizuj javni poziv, podesi broj slobodnih mesta ili se pridruži tuđim zakazanim mečevima."
            />
            <FeatureCard
              icon={Star}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Recenzije i utisci"
              description="Čitaj ocene drugih igrača, a nakon odigranog termina ostavi ili izmeni svoju recenziju za posećeni teren."
            />
          </>
        )}

        {user?.type === "vlasnik" && (
          <>
            <FeatureCard
              icon={Building2}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Moji tereni"
              description="Dodavanje, izmena i brisanje objekata, postavljanje cenovnika i spiska dostupnih sportova."
            />
            <FeatureCard
              icon={Calendar}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Radno vreme"
              description="Podešavanje i izmena radnog vremena po danima za svaki pojedinačni teren."
            />
            <FeatureCard
              icon={CheckCircle}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Rezervacije"
              description="Pregled svih pristiglih zakazivanja i direktna promena njihovog statusa."
            />
          </>
        )}

        {user?.type === "admin" && (
          <>
            <FeatureCard
              icon={Users}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              title="Korisnički nalozi"
              description="Pregled svih registrovanih igrača i vlasnika uz mogućnost suspenzije (banovanja) naloga."
            />
            <FeatureCard
              icon={Building2}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              title="Tereni i sportovi"
              description="Upravljanje kategorijama sportova i kompletan uvid u sve unete terene na platformi."
            />
            <FeatureCard
              icon={ShieldAlert}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              title="Moderacija recenzija"
              description="Nadzor ostavljenih utisaka i promena statusa recenzija radi održavanja kvaliteta sadržaja."
            />
          </>
        )}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, iconBg, iconColor, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-3 shadow-sm">
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
