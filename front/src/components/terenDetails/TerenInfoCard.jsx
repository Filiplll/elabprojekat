import { MapPin, User, Tag } from "lucide-react";

export default function TerenInfoCard({ teren }) {
  if (!teren) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {teren.sportovi?.map((sport) => (
            <span
              key={sport.id}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1.5"
            >
              {sport.naziv}
            </span>
          ))}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              teren.natkriven
                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                : "bg-amber-50 text-amber-700 border border-amber-200/60"
            }`}
          >
            {teren.natkriven ? "Natkriven" : "Otkriven (na otvorenom)"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {teren.naziv}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {teren.adresa}, {teren.grad}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            Vlasnik: {teren.vlasnik?.puno_ime}
          </span>
        </div>

        {teren.opis && (
          <div className="pt-2 flex items-start gap-2 text-slate-600 text-sm">
            <Tag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{teren.opis}</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-right w-full md:w-auto shrink-0">
        <span className="text-xs text-slate-500 font-medium block">
          Cena po satu
        </span>
        <span className="text-2xl font-bold text-emerald-600">
          {teren.cena_formatirana}
        </span>
      </div>
    </div>
  );
}
