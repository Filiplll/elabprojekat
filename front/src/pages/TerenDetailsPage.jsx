import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import { useTereni } from "../hooks/useTereni";
import { useAuth } from "../hooks/useAuth";
import ErrorState from "../components/ui/ErrorState";
import Button from "../components/ui/Button";
import TerenInfoCard from "../components/terenDetails/TerenInfoCard";
import RadnoVremeCard from "../components/terenDetails/RadnoVremeCard";

export default function TerenDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teren, loading, error, fetchTerenById, deleteTeren, actionLoading } =
    useTereni();

  useEffect(() => {
    if (id) {
      fetchTerenById(id);
    }
  }, [id]);

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
              </>
            )}
          </div>
        </div>

        <TerenInfoCard teren={teren} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <RadnoVremeCard radnoVreme={teren.radno_vreme} />
          </div>
        </div>
      </main>
    </div>
  );
}
