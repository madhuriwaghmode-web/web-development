import { useApp } from '../../context/AppContext'
import { ROLES, ROLE_LABELS } from '../../utils/constants'

export default function RoleSwitcher() {
  const { role, setRole } = useApp()

  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-slate-600">
      <span className="sr-only">Role</span>
      <select
        value={role || ROLES.HEALTH_WORKER}
        onChange={(e) => setRole(e.target.value)}
        className="bg-slate-100 border border-slate-200 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        {Object.values(ROLES).map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
    </label>
  )
}
