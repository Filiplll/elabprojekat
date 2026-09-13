import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trophy } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";
import { useSportovi } from "../hooks/useSportovi";
import AdminHeader from "../components/ui/AdminHeader";
import SportoviTable from "../components/sportovi/SportoviTable";
import SportModal from "../components/sportovi/SportModal";

export default function AdminSportoviPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    sportovi,
    meta,
    loading,
    error,
    fetchSportovi,
    dodajSport,
    izmeniSport,
    obrisiSport,
  } = useSportovi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [nazivInput, setNazivInput] = useState("");
  const [modalError, setModalError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const handleFetch = () => {
    const page = searchParams.get("page") || 1;
    fetchSportovi(page, ITEMS_PER_PAGE);
  };

  useEffect(() => {
    handleFetch();
  }, [searchParams]);

  const handleOpenCreateModal = () => {
    setEditingSport(null);
    setNazivInput("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sport) => {
    setEditingSport(sport);
    setNazivInput(sport.naziv);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSport(null);
    setNazivInput("");
    setModalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nazivInput.trim()) {
      setModalError("Naziv sporta je obavezan.");
      return;
    }

    setActionLoading(true);
    setModalError(null);

    let res;
    if (editingSport) {
      res = await izmeniSport(editingSport.id, nazivInput.trim());
    } else {
      res = await dodajSport(nazivInput.trim());
    }

    setActionLoading(false);

    if (res.success) {
      handleCloseModal();
      handleFetch();
    } else {
      setModalError(res.error || "Došlo je do greške.");
    }
  };

  const handleDelete = async (sport) => {
    if (!sport || actionLoading) return;

    setActionLoading(true);
    const res = await obrisiSport(sport.id);
    setActionLoading(false);

    if (res.success) {
      const currentPage = Number(searchParams.get("page") || 1);

      if (sportovi.length === 1 && currentPage > 1) {
        setSearchParams({ page: String(currentPage - 1) });
      } else {
        handleFetch();
      }
    } else {
      alert(res.error || "Greška pri brisanju sporta.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminHeader
          title="Upravljanje sportovima"
          description="Pregled, dodavanje, izmena i brisanje sportova u sistemu."
          icon={Trophy}
          actionLabel="Dodaj nov sport"
          actionIcon={Plus}
          onActionClick={handleOpenCreateModal}
        />

        {loading && sportovi.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={handleFetch} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <SportoviTable
              sportovi={sportovi}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              actionLoading={actionLoading}
            />

            <Pagination meta={meta} />
          </div>
        )}
      </main>

      <SportModal
        isOpen={isModalOpen}
        editingSport={editingSport}
        nazivInput={nazivInput}
        setNazivInput={setNazivInput}
        modalError={modalError}
        actionLoading={actionLoading}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
