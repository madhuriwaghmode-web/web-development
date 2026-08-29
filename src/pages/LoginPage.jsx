import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ROLES, ROLE_LABELS } from '../utils/constants'

export default function LoginPage() {
  const { login, t } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(ROLES.HEALTH_WORKER)

  function handleSubmit(e) {
    e.preventDefault()
    login(userId || 'Health Worker', role)
    const dest = location.state?.from?.pathname || '/dashboard'
    navigate(dest, { replace: true })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between bg-brand-700 text-white p-10">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-10 h-10 rounded-lg bg-white/15">
            <Eye size={22} />
          </span>
          <span className="text-xl font-semibold">DrishtiAI</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight max-w-md">
            AI-assisted diabetic retinopathy screening for rural healthcare.
          </h1>
          <p className="mt-4 text-brand-100 max-w-md">
            Register patients, capture retinal images, and get a screening-support result in minutes —
            built to keep working even with unreliable connectivity.
          </p>
        </div>
        <p className="text-xs text-brand-200 max-w-md">
          This application is a screening-support tool and does not replace examination or diagnosis
          by a qualified healthcare professional.
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 text-white">
              <Eye size={18} />
            </span>
            <span className="text-lg font-semibold text-slate-900">DrishtiAI</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-900">{t('login.heading')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('login.subheading')}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-1">
                {t('login.userId')}
              </label>
              <input
                id="userId"
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="worker@drishtiai.health"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                {t('login.password')}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                {t('login.role')}
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              {t('login.submit')}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-400">
            Authentication is mocked for this hackathon build — any credentials will sign you in.
          </p>
        </div>
      </div>
    </div>
  )
}
