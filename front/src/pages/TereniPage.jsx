import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Building2, Globe, Plus } from "lucide-react";

import Navbar from "../components/ui/Navbar";
import SearchSection from "../components/tereni/SearchSection";
import { useTereni } from "../hooks/useTereni";
import { useSportovi } from "../hooks/useSportovi";
import TereniSkeleton from "../components/tereni/TereniSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import TerenCard from "../components/tereni/TerenCard";
import Pagination from "../components/ui/Pagination";
import ExtraFiltersBar from "../components/tereni/ExtraFilterBar";
import { useAuth } from "../hooks/useAuth";
import { useExchangeRates } from "../hooks/useExchangeRates";

export default function TereniPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { tereni, meta, loading, error, fetchTereni } = useTereni();
  const { sportovi, fetchSportovi } = useSportovi();
  const { rates, selectedCurrency, setSelectedCurrency } = useExchangeRates();

  const currentView = searchParams.get("view") === "my" ? "my" : "all";
  const isVlasnik = user?.type === "vlasnik";

  useEffect(() => {
    fetchSportovi(1, 100);
  }, []);

  const handleFetch = () => {
    const filters = Object.fromEntries([...searchParams.entries()]);
    fetchTereni(filters);
  };

  useEffect(() => {
    handleFetch();
  }, [searchParams]);

  const handleViewChange = (view) => {
    const newParams = new URLSearchParams(searchParams);
    if (view === "my") {
      newParams.set("view", "my");
    } else {
      newParams.delete("view");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    navigate("/tereni");
  };

  const sportsOptions = sportovi.map((s) => ({
    value: String(s.id),
    label: s.naziv,
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 space-y-8 pb-16">
        <div className="bg-slate-900 pt-12 pb-16">
          <SearchSection sportsOptions={sportsOptions} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {isVlasnik && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-300/60 self-start">
                <button
                  type="button"
                  onClick={() => handleViewChange("all")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    currentView === "all"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Svi tereni
                </button>
                <button
                  type="button"
                  onClick={() => handleViewChange("my")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    currentView === "my"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Moji tereni
                </button>
              </div>

              <Link
                to="/create-teren"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                Dodaj novi teren
              </Link>
            </div>
          )}

          <ExtraFiltersBar
            onResetAll={handleResetFilters}
            rates={rates}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />

          {loading && <TereniSkeleton count={6} />}

          {error && !loading && (
            <ErrorState message={error} onRetry={handleFetch} />
          )}

          {!loading && !error && tereni.length === 0 && (
            <EmptyState onReset={handleResetFilters} />
          )}

          {!loading && !error && tereni.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tereni.map((teren) => (
                  <TerenCard
                    key={teren.id}
                    teren={teren}
                    selectedCurrency={selectedCurrency}
                    rate={rates[selectedCurrency] || 1}
                  />
                ))}
              </div>

              <Pagination meta={meta} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
