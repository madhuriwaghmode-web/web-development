import { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  LogOut,
  User,
  Moon,
  Sun,
  HelpCircle,
  X,
  Check,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { notificationService } from '../../services/notificationService'

export default function Header({ onMenuClick }) {
  const { user, logout } = useApp()

  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pending Follow-up',
      message: 'There are patients waiting for follow-up.',
    },
    {
      id: 2,
      title: 'Screening Complete',
      message: 'A new screening result is available.',
    },
    {
      id: 3,
      title: 'System Update',
      message: 'DrishtiAI dashboard is ready to use.',
    },
  ])

  useEffect(() => {
    notificationService
      .getNotifications()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setNotifications(res.data)
        }
      })
      .catch(() => {})
  }, [notificationOpen])

  /* =========================
     DARK MODE
  ========================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem('drishti-theme')

    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode

    setDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('drishti-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('drishti-theme', 'light')
    }
  }

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead().catch(() => {})
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex-1" />

        {/* Header Actions */}
        <div className="flex items-center gap-2">

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Help */}
          <div className="relative">
            <button
              onClick={() => {
                setHelpOpen((v) => !v)
                setNotificationOpen(false)
                setMenuOpen(false)
              }}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Help"
              title="Help"
            >
              <HelpCircle size={19} />
            </button>

            {helpOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg dark:bg-slate-800 dark:border-slate-700">

                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    Help & Support
                  </h3>

                  <button
                    onClick={() => setHelpOpen(false)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="p-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    <strong>Dashboard:</strong> View patient and screening
                    statistics.
                  </p>

                  <p>
                    <strong>New Screening:</strong> Start a new eye screening.
                  </p>

                  <p>
                    <strong>Patients:</strong> View and manage patient records.
                  </p>

                  <p>
                    <strong>Reports:</strong> View screening reports and
                    results.
                  </p>

                  <p>
                    If you need more help, contact your system administrator.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen((v) => !v)
                setHelpOpen(false)
                setMenuOpen(false)
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />

              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {notifications.filter((n) => !n.isRead).length || notifications.length}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">

                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    Notifications
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <Check size={13} /> Mark read
                    </button>
                    <span className="text-xs text-slate-400">
                      {notifications.length} alerts
                    </span>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id || notification._id}
                      className="px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {notification.title}
                      </p>

                      <p className="text-xs mt-1 text-slate-500 dark:text-slate-300">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setMenuOpen((v) => !v)
                setHelpOpen(false)
                setNotificationOpen(false)
              }}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-100 text-brand-700">
                <User size={16} />
              </span>

              <span className="hidden md:block text-sm text-left leading-tight">
                <span className="block font-medium text-slate-800 dark:text-slate-100">
                  {user?.name || 'Guest'}
                </span>

                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {user?.role || 'User'}
                </span>
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-sm dark:bg-slate-800 dark:border-slate-700">

                {/* User Information */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {user?.name || 'Guest'}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {user?.role || 'User'}
                  </p>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
