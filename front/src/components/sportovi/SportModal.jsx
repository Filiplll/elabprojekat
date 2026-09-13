import { X, AlertCircle } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SportModal({
  isOpen,
  editingSport,
  nazivInput,
  setNazivInput,
  modalError,
  actionLoading,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {editingSport ? "Izmeni sport" : "Dodaj nov sport"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Naziv sporta"
            type="text"
            placeholder="npr. Tenis"
            value={nazivInput}
            onChange={(e) => setNazivInput(e.target.value)}
            autoFocus
            required
          />

          {modalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {modalError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={actionLoading}
            >
              Otkaži
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading
                ? "Sačuvavam..."
                : editingSport
                  ? "Sačuvaj izmene"
                  : "Kreiraj"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
