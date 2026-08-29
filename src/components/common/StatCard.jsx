export default function StatCard({ label, value, icon: Icon, tone = 'default', hint }) {
  const toneClasses = {
    default: 'bg-white text-slate-900',
    low: 'bg-emerald-50 text-emerald-900',
    moderate: 'bg-amber-50 text-amber-900',
    high: 'bg-red-50 text-red-900',
    brand: 'bg-brand-50 text-brand-900',
  }

  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${toneClasses[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-80">{label}</p>
        {Icon && <Icon size={18} className="opacity-60" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs opacity-70">{hint}</p>}
    </div>
  )
}
