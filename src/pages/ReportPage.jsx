import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import { reportService } from '../services/reportService'
import ReportPreview from '../components/report/ReportPreview'
import ErrorState from '../components/common/ErrorState'

export default function ReportPage() {
  const { screeningId } = useParams()

  const report = useMemo(() => {
    const screening = screeningService.getById(screeningId)
    if (!screening) return null
    const patient = patientService.getPatientById(screening.patientId) || patientService.getPatients().find((p) => p.patientId === screening.patientId)
    const history = screeningService.getForPatient(screening.patientId).filter((s) => s.id !== screening.id)
    return reportService.generateReport(screening, patient, history)
  }, [screeningId])

  if (!report) {
    return (
      <ErrorState
        title="Report not found"
        description="This screening may have been removed."
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
