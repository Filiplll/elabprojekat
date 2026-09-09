import { Clock } from "lucide-react";
import Select from "../ui/Select";

const TIME_OPEN_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`;
  const val = `${hour}:00`;
  return { value: val, label: val };
});

const TIME_CLOSE_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
  const val = `${hour}:00`;
  return { value: val, label: val };
});

export default function WorkingHoursSection({ radnoVreme, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
        <Clock className="w-4 h-4 text-emerald-600" /> Radno vreme
      </h2>

      <div className="space-y-2.5">
        {radnoVreme.map((item, index) => (
          <div
            key={item.dan_u_nedelji}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 gap-3 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <span className="w-28 font-medium text-slate-800">
                {item.naziv}
              </span>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={item.radi}
                  onChange={(e) => onChange(index, "radi", e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-slate-600 text-xs">Radi</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-28">
                <Select
                  disabled={!item.radi}
                  value={item.otvara_u}
                  onChange={(e) => onChange(index, "otvara_u", e.target.value)}
                  options={TIME_OPEN_OPTIONS}
                />
              </div>

              <span className="text-slate-400 font-medium">&ndash;</span>

              <div className="w-28">
                <Select
                  disabled={!item.radi}
                  value={item.zatvara_u}
                  onChange={(e) => onChange(index, "zatvara_u", e.target.value)}
                  options={TIME_CLOSE_OPTIONS}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
