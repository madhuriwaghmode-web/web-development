import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ScanEye, History, FileText, Pencil, ArrowLeft } from 'lucide-react'
import { patientService } from '../services/patientService'
import { screeningService } from '../services/screeningService'
import HistoryTable from '../components/history/HistoryTable'
import RiskBadge from '../components/common/RiskBadge'
import ErrorState from '../components/common/ErrorState'
import { getGradeInfo } from '../utils/constants'
import { formatDate } from '../utils/formatters'

export default function PatientProfilePage() {
  const { patientId } = useParams()
  const navigate = useNavigate()

  const [patient, setPatient] = useState(() => patientService.getPatientById(patientId))
  const [screenings, setScreenings] = useState(() => (patient ? screeningService.getForPatient(patient.patientId) : []))

  useEffect(() => {
    let mounted = true
    patientService.fetchPatientById(patientId).then((p) => {
      if (mounted && p) {
        setPatient(p)
        screeningService.fetchAll().then((all) => {
          if (mounted && all) {
            setScreenings(all.filter((s) => s.patientId === p.patientId || s.patient === p.patientId || s.patient === p._id))
          }
        })
      }
    })
    return () => {
      mounted = false
    }
  }, [patientId])

  if (!patient) {
    return (
      <ErrorState
        title="Patient not found"
        description="This patient may have been removed."
        action={<Link to="/patients" className="text-brand-600 hover:underline text-sm">Back to patients</Link>}
      />
    )
  }

  const hasPrevious = patient.previousRiskScore !== null && patient.previousRiskScore !== undefined
  const risk = hasPrevious ? getGradeInfo(gradeFromScore(patient.previousRiskScore)).risk : null

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900">{patient.name}</h1>
              {risk && <RiskBadge risk={risk} />}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {patient.patientId} · {patient.age} years · {patient.gender} · {patient.village}, {patient.district}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/screening/new?patientId=${patient.id || patient._id || patient.patientId}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
              <ScanEye size={16} /> Start New Screening
            </Link>
            <a href="#history" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <History size={16} /> View History
            </a>
            {screenings[0] && (
              <Link to={`/reports/${screenings[0].id || screenings[0]._id}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <FileText size={16} /> Generate Report
              </Link>
            )}
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Pencil size={16} /> Edit Patient
            </button>
          </div>
        </div>

        <dl className="grid sm:grid-cols-3 gap-x-6 gap-y-4 mt-6 pt-6 border-t border-slate-100 text-sm">
          <Info label="Diabetes Duration" value={patient.diabetesDuration || '—'} />
          <Info label="Blood Sugar" value={patient.bloodSugar || '—'} />
          <Info label="HbA1c" value={patient.hba1c || '—'} />
          <Info label="Last Screening Date" value={patient.previousScreeningDate ? formatDate(patient.previousScreeningDate) : 'None yet'} />
          <Info label="Previous Result" value={patient.previousResult || '—'} />
          <Info label="Previous Risk Score" value={hasPrevious ? `${patient.previousRiskScore}%` : '—'} />
        </dl>
      </div>

      <div id="history" className="bg-white border border-slate-200 rounded-xl p-6 scroll-mt-20">
        <h2 className="font-semibold text-slate-800 mb-4">Screening History</h2>
        <HistoryTable screenings={screenings} />
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-slate-800 font-medium mt-0.5">{value}</dd>
    </div>
  )
}

function gradeFromScore(score) {
  if (score >= 78) return 4
  if (score >= 55) return 3
  if (score >= 30) return 2
  if (score >= 10) return 1
  return 0
}
