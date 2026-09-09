import { Search, ArrowUpDown } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function KorisniciFiltersBar({
  pretragaInput,
  setPretragaInput,
  handleSearchSubmit,
  selectedType,
  selectedBanovan,
  handleFilterChange,
  handleSortChange,
}) {
  const tipOptions = [
    { value: "", label: "Svi tipovi korisnika" },
    { value: "igrac", label: "Igrači" },
    { value: "vlasnik", label: "Vlasnici terena" },
  ];

  const statusOptions = [
    { value: "", label: "Svi statusi" },
    { value: "0", label: "Aktivni" },
    { value: "1", label: "Banovani" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="md:col-span-5">
          <Input
            type="text"
            placeholder="Pretraži po imenu, prezimenu ili email-u..."
            value={pretragaInput}
            onChange={(e) => setPretragaInput(e.target.value)}
            icon={Search}
          />
        </form>

        <div className="md:col-span-3">
          <Select
            value={selectedType}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            options={tipOptions}
          />
        </div>

        <div className="md:col-span-2">
          <Select
            value={selectedBanovan}
            onChange={(e) => handleFilterChange("banovan", e.target.value)}
            options={statusOptions}
          />
        </div>

        <div className="md:col-span-2">
          <Button
            type="button"
            variant="secondary"
            icon={ArrowUpDown}
            onClick={() => handleSortChange("created_at")}
            className="w-full"
          >
            Datum
          </Button>
        </div>
      </div>
    </div>
  );
}
