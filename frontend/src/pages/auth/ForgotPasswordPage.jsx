import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { authService } from '../../services/authService'
import { AuthShell } from './RegisterPage'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (typeof authService.requestPasswordReset === 'function') {
        const { error: authError } = await authService.requestPasswordReset(email)
        if (authError) {
          setError(authError.message)
          return
        }
      }
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send reset email. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
          <h2 className="text-xl font-semibold text-slate-900">Password reset email sent</h2>
          <p className="mt-2 text-sm text-slate-500">Check <strong>{email}</strong> for a link to reset your password.</p>
          <Link to="/login" className="inline-block mt-6 text-brand-600 font-medium hover:underline text-sm">Back to login</Link>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-slate-900">Forgot Password</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your account email and we'll send you a reset link.</p>

          {error && (
            <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /><p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Email</span>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </label>
            <button
              type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />} Send Reset Link
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
