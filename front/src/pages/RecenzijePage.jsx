import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/ui/Navbar";
import ErrorState from "../components/ui/ErrorState";
import AdminHeader from "../components/ui/AdminHeader";
import Pagination from "../components/ui/Pagination";
import RecenzijeFiltersBar from "../components/recenzije/RecenzijeFilterBar";
import ReviewsTable from "../components/recenzije/ReviewsTable";

import { useReviews } from "../hooks/useReviews";
import { useAuth } from "../hooks/useAuth";

export default function RecenzijePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.type === "admin";
  const terenId = searchParams.get("teren_id");

  const {
    reviews,
    meta,
    loading,
    error,
    actionLoading,
    fetchReviewsForAdmin,
    fetchRecenzijeTerena,
    updateReviewStatus,
  } = useReviews();

  const currentFilters = Object.fromEntries(searchParams);

  const handleFetch = () => {
    if (isAdmin) {
      fetchReviewsForAdmin(currentFilters);
    } else if (terenId) {
      fetchRecenzijeTerena(terenId, currentFilters);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [searchParams, isAdmin]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSortToggle = () => {
    const currentOrder = searchParams.get("order") || "desc";
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order", currentOrder === "asc" ? "desc" : "asc");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    if (!isAdmin || !reviewId || !newStatus) return;

    try {
      await updateReviewStatus(reviewId, newStatus);
      handleFetch();
    } catch (err) {
      console.error("Greška pri izmeni statusa:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isAdmin ? (
          <AdminHeader
            title="Upravljanje recenzijama"
            description="Pregled, modifikacija statusa i moderacija korisničkih recenzija i ocena za sportske terene."
          />
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Recenzije terena
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pregledajte utiske i prosečne ocene korisnika.
            </p>
          </div>
        )}

        <RecenzijeFiltersBar
          filters={currentFilters}
          onFilterChange={handleFilterChange}
          onSortToggle={handleSortToggle}
        />

        {loading && reviews.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleFetch} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <ReviewsTable
              reviews={reviews}
              onStatusChange={handleStatusChange}
              actionLoading={actionLoading}
              readOnly={!isAdmin}
            />
            <Pagination meta={meta} />
          </div>
        )}
      </main>
    </div>
  );
}
