import { CheckCircle2, AlertTriangle, XCircle, FlaskConical } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

const STATUS_META = {
  good: { label: 'Good', icon: CheckCircle2, className: 'text-emerald-600' },
  fair: { label: 'Fair', icon: AlertTriangle, className: 'text-amber-600' },
  poor: { label: 'Poor', icon: XCircle, className: 'text-red-600' },
}

function metricLabel(score) {
  if (score >= 80) return { text: 'Good', className: 'text-emerald-600' }
  if (score >= 60) return { text: 'Acceptable', className: 'text-amber-600' }
  return { text: 'Poor', className: 'text-red-600' }
}

export default function ImageQualityCard({ quality, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse">
        <div className="h-4 w-40 bg-slate-200 rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-3 bg-slate-100 rounded" />)}
        </div>
      </div>
    )
  }

  if (!quality) return null

  const meta = STATUS_META[quality.status] || STATUS_META.fair
  const Icon = meta.icon

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Image Quality</h3>
        <StatusBadge status="demo">
          <FlaskConical size={11} className="mr-1 inline" /> Mock quality check
        </StatusBadge>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Icon size={28} className={meta.className} />
        <div>
          <p className={`font-semibold ${meta.className}`}>Image Quality: {meta.label}</p>
          <p className="text-sm text-slate-500">Quality Score: {quality.qualityScore}%</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
        <QualityRow label="Blur" score={quality.blurScore} />
        <QualityRow label="Brightness / Exposure" score={quality.brightnessScore} />
        <QualityRow label="Field of View" score={quality.fieldOfViewScore} />
        <div>
          <dt className="text-slate-400">Suitable for Screening</dt>
          <dd className={`font-medium mt-0.5 ${quality.usable ? 'text-emerald-600' : 'text-red-600'}`}>
            {quality.usable ? 'Yes' : 'No'}
          </dd>
        </div>
      </dl>

      <p className={`text-sm rounded-lg px-3 py-2 ${quality.status === 'poor' ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-600'}`}>
        {quality.message}
      </p>

      <p className="text-xs text-slate-400 mt-3">
        This is a mock quality analyzer — Team 3 / P5 will replace it with the real image-quality module without changing this UI.
      </p>
    </div>
  )
}

function QualityRow({ label, score }) {
  const m = metricLabel(score)
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className={`font-medium mt-0.5 ${m.className}`}>{m.text} ({score}%)</dd>
    </div>
  )
}
