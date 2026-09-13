import Button from "../ui/Button";

function SportRow({ sport, onEdit, onDelete, actionLoading }) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-4 px-6 font-semibold text-slate-900">{sport.naziv}</td>
      <td className="py-4 px-6 text-slate-600">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          {sport.broj_terena} {sport.broj_terena === 1 ? "teren" : "terena"}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            disabled={actionLoading}
            onClick={() => onEdit(sport)}
          >
            Izmeni naziv
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={actionLoading}
            onClick={() => onDelete(sport)}
          >
            Obriši sport
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function SportoviTable({
  sportovi,
  onEdit,
  onDelete,
  actionLoading,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-6">Naziv sporta</th>
            <th className="py-3.5 px-6">Broj terena</th>
            <th className="py-3.5 px-6 text-right">Akcije</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {sportovi.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-8 text-center text-slate-500">
                Nema unetih sportova.
              </td>
            </tr>
          ) : (
            sportovi.map((sport) => (
              <SportRow
                key={sport.id}
                sport={sport}
                onEdit={onEdit}
                onDelete={onDelete}
                actionLoading={actionLoading}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
