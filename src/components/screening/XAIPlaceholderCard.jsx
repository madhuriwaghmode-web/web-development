import { Brain, FlaskConical } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function XAIPlaceholderCard({ xai }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-brand-600" />
          <h3 className="font-semibold text-slate-800">Why did AI produce this result?</h3>
        </div>
        <StatusBadge status="demo"><FlaskConical size={11} className="mr-1 inline" /> Not connected</StatusBadge>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <PlaceholderTile label="Original Retina Image" />
        <PlaceholderTile label="AI Attention Map" />
        <PlaceholderTile label="Detected Findings" />
        <PlaceholderTile label="Evidence Summary" />
      </div>

      <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2.5">
        {xai?.explanation || 'Explainability results will appear here after the XAI engine is connected.'}
      </p>
      <p className="text-xs text-slate-400 mt-3">
        Owned by Team 2 (P3 — XAI Engine). This card will render the real attention map / findings once xaiService is connected — no other part of the app needs to change.
      </p>
    </div>
  )
}

function PlaceholderTile({ label }) {
  return (
    <div className="aspect-video rounded-lg border border-dashed border-slate-300 bg-slate-50 grid place-items-center text-center px-3">
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}
