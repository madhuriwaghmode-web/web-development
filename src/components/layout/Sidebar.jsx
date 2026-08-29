import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, ScanEye, History, CalendarClock,
  FileText, BarChart3, Settings, Eye,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/patients', icon: Users, key: 'patients' },
  { to: '/screening/new', icon: ScanEye, key: 'newScreening' },
  { to: '/history', icon: History, key: 'history' },
  { to: '/followups', icon: CalendarClock, key: 'followups' },
  { to: '/reports', icon: FileText, key: 'reports' },
  { to: '/analytics', icon: BarChart3, key: 'analytics', permission: 'analytics:view' },
  { to: '/settings', icon: Settings, key: 'settings' },
]

export default function Sidebar({ open, onClose }) {
  const { t, can, role } = useApp()

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}
      <aside
        className={
          'fixed z-40 inset-y-0 left-0 w-64 bg-brand-900 text-brand-50 flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="flex items-center gap-2 px-5 py-5 border-b border-brand-800">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 text-white">
            <Eye size={20} aria-hidden="true" />
          </span>
          <span className="font-semibold text-lg tracking-tight">DrishtiAI</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Primary">
          {LINKS.filter((l) => !l.permission || can(l.permission) || role === 'admin').map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
                (isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-brand-100 hover:bg-brand-800 hover:text-white')
              }
            >
              <Icon size={18} aria-hidden="true" />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-brand-800 text-xs text-brand-200">
          Screening-support tool. Not a diagnostic replacement.
        </div>
      </aside>
    </>
  )
}
