import { Scan, FlaskConical } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function SegmentationPlaceholderCard({ segmentation }) {
  const hasFindings = segmentation?.detectedLesions?.length > 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scan size={18} className="text-brand-600" />
          <h3 className="font-semibold text-slate-800">Lesion Findings</h3>
        </div>
        <StatusBadge status="demo"><FlaskConical size={11} className="mr-1 inline" /> Mock data</StatusBadge>
      </div>

      {hasFindings ? (
        <ul className="space-y-2">
          {segmentation.detectedLesions.map((lesion) => (
            <li key={lesion.type} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-slate-700">{lesion.type}</span>
              <span className="text-slate-500">{lesion.confidence}% confidence</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2.5">Lesion detection model not connected.</p>
      )}

      <p className="text-xs text-slate-400 mt-3">
        Owned by Team 1 (P2 — Lesion Segmentation). Categories tracked: microaneurysms, hemorrhages, exudates, and other retinal lesions.
      </p>
    </div>
  )
}
