import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import EmptyState from '../components/common/EmptyState'
import RiskBadge from '../components/common/RiskBadge'
import { getGradeInfo } from '../utils/constants'
import { formatDate } from '../utils/formatters'

export default function ReportsPage() {
  const patients = useMemo(() => patientService.getPatients(), [])
  const screenings = useMemo(() => screeningService.getAll(), [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FileText size={24} className="text-brand-600" /> Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1">Generate a printable AI screening report for any completed screening.</p>
      </div>

      {screenings.length === 0 ? (
        <EmptyState icon={FileText} title="No reports yet" description="Complete a screening to generate its report." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {screenings.map((s) => {
            const patient = patients.find((p) => p.patientId === s.patientId)
            const grade = getGradeInfo(s.classification?.grade ?? 0)
            return (
              <Link
                key={s.id}
                to={`/reports/${s.id}`}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">{s.screeningId}</span>
                  <RiskBadge risk={grade.risk} />
                </div>
                <p className="font-medium text-slate-900">{patient?.name || s.patientId}</p>
                <p className="text-sm text-slate-500 mt-0.5">{grade.shortLabel} · {formatDate(s.date)}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
