import { Clock, Ban, XOctagon } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const COPY = {
  pending: {
    icon: Clock,
    title: 'Your account is pending approval',
    body: "You're signed in, but an admin needs to review your account and assign a role before you can access DrishtiAI. You'll be notified once it's active.",
    tone: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  suspended: {
    icon: Ban,
    title: 'Your account has been suspended',
    body: 'Contact your workspace admin if you believe this is a mistake.',
    tone: 'text-red-600 bg-red-50 border-red-200',
  },
  rejected: {
    icon: XOctagon,
    title: 'Your account request was not approved',
    body: 'Contact your workspace admin for more information.',
    tone: 'text-red-600 bg-red-50 border-red-200',
  },
}

export default function AccountStatusGate({ status }) {
  const { logout, user } = useApp()
  const copy = COPY[status] || COPY.pending
  const Icon = copy.icon

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className={`max-w-sm w-full text-center rounded-xl border p-8 bg-white`}>
        <span className={`inline-grid place-items-center w-14 h-14 rounded-full mb-4 ${copy.tone}`}>
          <Icon size={26} />
        </span>
        <h1 className="text-lg font-semibold text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{copy.body}</p>
        {user?.email && <p className="mt-3 text-xs text-slate-400">Signed in as {user.email}</p>}
        <button onClick={logout} className="mt-6 text-sm font-medium text-brand-600 hover:underline">
          Logout
        </button>
      </div>
    </div>
  )
}
