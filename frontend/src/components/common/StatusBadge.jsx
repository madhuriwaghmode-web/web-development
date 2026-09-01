const STYLES = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  fair: 'bg-amber-50 text-amber-800 border-amber-200',
  poor: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-slate-100 text-slate-700 border-slate-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  demo: 'bg-violet-50 text-violet-700 border-violet-200',
}

export default function StatusBadge({ status, children }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${STYLES[status] || STYLES.pending}`}>
      {children}
    </span>
  )
}
