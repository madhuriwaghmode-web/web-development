import { Link } from 'react-router-dom'
import { FileText, Eye } from 'lucide-react'
import RiskBadge from '../common/RiskBadge'
import EmptyState from '../common/EmptyState'
import { getGradeInfo } from '../../utils/constants'
import { formatDate, formatPercent } from '../../utils/formatters'

export default function HistoryTable({ screenings }) {
  if (!screenings || screenings.length === 0) {
    return <EmptyState icon={FileText} title="No screening history" description="Screenings for this patient will appear here." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-100">
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Eye</th>
            <th className="py-2 pr-4 font-medium">Result</th>
            <th className="py-2 pr-4 font-medium">Risk</th>
            <th className="py-2 pr-4 font-medium">Confidence</th>
            <th className="py-2 pr-4 font-medium">Follow-up</th>
            <th className="py-2 pr-4 font-medium text-right">Report</th>
          </tr>
        </thead>
        <tbody>
          {screenings.map((s) => {
            const grade = getGradeInfo(s.classification?.grade ?? 0)
            return (
              <tr key={s.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 pr-4 text-slate-700">{formatDate(s.date)}</td>
                <td className="py-2.5 pr-4 text-slate-500 capitalize flex items-center gap-1"><Eye size={13} />{s.eye}</td>
                <td className="py-2.5 pr-4 text-slate-700">{grade.shortLabel}</td>
                <td className="py-2.5 pr-4"><RiskBadge risk={grade.risk} /></td>
                <td className="py-2.5 pr-4 text-slate-500">{formatPercent(s.classification?.confidence)}</td>
                <td className="py-2.5 pr-4 text-slate-500 capitalize">{s.followUp?.status || '—'}</td>
                <td className="py-2.5 pr-4 text-right">
                  <Link to={`/reports/${s.id}`} className="text-brand-600 hover:underline text-sm">View</Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
