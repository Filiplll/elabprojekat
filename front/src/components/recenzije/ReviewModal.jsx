import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import StarRatingInput from "../ui/StarRatingInput";

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [ocena, setOcena] = useState(5);
  const [komentar, setKomentar] = useState("");

  useEffect(() => {
    if (initialData) {
      setOcena(initialData.ocena || 5);
      setKomentar(initialData.komentar || "");
    } else {
      setOcena(5);
      setKomentar("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ocena, komentar });
  };

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
          {initialData ? "Izmeni recenziju" : "Ostavi recenziju"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ocena (1 - 5)
            </label>
            <StarRatingInput value={ocena} onChange={setOcena} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Komentar (opciono)
            </label>
            <textarea
              rows={4}
              maxLength={1000}
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Napišite vaše utiske o terenu..."
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
              {initialData ? "Sačuvaj izmene" : "Pošalji recenziju"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
