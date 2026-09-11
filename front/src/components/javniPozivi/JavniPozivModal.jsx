import { X, Loader2 } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function JavniPozivModal({
  isOpen,
  mode = "create",
  formData,
  setFormData,
  onSubmit,
  onClose,
  loading = false,
}) {
  if (!isOpen) return null;

  const isCreate = mode === "create";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl relative z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900">
          {isCreate ? "Kreiraj Javni Poziv" : "Izmeni Javni Poziv"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Broj potraživanih mesta (1 - 50)
            </label>
            <Input
              type="number"
              min={1}
              max={50}
              required
              value={formData.broj_slobodnih_mesta || 1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  broj_slobodnih_mesta: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Opis (opciono)
            </label>
            <textarea
              rows={4}
              maxLength={1000}
              value={formData.opis || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, opis: e.target.value }))
              }
              placeholder="Tražimo golmana i još dva igrača..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-slate-600"
            >
              Otkaz
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              className="inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreate ? "Kreiraj" : "Ažuriraj"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
