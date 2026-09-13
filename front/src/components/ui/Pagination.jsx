import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ meta }) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!meta || meta.last_page <= 1) {
    return null;
  }

  const { current_page, last_page } = meta;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > last_page || newPage === current_page) {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };

  const pages = Array.from({ length: last_page }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-6 border-t border-slate-200/80">
      <button
        type="button"
        onClick={() => handlePageChange(current_page - 1)}
        disabled={current_page === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        title="Prethodna stranica"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isActive = page === current_page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center ${
                isActive
                  ? "bg-emerald-600 text-white border border-emerald-600 shadow-emerald-200"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => handlePageChange(current_page + 1)}
        disabled={current_page === last_page}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        title="Sledeća stranica"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
