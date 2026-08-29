import { RISK_LEVELS } from '../../utils/constants'

const STYLES = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-800 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
}

export default function RiskBadge({ risk, size = 'md' }) {
  const info = RISK_LEVELS[risk] || RISK_LEVELS.low
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${STYLES[risk] || STYLES.low} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {info.label}
    </span>
  )
}
