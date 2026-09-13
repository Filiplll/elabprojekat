import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Users } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";
import { useKorisnici } from "../hooks/useKorisnici";
import AdminHeader from "../components/ui/AdminHeader";
import KorisniciFiltersBar from "../components/korisnici/KorisniciFiltersBar";
import KorisniciTabela from "../components/korisnici/KorisniciTabela";

export default function AdminKorisniciPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    korisnici,
    meta,
    loading,
    error,
    fetchKorisnici,
    ToggleBanKorisnika,
  } = useKorisnici();

  const [actionLoading, setActionLoading] = useState(false);
  const [pretragaInput, setPretragaInput] = useState(
    searchParams.get("pretraga") || "",
  );

  const selectedType = searchParams.get("type") || "";
  const selectedBanovan = searchParams.get("banovan") || "";
  const sortBy = searchParams.get("sort_by") || "created_at";
  const order = searchParams.get("order") || "desc";

  const handleFetch = () => {
    const filters = Object.fromEntries([...searchParams.entries()]);
    fetchKorisnici(filters);
  };

  useEffect(() => {
    handleFetch();
  }, [searchParams]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries([...searchParams.entries()]);
    const updated = { ...current, ...newParams };

    Object.keys(updated).forEach((key) => {
      if (
        updated[key] === "" ||
        updated[key] === null ||
        updated[key] === undefined
      ) {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ pretraga: pretragaInput.trim(), page: 1 });
  };

  const handleFilterChange = (key, value) => {
    updateParams({ [key]: value, page: 1 });
  };

  const handleSortChange = (field) => {
    const newOrder = sortBy === field && order === "asc" ? "desc" : "asc";
    updateParams({ sort_by: field, order: newOrder, page: 1 });
  };

  const handleToggleBan = async (user) => {
    if (!user || actionLoading) return;

    setActionLoading(true);
    const newBanStatus = !user.banovan;
    const res = await ToggleBanKorisnika(user.id, newBanStatus);
    setActionLoading(false);

    if (res.success) {
      handleFetch();
    } else {
      alert(res.error || "Došlo je do greške pri promeni statusa korisnika.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminHeader
          title="Upravljanje korisnicima"
          description="Pregled registrovanih igrača i vlasnika terena, filtriranje i upravljanje zabranama prilaza (ban)."
          icon={Users}
        />

        <KorisniciFiltersBar
          pretragaInput={pretragaInput}
          setPretragaInput={setPretragaInput}
          handleSearchSubmit={handleSearchSubmit}
          selectedType={selectedType}
          selectedBanovan={selectedBanovan}
          handleFilterChange={handleFilterChange}
          handleSortChange={handleSortChange}
        />

        {loading && korisnici.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleFetch} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <KorisniciTabela
              korisnici={korisnici}
              onToggleBan={handleToggleBan}
              actionLoading={actionLoading}
            />

            <Pagination meta={meta} />
          </div>
        )}
      </main>
    </div>
  );
}
