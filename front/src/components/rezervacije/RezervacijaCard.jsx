import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  X,
  Star,
  Users,
  Loader2,
} from "lucide-react";
import Button from "../ui/Button";
import ReviewModal from "../recenzije/ReviewModal";
import { useAuth } from "../../hooks/useAuth";
import JavniPozivModal from "../javniPozivi/JavniPozivModal";

export default function RezervacijaCard({
  rezervacija,
  onStatusChange,
  actionLoading,
  kreirajRecenziju,
  izmeniRecenziju,
  onSubmitted,
  kreirajJavniPoziv,
}) {
  const { user } = useAuth();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  const [isJavniPozivModalOpen, setIsJavniPozivModalOpen] = useState(false);
  const [javniPozivLoading, setJavniPozivLoading] = useState(false);
  const [javniPozivFormData, setJavniPozivFormData] = useState({
    rezervacijaId: rezervacija.id,
    broj_slobodnih_mesta: 1,
    opis: "",
  });

  const mojaRecenzija = rezervacija.moja_recenzija;

  const handleReviewSubmit = async (data) => {
    setReviewSubmitLoading(true);

    let res;
    if (mojaRecenzija) {
      res = await izmeniRecenziju(mojaRecenzija.id, data);
    } else {
      res = await kreirajRecenziju(rezervacija.id, data);
    }

    setReviewSubmitLoading(false);

    if (res?.success) {
      setIsReviewModalOpen(false);
      if (onSubmitted) {
        onSubmitted();
      }
    } else if (res?.error) {
      alert(res.error);
    }
  };

  const handleOpenJavniPozivModal = () => {
    setJavniPozivFormData({
      rezervacijaId: rezervacija.id,
      broj_slobodnih_mesta: 1,
      opis: "",
    });
    setIsJavniPozivModalOpen(true);
  };

  const handleJavniPozivSubmit = async (e) => {
    e.preventDefault();
    if (!kreirajJavniPoziv) return;

    setJavniPozivLoading(true);
    const res = await kreirajJavniPoziv(javniPozivFormData);
    setJavniPozivLoading(false);

    if (res?.success) {
      setIsJavniPozivModalOpen(false);
      if (onSubmitted) {
        onSubmitted();
      }
    } else if (res?.error) {
      alert(res.error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "na_cekanju":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "potvrdjena":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "otkazana":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "odigrana":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "na_cekanju":
        return "Na čekanju";
      case "potvrdjena":
        return "Potvrđena";
      case "otkazana":
        return "Otkazana";
      case "odigrana":
        return "Odigrana";
      default:
        return status;
    }
  };

  const isOwner = user?.type === "vlasnik";
  const isPlayer = user?.type === "igrac";
  const haveCall = rezervacija.ima_javni_poziv;

  const prikazaniKorisnik = isOwner ? rezervacija.igrac : "";

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {rezervacija.teren?.naziv}
            </h3>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {rezervacija.teren?.adresa}, {rezervacija.teren?.grad}
            </p>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
              rezervacija.status,
            )}`}
          >
            {getStatusLabel(rezervacija.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>
              {rezervacija.datum} ({rezervacija.dan})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              {rezervacija.vreme_od} - {rezervacija.vreme_do} (
              {rezervacija.trajanje})
            </span>
          </div>

          {prikazaniKorisnik && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>
                <strong className="text-slate-800">
                  {prikazaniKorisnik.puno_ime || prikazaniKorisnik.name}
                </strong>{" "}
                ({prikazaniKorisnik.email})
              </span>
            </div>
          )}
        </div>

        {isPlayer && mojaRecenzija && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                Vaša recenzija:
                <span className="text-amber-500 font-bold ml-1">
                  {mojaRecenzija.ocena_prikaz || `${mojaRecenzija.ocena} ★`}
                </span>
              </span>
              <Button onClick={() => setIsReviewModalOpen(true)}>Izmeni</Button>
            </div>
            {mojaRecenzija.komentar && (
              <p className="text-slate-600 italic">
                "{mojaRecenzija.komentar}"
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
          <div>
            <span className="text-xs text-slate-500 block">Ukupna cena</span>
            <span className="text-base font-bold text-slate-900">
              {rezervacija.cena_formatirana || `${rezervacija.cena_ukupno} RSD`}
            </span>
          </div>

          {isOwner && rezervacija.status === "na_cekanju" && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={actionLoading}
                onClick={() => onStatusChange(rezervacija.id, "otkazana")}
                className="py-1.5 px-3 border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Odbij
              </Button>

              <Button
                type="button"
                variant="primary"
                disabled={actionLoading}
                onClick={() => onStatusChange(rezervacija.id, "potvrdjena")}
                className="py-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Potvrdi
              </Button>
            </div>
          )}

          {isPlayer && (
            <div className="flex items-center gap-2">
              {rezervacija.status === "potvrdjena" &&
                kreirajJavniPoziv &&
                !haveCall && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionLoading}
                    onClick={handleOpenJavniPozivModal}
                    className="py-1.5 px-3 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Users className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Javni poziv
                  </Button>
                )}

              {(rezervacija.status === "na_cekanju" ||
                rezervacija.status === "potvrdjena") && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => onStatusChange(rezervacija.id)}
                  className="py-1.5 px-3 border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Otkaži rezervaciju
                </Button>
              )}

              {rezervacija.status === "odigrana" && !mojaRecenzija && (
                <Button
                  type="button"
                  variant="primary"
                  disabled={actionLoading}
                  onClick={() => setIsReviewModalOpen(true)}
                  className="py-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  <Star className="w-3.5 h-3.5 mr-1" />
                  Ostavi recenziju
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        initialData={mojaRecenzija}
        loading={reviewSubmitLoading}
      />

      <JavniPozivModal
        isOpen={isJavniPozivModalOpen}
        mode="create"
        formData={javniPozivFormData}
        setFormData={setJavniPozivFormData}
        onSubmit={handleJavniPozivSubmit}
        onClose={() => setIsJavniPozivModalOpen(false)}
        loading={javniPozivLoading}
      />
    </>
  );
}
