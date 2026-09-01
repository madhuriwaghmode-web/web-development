
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ScanEye,
  Image as ImageIcon,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  CalendarClock,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

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
  const [patients, setPatients] = useState(() => patientService.getPatients())
  const [screenings, setScreenings] = useState(() => screeningService.getAll())

  useEffect(() => {
    let mounted = true
    Promise.all([
      patientService.fetchPatients(),
      screeningService.fetchAll(),
    ]).then(([pList, sList]) => {
      if (mounted) {
        if (pList) setPatients(pList)
        if (sList) setScreenings(sList)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  const { stats, riskData } = useMemo(() => {
    const today = new Date().toDateString()

    const counts = {
      low: 0,
      moderate: 0,
      high: 0,
    }

    screenings.forEach((s) => {
      const risk = getGradeInfo(
        s.classification?.grade ?? 0
      ).risk

      counts[risk] = (counts[risk] || 0) + 1
    })

    const stats = {
      totalPatients: patients.length,

      screeningsToday: screenings.filter(
        (s) =>
          new Date(s.date).toDateString() === today
      ).length,

      imagesAnalyzed: screenings.length,

      pendingFollowups: screenings.filter(
        (s) =>
          s.followUp?.status === 'pending'
      ).length,

      ...counts,
    }

    const riskData = [
      {
        name: 'Low Risk',
        value: counts.low || 0,
        key: 'low',
      },
      {
        name: 'Moderate Risk',
        value: counts.moderate || 0,
        key: 'moderate',
      },
      {
        name: 'High Risk',
        value: counts.high || 0,
        key: 'high',
      },
    ]

    return {
      stats,
      riskData,
    }
  }, [patients, screenings])

  /* =========================
     STAT CARDS
  ========================= */

  const cards = [
    {
      label: t('dashboard.totalPatients'),
      value: stats.totalPatients,
      icon: Users,
      tone: 'default',
    },

    {
      label: t('dashboard.screeningsToday'),
      value: stats.screeningsToday,
      icon: ScanEye,
      tone: 'brand',
    },

    {
      label: t('dashboard.imagesAnalyzed'),
      value: stats.imagesAnalyzed,
      icon: ImageIcon,
      tone: 'default',
    },

    {
      label: t('dashboard.pendingFollowups'),
      value: stats.pendingFollowups,
      icon: CalendarClock,
      tone: 'default',
    },

    {
      label: t('dashboard.lowRisk'),
      value: stats.low,
      icon: ShieldCheck,
      tone: 'low',
    },

    {
      label: t('dashboard.moderateRisk'),
      value: stats.moderate,
      icon: ShieldAlert,
      tone: 'moderate',
    },

    {
      label: t('dashboard.highRisk'),
      value: stats.high,
      icon: ShieldX,
      tone: 'high',
    },
  ]

  /* =========================
     CARD CAROUSEL
  ========================= */

  const [cardStart, setCardStart] = useState(0)

  const cardsPerView = 4

  const maxStart = Math.max(
    0,
    cards.length - cardsPerView
  )

  const nextCards = () => {
    setCardStart((current) =>
      current >= maxStart
        ? 0
        : current + 1
    )
  }

  const previousCards = () => {
    setCardStart((current) =>
      current <= 0
        ? maxStart
        : current - 1
    )
  }

  const visibleCards = cards.slice(
    cardStart,
    cardStart + cardsPerView
  )

  /* =========================
     RECENT SCREENINGS
  ========================= */

  const recent = screenings.slice(0, 5)

  return (
    <div className="space-y-6">

      {/* =========================
          WELCOME
      ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t('dashboard.goodMorning')}
            {user?.name
              ? `, ${user.name}`
              : ''}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard.ready')}
          </p>

        </div>

        <Link
          to="/screening/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors w-fit"
        >
          <Plus size={18} />

          {t('dashboard.newScreening')}
        </Link>

      </div>


      {/* =========================
          STAT CARDS CAROUSEL
      ========================= */}

      <div className="relative">

        {/* LEFT ARROW */}

        <button
          type="button"
          onClick={previousCards}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10
          w-9 h-9 rounded-full
          bg-white dark:bg-slate-700
          border border-slate-200 dark:border-slate-600
          shadow-md
          flex items-center justify-center
          text-slate-600 dark:text-slate-200
          hover:bg-slate-100 dark:hover:bg-slate-600
          transition"
          aria-label="Previous cards"
        >
          <ChevronLeft size={20} />
        </button>


        {/* CARDS */}

        <div className="grid grid-cols-4 gap-4 overflow-hidden px-12">

          {visibleCards.map((card) => (

            <div
              key={card.label}
              className="min-w-0 w-full"
            >

              <StatCard
                label={card.label}
                value={card.value}
                icon={card.icon}
                tone={card.tone}
              />

            </div>

          ))}

        </div>


        {/* RIGHT ARROW */}

        <button
          type="button"
          onClick={nextCards}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10
          w-9 h-9 rounded-full
          bg-white dark:bg-slate-700
          border border-slate-200 dark:border-slate-600
          shadow-md
          flex items-center justify-center
          text-slate-600 dark:text-slate-200
          hover:bg-slate-100 dark:hover:bg-slate-600
          transition"
          aria-label="Next cards"
        >
          <ChevronRight size={20} />
        </button>

      </div>


      {/* =========================
          CHARTS
      ========================= */}

      <div className="grid lg:grid-cols-2 gap-4">

        {/* TREND */}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">

          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
            {t('dashboard.trend')}
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
            Sample weekly trend — illustrative until enough live data accumulates.
          </p>

          <ScreeningTrendChart
            data={SCREENING_TREND_SEED}
          />

        </div>


        {/* RISK DISTRIBUTION */}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">

          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
            {t('dashboard.riskDistribution')}
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
            Based on completed screenings recorded in this workspace.
          </p>

          <RiskDistributionChart
            data={riskData}
          />

        </div>

      </div>


      {/* =========================
          RECENT SCREENINGS
      ========================= */}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">

        <div className="flex items-center justify-between mb-3">

          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            {t('dashboard.recent')}
          </h2>

          <Link
            to="/reports"
            className="text-sm text-brand-600 hover:underline"
          >
            {t('common.viewAll')}
          </Link>

        </div>


        {/* NO SCREENINGS */}

        {recent.length === 0 ? (

          <EmptyState
            title="No screenings yet"
            description="Start a new screening to see results here."
          />

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">

                  <th className="py-2 pr-4 font-medium">
                    Patient
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Date
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Eye
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Result
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Confidence
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Risk
                  </th>

                </tr>

              </thead>


              <tbody>

                {recent.map((s) => {

                  const patient =
                    patients.find(
                      (p) =>
                        p.patientId ===
                        s.patientId
                    )

                  const grade =
                    getGradeInfo(
                      s.classification?.grade ??
                      0
                    )

                  return (

                    <tr
                      key={s.id}
                      className="border-b border-slate-50 dark:border-slate-700 last:border-0"
                    >

                      <td className="py-2.5 pr-4">

                        <Link
                          to={`/patients/${patient?.id}`}
                          className="text-slate-800 dark:text-slate-100 hover:text-brand-600 font-medium"
                        >
                          {patient?.name ||
                            s.patientId}
                        </Link>

                      </td>


                      <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                        {formatDate(s.date)}
                      </td>


                      <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400 capitalize">
                        {s.eye}
                      </td>


                      <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-300">
                        {grade.shortLabel}
                      </td>


                      <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">
                        {formatPercent(
                          s.classification
                            ?.confidence
                        )}
                      </td>


                      <td className="py-2.5 pr-4">

                        <RiskBadge
                          risk={grade.risk}
                        />

                      </td>

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

