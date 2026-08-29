import { CalendarClock, CheckCircle2, Bell } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

export default function FollowUpCard({ screening, patient, onMarkComplete, onReschedule }) {
  const followUp = screening.followUp || {}
  const isPending = followUp.status !== 'completed'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className={`grid place-items-center w-10 h-10 rounded-full shrink-0 ${isPending ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isPending ? <CalendarClock size={18} /> : <CheckCircle2 size={18} />}
        </span>
        <div>
          <p className="font-medium text-slate-900">{patient?.name || screening.patientId}</p>
          <p className="text-sm text-slate-500">
            Next screening: {formatDate(followUp.date)} · {screening.classification?.classification}
          </p>
          {followUp.notes && <p className="text-xs text-slate-400 mt-1">{followUp.notes}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isPending ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          <Bell size={11} /> {isPending ? 'Pending' : 'Completed'}
        </span>
        {isPending && onMarkComplete && (
          <button
            onClick={() => onMarkComplete(screening.id)}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Mark Completed
          </button>
        )}
        {isPending && onReschedule && (
          <button
            onClick={() => onReschedule(screening.id)}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  )
}
