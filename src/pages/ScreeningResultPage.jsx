import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import ScreeningResultCard from '../components/screening/ScreeningResultCard'
import RecommendationCard from '../components/screening/RecommendationCard'
import XAIPlaceholderCard from '../components/screening/XAIPlaceholderCard'
import SegmentationPlaceholderCard from '../components/screening/SegmentationPlaceholderCard'
import ErrorState from '../components/common/ErrorState'
import { getGradeInfo } from '../utils/constants'
import { formatDateTime } from '../utils/formatters'

export default function ScreeningResultPage() {
  const { screeningId } = useParams()
  const screening = useMemo(() => screeningService.getById(screeningId), [screeningId])
  const patient = useMemo(
    () => (screening ? patientService.getPatientById(screening.patientId) || patientService.getPatients().find((p) => p.patientId === screening.patientId) : null),
    [screening]
  )

  if (!screening) {
    return (
      <ErrorState
        title="Screening not found"
        description="This screening result may have been removed."
        action={<Link to="/patients" className="text-brand-600 hover:underline text-sm">Back to patients</Link>}
      />
    )
  }

  const gradeInfo = getGradeInfo(screening.classification.grade)
  const statusText = `${gradeInfo.shortLabel} detected by AI screening`

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link to={patient ? `/patients/${patient.id}` : '/patients'} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={15} /> Back to patient
        </Link>
        <Link
          to={`/reports/${screening.id}`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          <FileText size={16} /> View Report
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <Meta label="Patient" value={patient?.name || screening.patientId} />
        <Meta label="Patient ID" value={screening.patientId} />
        <Meta label="Screening Date" value={formatDateTime(screening.date)} />
        <Meta label="Eye" value={screening.eye} capitalize />
      </div>

      {screening.imageDataUrl && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <img src={screening.imageDataUrl} alt="Uploaded retina fundus" className="max-h-72 mx-auto rounded-lg object-contain" />
        </div>
      )}

      <ScreeningResultCard classification={screening.classification} />
      <RecommendationCard recommendation={screening.classification.recommendation} statusText={statusText} />

      <div className="grid lg:grid-cols-2 gap-6">
        <SegmentationPlaceholderCard segmentation={screening.segmentation} />
        <XAIPlaceholderCard xai={screening.xai} />
      </div>
    </div>
  )
}

function Meta({ label, value, capitalize }) {
  return (
    <div>
      <p className="text-slate-400 text-xs">{label}</p>
      <p className={`text-slate-800 font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  )
}
