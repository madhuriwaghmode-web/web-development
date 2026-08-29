import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readJSON, writeJSON, removeKey } from '../utils/storage'
import { translate } from '../locales'
import { ROLES, ROLE_PERMISSIONS } from '../utils/constants'
import { offlineSyncService } from '../services/offlineSyncService'

const AppContext = createContext(null)

const SESSION_KEY = 'session'
const LANGUAGE_KEY = 'language'

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null))
  const [language, setLanguageState] = useState(() => readJSON(LANGUAGE_KEY, 'en'))
  const [isOnline, setIsOnline] = useState(() => offlineSyncService.isOnline())
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const login = useCallback((name, role) => {
    const session = { name: name || 'Health Worker', role: role || ROLES.HEALTH_WORKER, loggedInAt: new Date().toISOString() }
    writeJSON(SESSION_KEY, session)
    setUser(session)
  }, [])

  const logout = useCallback(() => {
    removeKey(SESSION_KEY)
    setUser(null)
  }, [])

  const setRole = useCallback((role) => {
    setUser((prev) => {
      const next = { ...(prev || { name: 'Health Worker' }), role }
      writeJSON(SESSION_KEY, next)
      return next
    })
  }, [])

  const setLanguage = useCallback((code) => {
    writeJSON(LANGUAGE_KEY, code)
    setLanguageState(code)
  }, [])

  const t = useCallback((path) => translate(language, path), [language])

  const can = useCallback(
    (permission) => {
      if (!user) return false
      return (ROLE_PERMISSIONS[user.role] || []).includes(permission)
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role || null,
      login,
      logout,
      setRole,
      can,
      language,
      setLanguage,
      t,
      isOnline,
      lowBandwidthMode,
      setLowBandwidthMode,
    }),
    [user, login, logout, setRole, can, language, setLanguage, t, isOnline, lowBandwidthMode]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
