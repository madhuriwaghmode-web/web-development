import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, UserPlus } from 'lucide-react'
import { authService } from '../../services/authService'
import { useApp } from '../../context/AppContext'
import { writeJSON } from '../../utils/storage'

// Password strength checks
const STRENGTH_CHECKS = [
  { test: (v) => v.length >= 8,     label: 'At least 8 characters' },
  { test: (v) => /[A-Z]/.test(v),   label: 'One uppercase letter' },
  { test: (v) => /[0-9]/.test(v),   label: 'One number' },
]

const ROLES = [
  { value: 'health_worker', label: 'Health Worker' },
  { value: 'doctor',        label: 'Doctor' },
]

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useApp ? useApp() : {}

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'health_worker',
    phone: '',
    organization: '',
    location: '',
  })
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError]             = useState(null)
  const [submitting, setSubmitting]   = useState(false)
  const [done, setDone]               = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    if (!form.fullName.trim())      return 'Full name is required.'
    if (!form.username.trim())      return 'Username is required.'
    if (!/^[a-zA-Z0-9_]{3,}$/.test(form.username))
      return 'Username must be at least 3 characters (letters, numbers, underscore only).'
    if (!form.email.trim())         return 'Email address is required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.'
    const unmet = STRENGTH_CHECKS.filter((c) => !c.test(form.password))
    if (unmet.length > 0)           return `Password must have: ${unmet.map((c) => c.label).join(', ')}.`
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError(null)
    setSubmitting(true)

    try {
      const { data, error: authError } = await authService.signUp({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        organization: form.organization,
        location: form.location,
      })

      if (authError) {
        const msg = authError?.data?.message || authError?.message || 'Could not create account. Please try again.'
        setError(msg.includes('already') ? 'An account with this email or username already exists.' : msg)
        return
      }

      // Auto-login: save token + session, then redirect to dashboard
      if (data?.token) {
        localStorage.setItem('drishtiai:token', data.token)
      }
      if (data?.user) {
        const session = {
          id:          data.user.id || data.user._id,
          name:        data.user.name,
          email:       data.user.email,
          avatar:      data.user.avatar || '',
          role:        data.user.role,
          status:      data.user.status || 'active',
          loggedInAt:  new Date().toISOString(),
        }
        writeJSON('session', session)
        // If AppContext exposes setUser directly use it; otherwise a page reload picks up session
        if (typeof setUser === 'function') setUser(session)
      }

      setDone(true)
      // Short delay so the user sees the success message, then go to dashboard
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      {done ? (
        /* ── Success state ── */
        <div className="text-center py-4">
          <CheckCircle2 size={44} className="mx-auto text-emerald-500 mb-3" />
          <h2 className="text-xl font-semibold text-slate-900">Account created!</h2>
          <p className="mt-2 text-sm text-slate-500">Redirecting you to your dashboard…</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={20} className="text-brand-600" />
            <h2 className="text-xl font-semibold text-slate-900">Create Account</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Create your account with a unique username, email address, and password — or{' '}
            <button
              type="button"
              onClick={() => authService.signInWithGoogle()}
              className="text-brand-600 font-medium hover:underline"
            >
              sign up with Google
            </button>{' '}
            instead.
          </p>

          {/* Error banner */}
          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <Field label="Full Name" required>
              <input
                required
                placeholder="Ramesh Kadam"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Username */}
            <Field label="Username" required>
              <input
                required
                placeholder="ramesh_kadam"
                value={form.username}
                onChange={(e) => update('username', e.target.value.toLowerCase().replace(/\s/g, '_'))}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-400">Letters, numbers, and underscores only. Min 3 characters.</p>
            </Field>

            {/* Email */}
            <Field label="Email Address" required>
              <input
                type="email"
                required
                placeholder="ramesh@healthcentre.org"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Password */}
            <Field label="Password" required>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicators */}
              {form.password.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {STRENGTH_CHECKS.map((c) => (
                    <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.test(form.password) ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 size={11} />
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" required>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showConfirm ? 'Hide' : 'Show'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword.length > 0 && (
                <p className={`mt-1 text-xs ${form.password === form.confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                  {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </Field>

            {/* Role */}
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className={inputClass}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </Field>

            {/* Optional fields */}
            <Field label="Phone Number (optional)">
              <input
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Organization / Health Centre (optional)">
              <input
                placeholder="Primary Health Centre, Pune"
                value={form.organization}
                onChange={(e) => update('organization', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Location (optional)">
              <input
                placeholder="Pune District, Maharashtra"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  )
}

/* ── Shared helpers ── */

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
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
