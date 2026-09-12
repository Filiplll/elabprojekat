import { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";
import { useJavniPozivi } from "../hooks/useJavniPozivi";
import { usePrijavaPoziv } from "../hooks/usePrijavaPoziv";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/ui/Navbar";
import JavniPoziviFilteri from "../components/javniPozivi/JavniPoziviFilteri";
import JavniPozivKartica from "../components/javniPozivi/JavniPozivKartica";
import Pagination from "../components/ui/Pagination";
import JavniPozivModal from "../components/javniPozivi/JavniPozivModal";
import { useSearchParams } from "react-router-dom";

const INITIAL_FILTERS = {
  grad: "",
  od_datuma: "",
  do_datuma: "",
  order: "asc",
  page: 1,
  per_page: 3,
};

export default function JavniPoziviPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    pozivi,
    meta,
    loading,
    actionLoading,
    fetchJavniPozivi,
    izmeniJavniPoziv,
    otkaziJavniPoziv,
  } = useJavniPozivi();

  const {
    pridruziSePozivu,
    napustiPoziv,
    loading: actionPrijavaLoading,
  } = usePrijavaPoziv();

  const filters = {
    grad: searchParams.get("grad") || INITIAL_FILTERS.grad,
    od_datuma: searchParams.get("od_datuma") || INITIAL_FILTERS.od_datuma,
    do_datuma: searchParams.get("do_datuma") || INITIAL_FILTERS.do_datuma,
    order: searchParams.get("order") || INITIAL_FILTERS.order,
    page: Number(searchParams.get("page")) || INITIAL_FILTERS.page,
    per_page: Number(searchParams.get("per_page")) || INITIAL_FILTERS.per_page,
  };

  const updateFilters = (newFilters) => {
    const updated =
      typeof newFilters === "function" ? newFilters(filters) : newFilters;
    const params = new URLSearchParams();

    Object.entries(updated).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "edit",
    pozivId: null,
    rezervacijaId: "",
    broj_slobodnih_mesta: 1,
    opis: "",
  });

  const loadData = () => {
    fetchJavniPozivi(filters);
  };

  useEffect(() => {
    fetchJavniPozivi(filters);
  }, [searchParams.toString()]);

  const handlePridruziSe = async (pozivId) => {
    const res = await pridruziSePozivu(pozivId);
    if (res.success) loadData();
    else alert(res.error);
  };

  const handleNapusti = async (pozivId) => {
    const res = await napustiPoziv(pozivId);
    if (res.success) loadData();
    else alert(res.error);
  };

  const handleOtkazi = async (pozivId) => {
    if (
      !window.confirm(
        "Da li ste sigurni da želite da otkažete ovaj javni poziv?",
      )
    )
      return;
    const res = await otkaziJavniPoziv(pozivId);
    if (res.success) loadData();
    else alert(res.error);
  };

  const openEditModal = (item) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      pozivId: item.id,
      rezervacijaId: item.rezervacija?.id || "",
      broj_slobodnih_mesta: item.broj_slobodnih_mesta || 1,
      opis: item.opis || "",
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    const res = await izmeniJavniPoziv(modalState.pozivId, {
      broj_slobodnih_mesta: Number(modalState.broj_slobodnih_mesta),
      opis: modalState.opis,
    });
    if (res.success) {
      closeModal();
      loadData();
    } else alert(res.error);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Javni Pozivi</h1>
            <p className="text-slate-500 mt-1">
              Pronađite slobodne termine i pridružite se ekipi za igru
            </p>
          </div>
        </div>

        <JavniPoziviFilteri
          filters={filters}
          setFilters={updateFilters}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm">Učitavanje javnih poziva...</p>
          </div>
        ) : pozivi.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">
              Nema pronađenih javnih poziva
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Pokušajte sa izmenom filtera ili kreirajte nov poziv.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pozivi.map((item) => (
              <JavniPozivKartica
                key={item.id}
                item={item}
                currentUser={user}
                actionLoading={actionLoading}
                actionPrijavaLoading={actionPrijavaLoading}
                onOpenEdit={openEditModal}
                onOtkazi={handleOtkazi}
                onPridruziSe={handlePridruziSe}
                onNapusti={handleNapusti}
              />
            ))}
          </div>
        )}

        <Pagination meta={meta} />

        <JavniPozivModal
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          formData={modalState}
          setFormData={setModalState}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
          loading={actionLoading}
        />
      </div>
    </div>
  );
}
