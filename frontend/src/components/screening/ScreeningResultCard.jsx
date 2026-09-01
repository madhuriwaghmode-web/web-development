import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import RiskBadge from '../common/RiskBadge'
import { DR_GRADES, getGradeInfo } from '../../utils/constants'
import { formatPercent } from '../../utils/formatters'

const RISK_COLOR = { low: '#1b8a5a', moderate: '#b8860b', high: '#c53030' }

export default function ScreeningResultCard({ classification }) {
  const gradeInfo = getGradeInfo(classification.grade)

  const chartData = DR_GRADES.map((g) => ({
    label: g.shortLabel,
    value: g.grade === classification.grade ? classification.confidence : Math.max(2, Math.round((100 - classification.confidence) / 4)),
    isPredicted: g.grade === classification.grade,
  }))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-1">AI Screening Result</p>
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <h2 className="text-2xl font-semibold text-slate-900">{classification.classification}</h2>
        <RiskBadge risk={gradeInfo.risk} size="lg" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Risk Score</p>
          <p className="text-2xl font-semibold text-slate-900 mt-0.5">{formatPercent(classification.riskScore)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Confidence</p>
          <p className="text-2xl font-semibold text-slate-900 mt-0.5">{formatPercent(classification.confidence)}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700 mb-2">Class Probabilities (illustrative)</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.isPredicted ? RISK_COLOR[gradeInfo.risk] : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
