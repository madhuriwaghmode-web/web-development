import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ScanEye,
  History,
  CalendarClock,
  FileText,
  BarChart3,
  Settings,
  Eye,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/patients', icon: Users, key: 'patients' },
  { to: '/screening/new', icon: ScanEye, key: 'newScreening' },
  { to: '/history', icon: History, key: 'history' },
  { to: '/followups', icon: CalendarClock, key: 'followups' },
  { to: '/reports', icon: FileText, key: 'reports' },
  {
    to: '/analytics',
    icon: BarChart3,
    key: 'analytics',
    permission: 'analytics:view',
  },
  { to: '/settings', icon: Settings, key: 'settings' },
]

export default function Sidebar({ open, onClose }) {
  const { t, can, role } = useApp()

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={
          'fixed z-40 inset-y-0 left-0 w-64 bg-brand-900 text-brand-50 flex flex-col transition-transform lg:translate-x-0 ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-brand-800">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 text-white">
            <Eye size={20} aria-hidden="true" />
          </span>

          <span className="font-semibold text-lg tracking-tight">
            DrishtiAI
          </span>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-3 space-y-1"
          aria-label="Primary"
        >
          {LINKS
            .filter(
              (l) =>
                !l.permission ||
                can(l.permission) ||
                role === 'admin'
            )
            .map(({ to, icon: Icon, key }) => (
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

          {/* Screening Support */}
          <div className="mt-5 pt-4 border-t border-brand-800">
            <div className="flex items-start gap-3 px-2">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-800 text-brand-200">
                <Eye size={14} aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-100">
                  Screening Support
                </p>

                <p className="mt-1 text-[11px] leading-4 text-brand-300">
                  This tool supports screening and
                  <br />
                  does not replace professional diagnosis.
                </p>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}