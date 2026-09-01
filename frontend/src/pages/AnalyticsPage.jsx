import { useEffect, useMemo, useState } from 'react'
import { BarChart3, ShieldAlert } from 'lucide-react'
import { screeningService } from '../services/screeningService'
import { patientService } from '../services/patientService'
import StatCard from '../components/common/StatCard'
import ScreeningTrendChart from '../components/charts/ScreeningTrendChart'
import RiskDistributionChart from '../components/charts/RiskDistributionChart'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'
import { getGradeInfo } from '../utils/constants'
import { SCREENING_TREND_SEED } from '../services/mock/mockData'

export default function AnalyticsPage() {
  const { can, role } = useApp()
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

  const { riskData, gradeCounts } = useMemo(() => {
    const counts = { low: 0, moderate: 0, high: 0 }
    const gradeCounts = [0, 0, 0, 0, 0]
    screenings.forEach((s) => {
      const info = getGradeInfo(s.classification?.grade ?? 0)
      counts[info.risk] = (counts[info.risk] || 0) + 1
      const g = s.classification?.grade ?? 0
      if (g >= 0 && g <= 4) {
        gradeCounts[g] += 1
      }
    })
    return {
      gradeCounts,
      riskData: [
        { name: 'Low Risk', value: counts.low, key: 'low' },
        { name: 'Moderate Risk', value: counts.moderate, key: 'moderate' },
        { name: 'High Risk', value: counts.high, key: 'high' },
      ],
    }
  }, [screenings])

  if (!can('analytics:view') && role !== 'admin') {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admin access required"
        description="Switch to the Admin role (top-right) to view analytics for this workspace."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <BarChart3 size={24} className="text-brand-600" /> Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">Workspace-wide screening statistics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={patients.length} />
        <StatCard label="Total Screenings" value={screenings.length} tone="brand" />
        <StatCard label="Distinct Villages" value={new Set(patients.map((p) => p.village)).size} />
        <StatCard label="Pending Follow-ups" value={screenings.filter((s) => s.followUp?.status === 'pending').length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-1">Monthly Screening Activity</h2>
          <p className="text-xs text-slate-400 mb-2">Sample trend — illustrative until enough live data accumulates.</p>
          <ScreeningTrendChart data={SCREENING_TREND_SEED} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-1">Risk Distribution</h2>
          <RiskDistributionChart data={riskData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-3">DR Grade Breakdown</h2>
        <div className="grid grid-cols-5 gap-3 text-center">
          {['No DR', 'Mild', 'Moderate', 'Severe', 'PDR'].map((label, i) => (
            <div key={label} className="rounded-lg bg-slate-50 py-3">
              <p className="text-lg font-semibold text-slate-800">{gradeCounts[i]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
