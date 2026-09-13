import { Calendar, Filter, ArrowUpDown, RotateCcw } from "lucide-react";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function RezervacijeFilterBar({
  filters,
  onChange,
  onReset,
  onSortToggle,
}) {
  const statusOptions = [
    { value: "", label: "Svi statusi" },
    { value: "na_cekanju", label: "Na čekanju" },
    { value: "potvrdjena", label: "Potvrđena" },
    { value: "otkazana", label: "Otkazana" },
    { value: "odigrana", label: "Odigrana" },
  ];

  const sortByOptions = [
    { value: "datum", label: "Datum rezervacije" },
    { value: "created_at", label: "Datum kreiranja" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-2">
          <Input
            type="date"
            value={filters.od_datuma || ""}
            onChange={(e) => onChange("od_datuma", e.target.value)}
            icon={Calendar}
          />
        </div>

        <div className="lg:col-span-2">
          <Input
            type="date"
            value={filters.do_datuma || ""}
            onChange={(e) => onChange("do_datuma", e.target.value)}
            icon={Calendar}
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            value={filters.status || ""}
            onChange={(e) => onChange("status", e.target.value)}
            options={statusOptions}
            icon={Filter}
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            value={filters.sort_by || "datum"}
            onChange={(e) => onChange("sort_by", e.target.value)}
            options={sortByOptions}
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            icon={ArrowUpDown}
            onClick={onSortToggle}
            className="w-full"
          >
            {filters.order === "asc" ? "Rastuće" : "Opadajuće"}
          </Button>

          {onReset && (
            <Button
              type="button"
              variant="outline"
              icon={RotateCcw}
              onClick={onReset}
              title="Resetuj filtere"
            />
          )}
        </div>
      </div>
    </div>
  );
}
