import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ROLES, ROLE_LABELS } from '../utils/constants'

export default function LoginPage() {
  const { login, loginWithGoogle, t } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(ROLES.HEALTH_WORKER)
  const [showForgot, setShowForgot] = useState(false)
  const [resetUserId, setResetUserId] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoginError(null)
    setLoading(true)
    try {
      await login(userId, role, password)
      const dest = location.state?.from?.pathname || '/dashboard'
      navigate(dest, { replace: true })
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check your credentials or click "Continue with Google".')
    } finally {
      setLoading(false)
    }
  }

  function handleForgotPassword() {
    setResetUserId(userId)
    setResetMessage('')
    setShowForgot(true)
  }

  function handleResetSubmit(e) {
    e.preventDefault()
    if (!resetUserId.trim()) {
      setResetMessage('Please enter your User ID or Email.')
      return
    }
    setResetMessage(
      'If this User ID exists, password reset instructions will be provided.'
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">

      {/* =========================
          LEFT BRAND SECTION
      ========================== */}
      <div className="hidden lg:flex flex-col bg-brand-700 text-white p-10 xl:p-14">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-12 h-12 rounded-xl bg-white/15">
            <Eye size={27} />
          </span>

          <span className="text-3xl font-extrabold tracking-tight text-white">
            DrishtiAI
          </span>
        </div>

        {/* Main Content */}
        <div className="max-w-lg mt-12">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-50">
            <ShieldCheck size={14} />
            Screening Support Platform
          </div>

          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight">
            AI-assisted diabetic retinopathy screening for rural healthcare.
          </h1>

          <p className="mt-5 text-brand-100 text-base leading-7 max-w-md">
            Register patients, capture retinal images, and get a
            screening-support result in minutes — built to keep working
            even with unreliable connectivity.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 border-t border-white/15 pt-5 max-w-lg">
          <p className="text-xs leading-5 text-brand-200">
            This application is a screening-support tool and does not
            replace examination or diagnosis by a qualified healthcare
            professional.
          </p>
        </div>
      </div>

      {/* =========================
          RIGHT LOGIN SECTION
      ========================== */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">

            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-500 text-white">
                <Eye size={25} />
              </span>

              <span className="text-3xl font-extrabold tracking-tight text-brand-600">
                DrishtiAI
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Screening Support Platform
            </p>

          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {t('login.heading')}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t('login.subheading')}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-all shadow-sm mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-slate-50 px-3 text-xs text-slate-400 font-medium absolute">
              Or sign in with email
            </span>
          </div>

          {/* Login Form */}
          {loginError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* User ID */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email or Username
              </label>

              <input
                id="userId"
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="you@example.com or your_username"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {t('login.password')}
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {t('login.role')}
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 active:scale-[0.99] transition-all shadow-sm"
            >
              {t('login.submit')}
            </button>

          </form>

          {/* Create Account */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Bottom Information */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <ShieldCheck size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Secure Screening Environment
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  Authenticated via Node.js + Express backend, MongoDB Atlas, and Google OAuth 2.0.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* =========================
          FORGOT PASSWORD MODAL
      ========================== */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Reset Password
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your User ID or Email to continue.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* Reset Form */}
            <form onSubmit={handleResetSubmit} className="mt-5">

              <label
                htmlFor="resetUserId"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                User ID / Email
              </label>

              <input
                id="resetUserId"
                type="text"
                value={resetUserId}
                onChange={(e) => {
                  setResetUserId(e.target.value)
                  setResetMessage('')
                }}
                placeholder="worker@drishtiai.health"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
              />

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
              >
                Continue
              </button>

              {resetMessage && (
                <div className="mt-4 rounded-lg bg-brand-50 border border-brand-100 px-3 py-2.5">
                  <p className="text-xs leading-5 text-brand-700">
                    {resetMessage}
                  </p>
                </div>
              )}

            </form>

          </div>
        </div>
      )}

    </div>
  )
}
