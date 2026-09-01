import { Link } from 'react-router-dom'
import { User, MapPin, ChevronRight } from 'lucide-react'
import RiskBadge from '../common/RiskBadge'
import { getGradeInfo } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

export default function PatientCard({ patient }) {
  const hasPrevious = patient.previousRiskScore !== null && patient.previousRiskScore !== undefined
  const risk = hasPrevious ? getGradeInfo(gradeFromScore(patient.previousRiskScore)).risk : null

  return (
    <Link
      to={`/patients/${patient.id}`}
      className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-50 text-brand-600 shrink-0">
          <User size={20} />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 truncate">{patient.name}</p>
          <p className="text-xs text-slate-500">{patient.patientId} · {patient.age}y · {patient.gender}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {patient.village}, {patient.district}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:block text-right">
          <p className="text-xs text-slate-400">Last screening</p>
          <p className="text-sm text-slate-600">{patient.previousScreeningDate ? formatDate(patient.previousScreeningDate) : 'None yet'}</p>
        </div>
        {risk ? <RiskBadge risk={risk} /> : <span className="text-xs text-slate-400">No screening</span>}
        <ChevronRight size={18} className="text-slate-300" />
      </div>
    </Link>
  )
}

function gradeFromScore(score) {
  if (score >= 78) return 4
  if (score >= 55) return 3
  if (score >= 30) return 2
  if (score >= 10) return 1
  return 0
}
