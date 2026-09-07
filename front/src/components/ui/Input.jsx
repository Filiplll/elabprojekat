export default function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error,
  required = false,
  icon: Icon,
  theme = "emerald",
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
          className="mb-1 block text-sm font-semibold text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon
              className={`h-5 w-5 ${error ? "text-red-400" : selectedTheme.split(" ").pop()}`}
            />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border bg-white py-2 text-sm text-gray-900 placeholder-gray-400 transition-all outline-none focus:ring-2 ${
            Icon ? "pl-10 pr-3" : "px-3"
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : `border-gray-300 ${selectedTheme}`
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
