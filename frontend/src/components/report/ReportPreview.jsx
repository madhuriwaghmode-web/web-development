import { Eye } from 'lucide-react'
import RiskBadge from '../common/RiskBadge'
import HistoryTable from '../history/HistoryTable'
import { formatDateTime, formatPercent } from '../../utils/formatters'

export default function ReportPreview({ report }) {
  const { patient, screening, gradeInfo, history } = report

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-3xl mx-auto print:border-0 print:shadow-none print:rounded-none">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 text-white">
            <Eye size={18} />
          </span>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">DrishtiAI</p>
            <p className="text-xs text-slate-500">Diabetic Retinopathy Screening Report</p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>{report.reportId}</p>
          <p>Generated {formatDateTime(report.generatedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
        <Field label="Patient" value={patient.name} />
        <Field label="Patient ID" value={patient.patientId} />
        <Field label="Age / Gender" value={`${patient.age} / ${patient.gender}`} />
        <Field label="Screening ID" value={screening.screeningId} />
        <Field label="Screening Date" value={formatDateTime(screening.date)} />
        <Field label="Eye" value={screening.eye} capitalize />
      </div>

      {screening.imageDataUrl && (
        <div className="mb-6">
          <img src={screening.imageDataUrl} alt="Retina fundus" className="max-h-64 mx-auto rounded-lg border border-slate-200 object-contain" />
        </div>
      )}

      <SectionTitle>Image Quality</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-6">
        <Field label="Status" value={screening.quality?.status} capitalize />
        <Field label="Quality Score" value={`${screening.quality?.qualityScore}%`} />
        <Field label="Blur" value={`${screening.quality?.blurScore}%`} />
        <Field label="Field of View" value={`${screening.quality?.fieldOfViewScore}%`} />
      </div>

      <SectionTitle>AI Screening Result</SectionTitle>
      <div className="flex items-center gap-3 mb-3">
        <p className="text-lg font-semibold text-slate-900">{screening.classification.classification}</p>
        <RiskBadge risk={gradeInfo.risk} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
        <Field label="Risk Score" value={formatPercent(screening.classification.riskScore)} />
        <Field label="Confidence" value={formatPercent(screening.classification.confidence)} />
        <Field label="Recommendation" value={screening.classification.recommendation} />
      </div>

      <SectionTitle>Explainable AI</SectionTitle>
      <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2.5 mb-6">
        {screening.xai?.explanation}
      </p>

      <SectionTitle>Screening Status</SectionTitle>
      <p className="text-sm text-slate-700 mb-1">{gradeInfo.shortLabel} detected by AI screening.</p>
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-6">
        This result is intended for screening support and does not replace professional medical diagnosis.
      </p>

      {history.length > 0 && (
        <>
          <SectionTitle>Screening History</SectionTitle>
          <div className="mb-6">
            <HistoryTable screenings={history} />
          </div>
        </>
      )}

      <SectionTitle>Follow-up</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
        <Field label="Next Screening" value={screening.followUp?.date ? new Date(screening.followUp.date).toLocaleDateString('en-IN') : '—'} />
        <Field label="Status" value={screening.followUp?.status} capitalize />
        <Field label="Notes" value={screening.followUp?.notes || '—'} />
      </div>

      <SectionTitle>Doctor / Health Worker Notes</SectionTitle>
      <div className="min-h-16 rounded-lg border border-dashed border-slate-300 bg-slate-50" />
    </div>
  )
}

function SectionTitle({ children }) {
  return <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2 mt-2">{children}</h3>
}

function Field({ label, value, capitalize }) {
  return (
    <div>
      <p className="text-slate-400">{label}</p>
      <p className={`text-slate-800 font-medium mt-0.5 ${capitalize ? 'capitalize' : ''}`}>{value || '—'}</p>
    </div>
  )
}
