import { Dumbbell, CheckCircle } from "lucide-react";

export default function SportsSelector({ sportovi, selectedSports, onToggle }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
        <Dumbbell className="w-4 h-4 text-emerald-600" /> Dostupni sportovi
      </h2>

      <div className="flex flex-wrap gap-2">
        {sportovi.map((sport) => {
          const isSelected = selectedSports.includes(sport.id);
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onToggle(sport.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CheckCircle
                className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-600" : "opacity-0"}`}
              />
              {sport.naziv}
            </button>
          );
        })}
      </div>
    </div>
  );
}
