import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { authService } from '../../services/authService'
import { AuthShell } from './RegisterPage'

const REQUIREMENTS = [
  { test: (v) => v.length >= 8, label: 'At least 8 characters' },
  { test: (v) => /[A-Z]/.test(v), label: 'One uppercase letter' },
  { test: (v) => /[0-9]/.test(v), label: 'One number' },
]

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  const unmet = REQUIREMENTS.filter((r) => !r.test(password))

  async function handleSubmit(e) {
    e.preventDefault()
    if (unmet.length > 0) {
      setError('Password does not meet the requirements below.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      if (typeof authService.updatePassword === 'function') {
        const { error: authError } = await authService.updatePassword(password)
        if (authError) {
          setError(authError.message)
          return
        }
      }
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Could not reset password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      {done ? (
        <div className="text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
          <h2 className="text-xl font-semibold text-slate-900">Password updated</h2>
          <p className="mt-2 text-sm text-slate-500">Redirecting you to login…</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-slate-900">Reset Password</h2>
          <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

          {error && (
            <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /><p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">New Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</span>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </label>

            <ul className="text-xs space-y-1">
              {REQUIREMENTS.map((r) => (
                <li key={r.label} className={`flex items-center gap-1.5 ${r.test(password) ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <CheckCircle2 size={12} /> {r.label}
                </li>
              ))}
            </ul>

            <button
              type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />} Update Password
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-slate-500">
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Back to login</Link>
          </p>
        </>
      )}
    </AuthShell>
  )
}
