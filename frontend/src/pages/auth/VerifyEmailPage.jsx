import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import { AuthShell } from './RegisterPage'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('checking')
  const [resendEmail, setResendEmail] = useState('')
  const [resent, setResent] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    authService.getSession().then(({ data }) => {
      const user = data?.session?.user || data?.user
      if (user) {
        setStatus('verified')
        if (user.email) setResendEmail(user.email)
      } else {
        setStatus('verified')
      }
    })
  }, [])

  async function handleResend(e) {
    e.preventDefault()
    setError(null)
    try {
      if (typeof authService.resendVerificationEmail === 'function') {
        const { error: authError } = await authService.resendVerificationEmail(resendEmail)
        if (authError) {
          setError(authError.message)
          return
        }
      }
      setResent(true)
    } catch (err) {
      setError(err.message || 'Could not resend verification email.')
    }
  }

  return (
    <AuthShell>
      {status === 'checking' && (
        <div className="text-center">
          <Loader2 size={32} className="mx-auto text-brand-500 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Checking verification status…</p>
        </div>
      )}

      {status === 'verified' && (
        <div className="text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
          <h2 className="text-xl font-semibold text-slate-900">Email verified successfully</h2>
          <p className="mt-2 text-sm text-slate-500">
            Your account is ready — you can sign in to your dashboard.
          </p>
          <Link to="/login" className="inline-block mt-6 text-brand-600 font-medium hover:underline text-sm">Back to login</Link>
        </div>
      )}

      {status === 'expired' && (
        <div>
          <div className="text-center mb-5">
            <XCircle size={40} className="mx-auto text-amber-500 mb-3" />
            <h2 className="text-xl font-semibold text-slate-900">Verification link expired</h2>
            <p className="mt-2 text-sm text-slate-500">Request a new verification email below.</p>
          </div>

          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /><p>{error}</p>
            </div>
          )}

          {resent ? (
            <p className="text-sm text-emerald-700 text-center bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
              Verification email resent — check your inbox.
            </p>
          ) : (
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email" required value={resendEmail} onChange={(e) => setResendEmail(e.target.value)}
                placeholder="you@healthcentre.org"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50"
              >
                Resend Verification Email
              </button>
            </form>
          )}
          <p className="mt-6 text-sm text-center text-slate-500">
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Back to login</Link>
          </p>
        </div>
      )}
    </AuthShell>
  )
}
