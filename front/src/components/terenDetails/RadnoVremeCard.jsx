import { Clock, CheckCircle2, XCircle } from "lucide-react";

export default function RadnoVremeCard({ radnoVreme }) {
  if (!radnoVreme || radnoVreme.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Clock className="w-5 h-5 text-emerald-600" />
        Radno vreme
      </h2>

      <div className="divide-y divide-slate-100">
        {radnoVreme.map((dan) => (
          <div
            key={dan.dan_u_nedelji}
            className="py-2.5 flex items-center justify-between text-sm"
          >
            <span className="capitalize font-medium text-slate-700">
              {dan.naziv_dana}
            </span>
            {dan.radi ? (
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {dan.prikaz}
              </span>
            ) : (
              <span className="text-rose-500 font-medium flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                Ne radi
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
