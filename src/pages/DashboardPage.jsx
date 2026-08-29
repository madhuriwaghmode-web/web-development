import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, ScanEye, Image as ImageIcon, ShieldCheck, ShieldAlert, ShieldX, CalendarClock, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StatCard from '../components/common/StatCard'
import ScreeningTrendChart from '../components/charts/ScreeningTrendChart'
import RiskDistributionChart from '../components/charts/RiskDistributionChart'
import EmptyState from '../components/common/EmptyState'
import RiskBadge from '../components/common/RiskBadge'
import { patientService } from '../services/patientService'
import { screeningService } from '../services/screeningService'
import { SCREENING_TREND_SEED } from '../services/mock/mockData'
import { getGradeInfo } from '../utils/constants'
import { formatDate, formatPercent } from '../utils/formatters'

export default function DashboardPage() {
  const { t, user } = useApp()

  const { patients, screenings, stats, riskData } = useMemo(() => {
    const patients = patientService.getPatients()
    const screenings = screeningService.getAll()
    const today = new Date().toDateString()

    const counts = { low: 0, moderate: 0, high: 0 }
    screenings.forEach((s) => {
      const risk = getGradeInfo(s.classification?.grade ?? 0).risk
      counts[risk] += 1
    })

    const stats = {
      totalPatients: patients.length,
      screeningsToday: screenings.filter((s) => new Date(s.date).toDateString() === today).length,
      imagesAnalyzed: screenings.length,
      pendingFollowups: screenings.filter((s) => s.followUp?.status === 'pending').length,
      ...counts,
    }

    const riskData = [
      { name: 'Low Risk', value: counts.low, key: 'low' },
      { name: 'Moderate Risk', value: counts.moderate, key: 'moderate' },
      { name: 'High Risk', value: counts.high, key: 'high' },
    ]

    return { patients, screenings, stats, riskData }
  }, [])

  const recent = screenings.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t('dashboard.goodMorning')}{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-slate-500 mt-1">{t('dashboard.ready')}</p>
        </div>
        <Link
          to="/screening/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors w-fit"
        >
          <Plus size={18} /> {t('dashboard.newScreening')}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.totalPatients')} value={stats.totalPatients} icon={Users} />
        <StatCard label={t('dashboard.screeningsToday')} value={stats.screeningsToday} icon={ScanEye} tone="brand" />
        <StatCard label={t('dashboard.imagesAnalyzed')} value={stats.imagesAnalyzed} icon={ImageIcon} />
        <StatCard label={t('dashboard.pendingFollowups')} value={stats.pendingFollowups} icon={CalendarClock} />
        <StatCard label={t('dashboard.lowRisk')} value={stats.low} icon={ShieldCheck} tone="low" />
        <StatCard label={t('dashboard.moderateRisk')} value={stats.moderate} icon={ShieldAlert} tone="moderate" />
        <StatCard label={t('dashboard.highRisk')} value={stats.high} icon={ShieldX} tone="high" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-1">{t('dashboard.trend')}</h2>
          <p className="text-xs text-slate-400 mb-2">Sample weekly trend — illustrative until enough live data accumulates.</p>
          <ScreeningTrendChart data={SCREENING_TREND_SEED} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-1">{t('dashboard.riskDistribution')}</h2>
          <p className="text-xs text-slate-400 mb-2">Based on completed screenings recorded in this workspace.</p>
          <RiskDistributionChart data={riskData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800">{t('dashboard.recent')}</h2>
          <Link to="/reports" className="text-sm text-brand-600 hover:underline">{t('common.viewAll')}</Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState title="No screenings yet" description="Start a new screening to see results here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-4 font-medium">Patient</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Eye</th>
                  <th className="py-2 pr-4 font-medium">Result</th>
                  <th className="py-2 pr-4 font-medium">Confidence</th>
                  <th className="py-2 pr-4 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => {
                  const patient = patients.find((p) => p.patientId === s.patientId)
                  const grade = getGradeInfo(s.classification?.grade ?? 0)
                  return (
                    <tr key={s.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5 pr-4">
                        <Link to={`/patients/${patient?.id}`} className="text-slate-800 hover:text-brand-600 font-medium">
                          {patient?.name || s.patientId}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-500">{formatDate(s.date)}</td>
                      <td className="py-2.5 pr-4 text-slate-500 capitalize">{s.eye}</td>
                      <td className="py-2.5 pr-4 text-slate-700">{grade.shortLabel}</td>
                      <td className="py-2.5 pr-4 text-slate-500">{formatPercent(s.classification?.confidence)}</td>
                      <td className="py-2.5 pr-4"><RiskBadge risk={grade.risk} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
