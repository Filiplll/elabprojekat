export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  required = false,
  icon: Icon,
  theme = "emerald",
  placeholder = "Izaberite opciju",
  className = "",
  ...props
}) {
  const themeClasses = {
    emerald: "focus:border-emerald-500 focus:ring-emerald-200 text-emerald-600",
    blue: "focus:border-blue-500 focus:ring-blue-200 text-blue-600",
    amber: "focus:border-amber-500 focus:ring-amber-200 text-amber-600",
  };

  const selectedTheme = themeClasses[theme] || themeClasses.emerald;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-semibold text-slate-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon
              className={`h-5 w-5 ${
                error ? "text-red-400" : selectedTheme.split(" ").pop()
              }`}
            />
          </div>
        )}

        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full appearance-none rounded-lg border bg-white py-2.5 text-sm text-slate-900 transition-all outline-none focus:ring-2 ${
            Icon ? "pl-10 pr-8" : "px-3 pr-8"
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : `border-slate-300 ${selectedTheme}`
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
