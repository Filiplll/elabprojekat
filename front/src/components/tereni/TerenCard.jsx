import { MapPin } from "lucide-react";

export default function TerenCard({ teren }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {teren.sportovi?.map((sport) => (
              <span
                key={sport.id}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              >
                {sport.naziv}
              </span>
            ))}
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
              teren.natkriven
                ? "bg-slate-100 text-slate-700 border-slate-200"
                : "bg-amber-50 text-amber-700 border-amber-200/60"
            }`}
          >
            {teren.natkriven ? <>Natkriven</> : <>Na otvorenom</>}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {teren.naziv}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="line-clamp-1">
              {teren.grad}, {teren.adresa}
            </span>
          </p>
        </div>

        {teren.opis && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {teren.opis}
          </p>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">
            Cena po satu
          </span>
          <span className="text-lg font-bold text-emerald-600">
            {teren.cena_po_satu} RSD
          </span>
        </div>
      </div>
    </div>
  );
}
