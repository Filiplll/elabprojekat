import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Došlo je do greške",
  message = "Nismo uspeli da učitamo podatke. Molimo pokušajte ponovo.",
  onRetry,
}) {
  return (
    <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-lg mx-auto text-center shadow-sm my-8">
      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>

      {onRetry && (
        <Button
          variant="secondary"
          icon={RefreshCw}
          onClick={onRetry}
          className="mx-auto border-slate-200 hover:border-slate-300"
        >
          Pokušaj ponovo
        </Button>
      )}
    </div>
  );
}
