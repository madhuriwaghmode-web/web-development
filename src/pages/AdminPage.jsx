import { ShieldCheck } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
        <ShieldCheck size={24} className="text-brand-600" /> Admin
      </h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        Route protection and RLS for this area are already wired (see <code className="bg-slate-100 px-1 rounded">db/policies.sql</code>
        {' '}and <code className="bg-slate-100 px-1 rounded">AdminRoute</code>). The actual user management, role assignment,
        healthcare center management, and audit log viewer land in Phase 7, per the phased build plan.
      </p>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
        User Management · Role Assignment · Healthcare Centers · Analytics · Audit Logs — coming in Phase 7
      </div>
    </div>
  )
}
