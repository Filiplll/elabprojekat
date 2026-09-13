import { SearchX } from "lucide-react";
import Button from "../ui/Button";

export default function EmptyState({
  title = "Nema pronađenih terena",
  message = "Pokušajte sa izmenom filtera ili pretražite drugi grad.",
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-8 max-w-lg mx-auto text-center shadow-sm my-8">
      <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>

      {onReset && (
        <Button
          variant="secondary"
          onClick={onReset}
          className="mx-auto border-slate-200 hover:border-slate-300"
        >
          Poništi filtere
        </Button>
      )}
    </div>
  );
}
