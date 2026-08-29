import { ClipboardList, AlertCircle } from 'lucide-react'

export default function RecommendationCard({ recommendation, statusText }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList size={18} className="text-brand-600" />
        <h3 className="font-semibold text-slate-800">Screening Status</h3>
      </div>
      <p className="text-slate-800 font-medium">{statusText}</p>
      <p className="text-slate-600 text-sm mt-1">Recommended next step: <span className="font-medium">{recommendation}</span></p>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2.5 text-xs">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        <p>This AI-assisted result is intended for screening support and should not replace professional medical evaluation.</p>
      </div>
    </div>
  )
}
