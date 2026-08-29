import { Loader2 } from 'lucide-react'

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500" role="status" aria-live="polite">
      <Loader2 size={28} className="animate-spin text-brand-500" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
