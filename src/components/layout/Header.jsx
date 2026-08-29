import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, Bell, LogOut, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ROLE_LABELS } from '../../utils/constants'
import OfflineIndicator from './OfflineIndicator'
import LanguageSelector from './LanguageSelector'
import RoleSwitcher from './RoleSwitcher'

export default function Header({ onMenuClick }) {
  const { user, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search patients…"
              aria-label="Search patients"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>

        <div className="flex-1 sm:flex-none" />

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <RoleSwitcher />
          <OfflineIndicator />
          <button className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-100 text-brand-700">
                <User size={16} />
              </span>
              <span className="hidden md:block text-sm text-left leading-tight">
                <span className="block font-medium text-slate-800">{user?.name || 'Guest'}</span>
                <span className="block text-xs text-slate-500">{ROLE_LABELS[user?.role] || ''}</span>
              </span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-sm"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link to="/settings" className="block px-4 py-2 hover:bg-slate-50 text-slate-700">Settings</Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-slate-50 text-red-600"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
