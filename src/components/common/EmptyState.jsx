export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-14 px-4 rounded-xl border border-dashed border-slate-300 bg-white">
      {Icon && (
        <span className="grid place-items-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-1">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      <p className="font-medium text-slate-800">{title}</p>
      {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
