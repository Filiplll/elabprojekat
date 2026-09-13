import { Star } from "lucide-react";

export default function StarRatingInput({
  value,
  onChange,
  maxStars = 5,
  readOnly = false,
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange(starValue)}
            className={`p-1 focus:outline-none transition-transform ${
              !readOnly ? "hover:scale-110 cursor-pointer" : "cursor-default"
            }`}
          >
            <Star
              className={`w-7 h-7 ${
                starValue <= value
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 font-semibold text-slate-700 text-sm">
        {value} / {maxStars}
      </span>
    </div>
  );
}
