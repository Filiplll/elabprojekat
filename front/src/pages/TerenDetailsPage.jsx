import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Edit, ArrowLeft, Trash2, Calendar, Notebook } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import { useTereni } from "../hooks/useTereni";
import { useAuth } from "../hooks/useAuth";
import ErrorState from "../components/ui/ErrorState";
import Button from "../components/ui/Button";
import { useRezervacije } from "../hooks/useRezervacije";
import TerenInfoCard from "../components/terenDetails/TerenInfoCard";
import RadnoVremeCard from "../components/terenDetails/RadnoVremeCard";
import RezervacijaTerminaSection from "../components/terenDetails/RezervacijaTerminaSection";

export default function TerenDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teren, loading, error, fetchTerenById, deleteTeren, actionLoading } =
    useTereni();

  const {
    slobodniTerminiData,
    loading: terminiLoading,
    error: terminiError,
    fetchSlobodniTermini,
    clearSlobodniTermini,
    kreirajRezervaciju,
  } = useRezervacije();

  const [datum, setDatum] = useState("");
  const [trajanje, setTrajanje] = useState("60");
  const [selectedTermin, setSelectedTermin] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTerenById(id);
    }
  }, [id]);

  const trajanjeOptions = [];
  for (let min = 60; min <= 720; min += 30) {
    const sati = Math.floor(min / 60);
    const ostatakMin = min % 60;
    let label = `${min} min`;

    if (sati > 0 && ostatakMin === 0) {
      label += ` (${sati}h)`;
    } else if (sati > 0 && ostatakMin > 0) {
      label += ` (${sati}h ${ostatakMin}m)`;
    }

    trajanjeOptions.push({
      value: String(min),
      label: label,
    });
  }

  const handleFindTermini = async (e) => {
    e.preventDefault();
    if (!datum || !trajanje) {
      alert("Molimo vas izaberite datum i trajanje.");
      return;
    }
    setSelectedTermin(null);
    await fetchSlobodniTermini(id, datum, Number(trajanje));
  };

  const handleConfirmReservation = async () => {
    if (!selectedTermin || !slobodniTerminiData?.datum) return;

    const result = await kreirajRezervaciju(id, {
      datum: slobodniTerminiData.datum,
      vreme_od: selectedTermin.vreme_od,
      vreme_do: selectedTermin.vreme_do,
    });

    if (result.success) {
      alert("Uspešno ste rezervisali termin!");
      clearSlobodniTermini();
      setSelectedTermin(null);
    } else {
      alert(result.error);
    }
  };

  const handleDeleteTeren = async () => {
    if (actionLoading) return;
    try {
      await deleteTeren(id);
      navigate("/tereni?view=my");
    } catch (err) {
      console.error("Greška pri brisanju terena:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !teren) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <ErrorState message={error || "Teren nije pronađen."} />
        </div>
      </div>
    );
  }

  const isOwner = user?.type === "vlasnik" && user?.id === teren.vlasnik?.id;
  const isPlayer = user?.type === "igrac";
  const rezervacijeUrl = isOwner
    ? `/rezervacije?teren_id=${id}`
    : `/moje-rezervacije?teren_id=${id}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
            Nazad
          </Button>

          <div className="flex items-center gap-3">
            <Link to={`/recenzije?teren_id=${id}`}>
              <Button variant="outline" icon={Notebook} className="py-2 px-4">
                Recenzije
              </Button>
            </Link>
            {(isOwner || isPlayer) && (
              <Link to={rezervacijeUrl}>
                <Button variant="outline" icon={Calendar} className="py-2 px-4">
                  Rezervacije
                </Button>
              </Link>
            )}

            {isOwner && (
              <>
                <Button
                  variant="danger"
                  icon={Trash2}
                  disabled={actionLoading}
                  onClick={handleDeleteTeren}
                >
                  Obriši teren
                </Button>

                <Link to={`/tereni/${id}/izmena`}>
                  <Button variant="primary" icon={Edit} className="py-2 px-4">
                    Izmeni teren
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <TerenInfoCard teren={teren} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <RadnoVremeCard radnoVreme={teren.radno_vreme} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {isPlayer && (
              <RezervacijaTerminaSection
                datum={datum}
                setDatum={setDatum}
                trajanje={trajanje}
                setTrajanje={setTrajanje}
                trajanjeOptions={trajanjeOptions}
                selectedTermin={selectedTermin}
                setSelectedTermin={setSelectedTermin}
                slobodniTerminiData={slobodniTerminiData}
                terminiLoading={terminiLoading}
                terminiError={terminiError}
                clearSlobodniTermini={clearSlobodniTermini}
                handleFindTermini={handleFindTermini}
                handleConfirmReservation={handleConfirmReservation}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
