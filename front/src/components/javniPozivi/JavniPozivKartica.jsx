import {
  MapPin,
  User,
  Calendar,
  Clock,
  UserMinus,
  UserPlus,
} from "lucide-react";
import Button from "../ui/Button";

export default function JavniPozivKartica({
  item,
  currentUser,
  actionLoading,
  actionPrijavaLoading,
  onOpenEdit,
  onOtkazi,
  onPridruziSe,
  onNapusti,
}) {
  const { rezervacija, ucesnici = [] } = item;
  const organizator = rezervacija?.organizator;
  const teren = rezervacija?.teren;

  const isCreator = currentUser?.id && organizator?.id === currentUser.id;
  const isJoined = item.ja_sam_prijavljen;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {teren?.naziv || "Sportska lokacija"}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              item.otvoren_za_prijave
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {item.otvoren_za_prijave
              ? `Slobodno: ${item.slobodno_mesta}/${item.broj_slobodnih_mesta}`
              : "Popunjeno"}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
            {teren?.grad || "Nepoznata lokacija"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {teren?.adresa}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Organizator:{" "}
            <span className="font-medium text-slate-700">
              {organizator?.puno_ime}
            </span>
          </p>
        </div>

        {item.opis && (
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl line-clamp-2">
            {item.opis}
          </p>
        )}

        <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {rezervacija?.dan?.toUpperCase()}, {rezervacija?.datum}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {rezervacija?.termin} ({rezervacija?.trajanje})
            </span>
          </div>
        </div>

        {ucesnici.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-700 mb-1.5">
              Prijavljeni igrači ({ucesnici.length}):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ucesnici.map((u) => (
                <span
                  key={u.id}
                  className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md"
                >
                  {u.puno_ime}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4 mt-6 flex items-center gap-2 flex-wrap">
        {isCreator ? (
          <>
            <Button
              size="sm"
              onClick={() => onOpenEdit(item)}
              disabled={actionLoading}
              className="p-2 text-slate-600 hover:bg-slate-100"
              title="Izmeni poziv"
            >
              Izmeni Poziv
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onOtkazi(item.id)}
              disabled={actionLoading}
              className="p-2 text-rose-600 hover:bg-rose-50"
              title="Otkaži poziv"
            >
              Otkaži Poziv
            </Button>
          </>
        ) : isJoined ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onNapusti(item.id)}
            disabled={actionPrijavaLoading}
            className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border-none"
          >
            <UserMinus className="w-4 h-4 mr-1.5" />
            Napusti
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onPridruziSe(item.id)}
            disabled={actionPrijavaLoading || !item.otvoren_za_prijave}
            className="text-xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Pridruži se
          </Button>
        )}
      </div>
    </div>
  );
}
