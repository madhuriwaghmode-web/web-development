import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, History as HistoryIcon } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import RiskBadge from '../components/common/RiskBadge'
import EmptyState from '../components/common/EmptyState'
import { getGradeInfo } from '../utils/constants'
import { formatDate, formatPercent } from '../utils/formatters'

export default function PatientHistoryPage() {
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortDir, setSortDir] = useState('desc')

  const [patients, setPatients] = useState(() => patientService.getPatients())
  const [screenings, setScreenings] = useState(() => screeningService.getAll())

  useEffect(() => {
    let mounted = true
    Promise.all([patientService.fetchPatients(), screeningService.fetchAll()]).then(
      ([pList, sList]) => {
        if (mounted) {
          if (pList) setPatients(pList)
          if (sList) setScreenings(sList)
        }
      }
    )
    return () => {
      mounted = false
    }
  }, [])

  const rows = useMemo(() => {
    let all = screenings.map((s) => ({
      ...s,
      patient: patients.find(
        (p) => p.patientId === s.patientId || p.id === s.patientId || p._id === s.patientId
      ),
      grade: getGradeInfo(s.classification?.grade ?? 0),
    }))

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      all = all.filter(
        (s) =>
          s.patient?.name?.toLowerCase().includes(q) ||
          s.patientId?.toLowerCase().includes(q) ||
          s.screeningId?.toLowerCase().includes(q)
      )
    }
    if (riskFilter !== 'all') {
      all = all.filter((s) => s.grade.risk === riskFilter)
    }
    all.sort((a, b) =>
      sortDir === 'desc'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    )
    return all
  }, [screenings, patients, query, riskFilter, sortDir])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <HistoryIcon size={24} className="text-brand-600" /> Screening History
        </h1>
        <p className="text-slate-500 text-sm mt-1">All screenings recorded across every patient in this workspace.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient, ID, screening…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm"
        >
          <option value="all">All risk levels</option>
          <option value="low">Low risk</option>
          <option value="moderate">Moderate risk</option>
          <option value="high">High risk</option>
        </select>
        <button
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-50"
        >
          Date: {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="No screenings found" description="Try clearing filters, or run a new screening." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-3 px-4 font-medium">Screening ID</th>
                <th className="py-3 px-4 font-medium">Patient</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Eye</th>
                <th className="py-3 px-4 font-medium">Result</th>
                <th className="py-3 px-4 font-medium">Confidence</th>
                <th className="py-3 px-4 font-medium">Risk</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id || s._id || s.screeningId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-xs">{s.screeningId}</td>
                  <td className="py-2.5 px-4">
                    <Link
                      to={`/patients/${s.patient?.id || s.patient?._id || s.patientId}`}
                      className="text-slate-800 font-medium hover:text-brand-600"
                    >
                      {s.patient?.name || s.patientId}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{formatDate(s.date)}</td>
                  <td className="py-2.5 px-4 text-slate-500 capitalize">{s.eye}</td>
                  <td className="py-2.5 px-4 text-slate-700">{s.grade.shortLabel}</td>
                  <td className="py-2.5 px-4 text-slate-500">{formatPercent(s.classification?.confidence)}</td>
                  <td className="py-2.5 px-4"><RiskBadge risk={s.grade.risk} /></td>
                  <td className="py-2.5 px-4 text-right space-x-3">
                    <Link to={`/screening/${s.id || s._id || s.screeningId}/result`} className="text-brand-600 hover:underline text-sm">Result</Link>
                    <Link to={`/reports/${s.id || s._id || s.screeningId}`} className="text-brand-600 hover:underline text-sm">Report</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
