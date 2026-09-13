import {
  Building2,
  Users,
  BookmarkCheck,
  Star,
  Ban,
  CheckCircle2,
  Calendar,
  UserCheck,
} from "lucide-react";
import Button from "../ui/Button";

function KorisnikRow({ user, onToggleBan, actionLoading }) {
  const isVlasnik = user.type === "vlasnik";

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-4 px-4 sm:px-6">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{user.puno_ime}</span>
          <span className="text-xs text-slate-500">{user.email}</span>
        </div>
      </td>

      <td className="py-4 px-4 sm:px-6">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isVlasnik
              ? "bg-purple-50 text-purple-700 border border-purple-200/60"
              : "bg-blue-50 text-blue-700 border border-blue-200/60"
          }`}
        >
          {isVlasnik ? (
            <>
              <Building2 className="w-3 h-3" />
              Vlasnik
            </>
          ) : (
            <>
              <Users className="w-3 h-3" />
              Igrač
            </>
          )}
        </span>
      </td>

      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          {isVlasnik ? (
            <span className="flex items-center gap-1" title="Broj terena">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <strong>{user.broj_terena}</strong> terena
            </span>
          ) : (
            <>
              <span
                className="flex items-center gap-1"
                title="Broj rezervacija"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                <strong>{user.broj_rezervacija}</strong>
              </span>
              <span className="flex items-center gap-1" title="Broj recenzija">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <strong>{user.broj_recenzija}</strong>
              </span>
            </>
          )}
        </div>
      </td>

      <td className="py-4 px-4 sm:px-6">
        {user.banovan ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
            <Ban className="w-3 h-3" />
            Banovan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3" />
            Aktivan
          </span>
        )}
      </td>

      <td className="py-4 px-4 sm:px-6 text-slate-500 text-xs whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {user.created_at}
        </div>
      </td>

      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
        <Button
          type="button"
          size="sm"
          variant={user.banovan ? "primary" : "danger"}
          icon={user.banovan ? UserCheck : Ban}
          disabled={actionLoading}
          onClick={() => onToggleBan(user)}
        >
          {user.banovan ? "Odblokiraj" : "Banuj"}
        </Button>
      </td>
    </tr>
  );
}

export default function KorisniciTabela({
  korisnici,
  onToggleBan,
  actionLoading,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4 sm:px-6">Korisnik</th>
            <th className="py-3.5 px-4 sm:px-6">Uloga</th>
            <th className="py-3.5 px-4 sm:px-6">Aktivnosti</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
            <th className="py-3.5 px-4 sm:px-6">Registrovan</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Akcije</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {korisnici.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-500">
                Nije pronađen nijedan korisnik po zadatim kriterijumima.
              </td>
            </tr>
          ) : (
            korisnici.map((user) => (
              <KorisnikRow
                key={user.id}
                user={user}
                onToggleBan={onToggleBan}
                actionLoading={actionLoading}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
