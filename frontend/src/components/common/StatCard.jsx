
export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'default',
  hint,
}) {
  const toneClasses = {
    default:
      'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',

    low:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300',

    moderate:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300',

    high:
      'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-300',

    brand:
      'bg-brand-50 dark:bg-brand-800 text-brand-900 dark:text-brand-100',
  }

  return (
    <div
      className={`
        h-[110px] w-full
        rounded-xl
        border border-slate-200 dark:border-slate-700
        p-4
        transition-colors duration-200
        ${toneClasses[tone]}
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-80">
          {label}
        </p>

        {Icon && (
          <Icon
            size={18}
            className="opacity-60"
            aria-hidden="true"
          />
        )}
      </div>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>

      {hint && (
        <p className="mt-1 text-xs opacity-70">
          {hint}
        </p>
      )}
    </div>
  )
}

