import { Eye } from 'lucide-react'
import { EYE_OPTIONS } from '../../utils/constants'

export default function EyeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select eye">
      {EYE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={
            'flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-medium transition-colors ' +
            (value === opt.value
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-slate-200 text-slate-600 hover:border-slate-300')
          }
        >
          <Eye size={16} /> {opt.label}
        </button>
      ))}
    </div>
  )
}
