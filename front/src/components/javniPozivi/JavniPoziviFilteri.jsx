import { Filter, RotateCcw } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function JavniPoziviFilteri({ filters, setFilters, onReset }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const sortOptions = [
    { value: "asc", label: "Rastuće po datumu" },
    { value: "desc", label: "Opadajuće po datumu" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filtriraj pozive</span>
        </div>

        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Resetuj filtere
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Grad..."
          value={filters.grad || ""}
          onChange={(e) => handleChange("grad", e.target.value)}
        />

        <Input
          type="date"
          value={filters.od_datuma || ""}
          onChange={(e) => handleChange("od_datuma", e.target.value)}
        />

        <Input
          type="date"
          value={filters.do_datuma || ""}
          onChange={(e) => handleChange("do_datuma", e.target.value)}
        />

        <Select
          value={filters.order || "asc"}
          onChange={(e) => handleChange("order", e.target.value)}
          options={sortOptions}
        />
      </div>
    </div>
  );
}
