import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  SlidersHorizontal,
  Search,
  DollarSign,
  RotateCcw,
  Coins,
} from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";

export default function ExtraFiltersBar({ onResetAll }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const nazivFromUrl = searchParams.get("naziv") || "";
  const sortByFromUrl = searchParams.get("sort_by") || "";
  const orderFromUrl = searchParams.get("order") || "asc";
  const rsdCenaFromUrl = searchParams.get("max_cena");

  const [naziv, setNaziv] = useState(nazivFromUrl);
  const [sortBy, setSortBy] = useState(sortByFromUrl);
  const [order, setOrder] = useState(orderFromUrl);
  const [maxCenaInput, setMaxCenaInput] = useState(rsdCenaFromUrl);

  const [prevParams, setPrevParams] = useState({
    searchParams,
  });

  if (prevParams.searchParams !== searchParams) {
    setPrevParams({ searchParams });
    setNaziv(nazivFromUrl);
    setSortBy(sortByFromUrl);
    setOrder(orderFromUrl);
    setMaxCenaInput(rsdCenaFromUrl);
  }

  const sortOptions = [
    { value: "cena_po_satu", label: "Ceni" },
    { value: "naziv", label: "Nazivu" },
    { value: "grad", label: "Gradu" },
    { value: "created_at", label: "Datumu dodavanja" },
  ];

  const orderOptions = [
    { value: "asc", label: "Rastuće (A-Z / Min)" },
    { value: "desc", label: "Opadajuće (Z-A / Max)" },
  ];

  const applyFiltersToUrl = (nazivVal, maxCenaRsdVal, sortByVal, orderVal) => {
    const newParams = new URLSearchParams(searchParams);

    if (nazivVal) newParams.set("naziv", nazivVal);
    else newParams.delete("naziv");

    if (maxCenaRsdVal) newParams.set("max_cena", maxCenaRsdVal);
    else newParams.delete("max_cena");

    if (sortByVal) newParams.set("sort_by", sortByVal);
    else newParams.delete("sort_by");

    if (orderVal) newParams.set("order", orderVal);
    else newParams.delete("order");

    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleApplyExtraFilters = (e) => {
    e.preventDefault();
    applyFiltersToUrl(naziv, maxCenaInput, sortBy, order);
  };

  return (
    <form
      onSubmit={handleApplyExtraFilters}
      className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between"
    >
      <div className="flex items-center gap-2 text-slate-700 font-semibold w-full xl:w-auto">
        <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
        <span>Dodatni filteri:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 w-full xl:w-auto flex-1">
        <Input
          placeholder="Pretraži po nazivu..."
          icon={Search}
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Max cena"
          icon={DollarSign}
          value={maxCenaInput}
          onChange={(e) => setMaxCenaInput(e.target.value)}
        />

        <Select
          icon={ArrowUpDown}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={sortOptions}
          placeholder="Sortiraj po..."
        />

        <Select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          options={orderOptions}
          placeholder="Smer"
        />
      </div>

      <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
        <Button
          type="submit"
          variant="primary"
          className="w-full xl:w-auto py-2 px-5"
        >
          Primeni
        </Button>

        <Button
          type="button"
          variant="secondary"
          icon={RotateCcw}
          onClick={onResetAll}
          className="py-2 px-3 border-slate-200 text-slate-600 hover:bg-slate-100"
          title="Poništi sve filtere"
        >
          Resetuj
        </Button>
      </div>
    </form>
  );
}
