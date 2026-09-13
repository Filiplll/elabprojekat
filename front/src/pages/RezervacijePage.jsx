import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";
import { useAuth } from "../hooks/useAuth";
import { useRezervacije } from "../hooks/useRezervacije";
import RezervacijeFilterBar from "../components/rezervacije/RezervacijeFilterBar";
import RezervacijaCard from "../components/rezervacije/RezervacijaCard";
import { useJavniPozivi } from "../hooks/useJavniPozivi";
import { useReviews } from "../hooks/useReviews";

export default function RezervacijePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const isOwner = user?.type === "vlasnik";

  const {
    rezervacije,
    meta,
    loading,
    actionLoading,
    error,
    fetchMyReservations,
    fetchVlasnikRezervacije,
    promeniStatusRezervacije,
    otkaziRezervaciju,
  } = useRezervacije();

  const { kreirajRecenziju, izmeniRecenziju } = useReviews();
  const { kreirajJavniPoziv } = useJavniPozivi();

  const filters = {
    teren_id: searchParams.get("teren_id") || "",
    od_datuma: searchParams.get("od_datuma") || "",
    do_datuma: searchParams.get("do_datuma") || "",
    status: searchParams.get("status") || "",
    sort_by: searchParams.get("sort_by") || "",
    order: searchParams.get("order") || "asc",
    page: Number(searchParams.get("page")) || 1,
    per_page: Number(searchParams.get("per_page")) || 6,
  };

  const loadReservations = () => {
    if (isOwner) {
      fetchVlasnikRezervacije(filters);
    } else {
      fetchMyReservations(filters);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [searchParams, user?.type]);

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = isOwner
      ? await promeniStatusRezervacije(id, newStatus)
      : await otkaziRezervaciju(id);

    if (res && !res.success) {
      alert(res.error);
    }
  };

  const handleSortToggle = () => {
    const currentOrder = searchParams.get("order") || "desc";
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order", currentOrder === "asc" ? "desc" : "asc");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isOwner ? "Upravljanje rezervacijama" : "Moje rezervacije"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isOwner
              ? "Pregledajte i upravljajte zahtevima za rezervaciju vaših terena."
              : "Pregledajte istoriju i status vaših rezervacija."}
          </p>
        </div>

        <RezervacijeFilterBar
          filters={filters}
          onChange={(key, val) => updateFilters({ [key]: val })}
          onReset={handleResetFilters}
          onSortToggle={handleSortToggle}
        />

        {error && <ErrorState message={error} />}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rezervacije.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            Nije pronađena nijedna rezervacija za izabrane filtere.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rezervacije.map((rezervacija) => (
                <RezervacijaCard
                  key={rezervacija.id}
                  rezervacija={rezervacija}
                  onStatusChange={handleStatusChange}
                  actionLoading={actionLoading}
                  kreirajRecenziju={kreirajRecenziju}
                  izmeniRecenziju={izmeniRecenziju}
                  onSubmitted={loadReservations}
                  kreirajJavniPoziv={kreirajJavniPoziv}
                />
              ))}
            </div>

            <Pagination meta={meta} />
          </div>
        )}
      </main>
    </div>
  );
}
