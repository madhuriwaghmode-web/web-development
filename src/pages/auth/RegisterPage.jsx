import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { authService } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

const initialForm = { fullName: '', email: '', password: '', confirmPassword: '', phone: '', organization: '', location: '' }

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    if (!form.fullName.trim()) return 'Full name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const { error: authError } = await authService.signUp(form)
      if (authError) {
        setError(authError.message?.includes('already registered') ? 'An account with this email already exists.' : authError.message)
        return
      }
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <AuthShell>
        <div className="text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
          <h2 className="text-xl font-semibold text-slate-900">Check your email</h2>
          <p className="mt-2 text-sm text-slate-500">
            We sent a verification link to <strong>{form.email}</strong>. After verifying, your account will show as
            <strong> Pending Approval</strong> until an admin assigns your role — you'll be notified once it's active.
          </p>
          <Link to="/login" className="inline-block mt-6 text-brand-600 font-medium hover:underline text-sm">Back to login</Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h2 className="text-xl font-semibold text-slate-900">Create Account</h2>
      <p className="mt-1 text-sm text-slate-500">New accounts start as Pending Approval — an admin assigns your role after review.</p>

      {!isSupabaseConfigured && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2.5 text-xs">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p>Authentication isn't connected yet — registration will not work until Supabase environment variables are set.</p>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <Field label="Full Name" required>
          <input required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Email" required>
          <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" required>
            <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Confirm Password" required>
            <input type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <p className="text-xs text-slate-400 -mt-2">At least 8 characters. Mix letters and numbers for a stronger password.</p>
        <Field label="Phone Number (optional)">
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Organization / Healthcare Center">
          <input value={form.organization} onChange={(e) => update('organization', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Location">
          <input value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} />
        </Field>

        <button
          type="submit"
          disabled={submitting || !isSupabaseConfigured}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-slate-500">
        Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Log in</Link>
      </p>
    </AuthShell>
  )
}

const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400'

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  )
}

export function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 text-white">
            <Eye size={18} />
          </span>
          <span className="text-lg font-semibold text-slate-900">DrishtiAI</span>
        </div>
        {children}
      </div>
    </div>
  )
}
