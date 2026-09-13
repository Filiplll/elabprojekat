import Button from "./Button";

export default function AdminHeader({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionIcon: ActionIcon,
  onActionClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          {Icon && <Icon className="w-7 h-7 text-emerald-600" />}
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>

      {actionLabel && (
        <Button
          variant="primary"
          icon={ActionIcon}
          onClick={onActionClick}
          className="py-2.5 px-5 self-start sm:self-auto"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
