import { Star, ArrowUpDown, Filter } from "lucide-react";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function RecenzijeFiltersBar({
  filters,
  onFilterChange,
  onSortToggle,
}) {
  const statusOptions = [
    { value: "", label: "Svi statusi" },
    { value: "na_cekanju", label: "Na čekanju" },
    { value: "odobrena", label: "Odobrene" },
    { value: "odbijena", label: "Odbijene" },
  ];

  const ocenaOptions = [
    { value: "", label: "Tačna ocena (Sve)" },
    { value: "5", label: "5 zvezdica" },
    { value: "4", label: "4 zvezdice" },
    { value: "3", label: "3 zvezdice" },
    { value: "2", label: "2 zvezdice" },
    { value: "1", label: "1 zvezdica" },
  ];

  const minOcenaOptions = [
    { value: "", label: "Minimalna ocena (Sve)" },
    { value: "4", label: "4+ zvezdice" },
    { value: "3", label: "3+ zvezdice" },
    { value: "2", label: "2+ zvezdice" },
  ];

  const sortByOptions = [
    { value: "created_at", label: "Sortiraj po datumu" },
    { value: "ocena", label: "Sortiraj po oceni" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-3">
          <Select
            value={filters.status || ""}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={statusOptions}
            icon={Filter}
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            value={filters.ocena || ""}
            onChange={(e) => onFilterChange("ocena", e.target.value)}
            options={ocenaOptions}
            icon={Star}
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            value={filters.min_ocena || ""}
            onChange={(e) => onFilterChange("min_ocena", e.target.value)}
            options={minOcenaOptions}
            icon={Star}
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            value={filters.sort_by || "created_at"}
            onChange={(e) => onFilterChange("sort_by", e.target.value)}
            options={sortByOptions}
          />
        </div>

        <div className="lg:col-span-2">
          <Button
            type="button"
            variant="secondary"
            icon={ArrowUpDown}
            onClick={onSortToggle}
            className="w-full"
          >
            {filters.order === "asc" ? "Rastuće" : "Opadajuće"}
          </Button>
        </div>
      </div>
    </div>
  );
}
