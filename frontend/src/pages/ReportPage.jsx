import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import { reportService } from '../services/reportService'
import ReportPreview from '../components/report/ReportPreview'
import ErrorState from '../components/common/ErrorState'

export default function ReportPage() {
  const { screeningId } = useParams()
  const [screening, setScreening] = useState(() => screeningService.getById(screeningId))
  const [patient, setPatient] = useState(() =>
    screening ? patientService.getPatientById(screening.patientId) : null
  )
  const [history, setHistory] = useState(() =>
    screening
      ? screeningService
          .getForPatient(screening.patientId)
          .filter((s) => s.id !== screeningId && s._id !== screeningId)
      : []
  )

  useEffect(() => {
    let mounted = true
    screeningService.fetchById(screeningId).then((s) => {
      if (mounted && s) {
        setScreening(s)
        patientService.fetchPatientById(s.patientId).then((p) => {
          if (mounted && p) setPatient(p)
        })
        screeningService.fetchAll().then((all) => {
          if (mounted && all) {
            setHistory(
              all.filter(
                (other) =>
                  other.patientId === s.patientId &&
                  other.id !== s.id &&
                  other._id !== s._id &&
                  other.screeningId !== s.screeningId
              )
            )
          }
        })
      }
    })
    return () => {
      mounted = false
    }
  }, [screeningId])

  const report = useMemo(() => {
    if (!screening || !patient) return null
    return reportService.generateReport(screening, patient, history)
  }, [screening, patient, history])

  if (!report) {
    return (
      <ErrorState
        title="Report not found"
        description="This screening may have been removed or is still loading."
        action={<Link to="/reports" className="text-brand-600 hover:underline text-sm">Back to reports</Link>}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <Link to="/reports" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={15} /> Back to reports
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          <Printer size={16} /> Print Report
        </button>
      </div>

      <ReportPreview report={report} />
    </div>
  )
}
