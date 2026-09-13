import { CheckCircle2, XCircle, Clock, User, Calendar } from "lucide-react";
import Button from "../ui/Button";

export function StatusBadge({ status }) {
  switch (status) {
    case "odobrena":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 className="w-3 h-3" />
          Odobrena
        </span>
      );
    case "odbijena":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
          <XCircle className="w-3 h-3" />
          Odbijena
        </span>
      );
    case "na_cekanju":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
          <Clock className="w-3 h-3" />
          Na čekanju
        </span>
      );
  }
}

export function ReviewRow({ review, onStatusChange, actionLoading, readOnly }) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">
              {review.autor?.puno_ime || "Nepoznat autor"}
            </span>
          </div>
        </div>
      </td>

      <td className="py-4 px-4 sm:px-6">
        <div className="flex flex-col">
          <span className="font-medium text-slate-800 flex items-center gap-1.5">
            {review.rezervacija?.teren?.naziv || "N/A"}
          </span>
          <span className="text-xs text-slate-500">
            {review.rezervacija?.teren?.grad} &bull;{" "}
            {review.rezervacija?.termin}
          </span>
        </div>
      </td>

      <td className="py-4 px-4 sm:px-6 max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-900 text-sm">
              {review.ocena_prikaz || review.ocena}
            </span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 italic">
            "{review.komentar}"
          </p>
        </div>
      </td>

      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
        <StatusBadge status={review.status} />
      </td>

      <td className="py-4 px-4 sm:px-6 text-slate-500 text-xs whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {review.created_at}
        </div>
      </td>

      {!readOnly && (
        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-2">
            {review.status === "na_cekanju" && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="success"
                  icon={CheckCircle2}
                  disabled={actionLoading}
                  onClick={() => onStatusChange(review.id, "odobrena")}
                >
                  Odobri
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  icon={XCircle}
                  disabled={actionLoading}
                  onClick={() => onStatusChange(review.id, "odbijena")}
                >
                  Odbij
                </Button>
              </>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}

export default function ReviewsTable({
  reviews,
  onStatusChange,
  actionLoading,
  readOnly = false,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4 sm:px-6">Autor</th>
            <th className="py-3.5 px-4 sm:px-6">Teren & Termin</th>
            <th className="py-3.5 px-4 sm:px-6">Ocena i Komentar</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
            <th className="py-3.5 px-4 sm:px-6">Datum Postavljanja</th>
            {!readOnly && (
              <th className="py-3.5 px-4 sm:px-6 text-right">Akcije</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {reviews.length === 0 ? (
            <tr>
              <td
                colSpan={readOnly ? 5 : 6}
                className="py-12 text-center text-slate-500"
              >
                Nije pronađena nijedna recenzija po zadatim kriterijumima.
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                onStatusChange={onStatusChange}
                actionLoading={actionLoading}
                readOnly={readOnly}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
