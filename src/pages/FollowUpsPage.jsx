import { useMemo, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import { useToast } from '../context/ToastContext'
import FollowUpCard from '../components/followup/FollowUpCard'
import EmptyState from '../components/common/EmptyState'
import { DEFAULT_FOLLOWUP_DAYS } from '../utils/constants'
import { daysFromNow } from '../utils/formatters'

export default function FollowUpsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const toast = useToast()

  const { pending, completed, patients } = useMemo(() => {
    const all = screeningService.getAll()
    const patients = patientService.getPatients()
    return {
      pending: all.filter((s) => s.followUp?.status !== 'completed'),
      completed: all.filter((s) => s.followUp?.status === 'completed'),
      patients,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  function findPatient(patientId) {
    return patients.find((p) => p.patientId === patientId)
  }

  function handleMarkComplete(screeningId) {
    screeningService.updateFollowUp(screeningId, { status: 'completed' })
    toast.push('Follow-up marked completed.', 'success')
    setRefreshKey((k) => k + 1)
  }

  function handleReschedule(screeningId) {
    screeningService.updateFollowUp(screeningId, { date: daysFromNow(DEFAULT_FOLLOWUP_DAYS) })
    toast.push(`Follow-up rescheduled ${DEFAULT_FOLLOWUP_DAYS} days out.`, 'success')
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <CalendarClock size={24} className="text-brand-600" /> Follow-ups
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Follow-up intervals default to {DEFAULT_FOLLOWUP_DAYS} days and can be adjusted by a doctor or health worker per patient.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Pending ({pending.length})</h2>
        {pending.length === 0 ? (
          <EmptyState title="No pending follow-ups" description="All caught up." />
        ) : (
          <div className="space-y-2.5">
            {pending.map((s) => (
              <FollowUpCard
                key={s.id}
                screening={s}
                patient={findPatient(s.patientId)}
                onMarkComplete={handleMarkComplete}
                onReschedule={handleReschedule}
              />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Completed ({completed.length})</h2>
          <div className="space-y-2.5">
            {completed.map((s) => (
              <FollowUpCard key={s.id} screening={s} patient={findPatient(s.patientId)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
