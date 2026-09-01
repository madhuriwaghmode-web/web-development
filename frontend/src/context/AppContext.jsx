import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readJSON, writeJSON, removeKey } from '../utils/storage'
import { translate } from '../locales'
import { ROLES, ROLE_PERMISSIONS } from '../utils/constants'
import { offlineSyncService } from '../services/offlineSyncService'
import { authService } from '../services/authService'

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

  // Sync session with backend (/api/auth/me) on app load
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const { data } = await authService.getSession()
        if (data?.user) {
          const updatedSession = {
            id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar || '',
            role: data.user.role || ROLES.HEALTH_WORKER,
            status: data.user.status || 'active',
            loggedInAt: new Date().toISOString(),
          }
          writeJSON(SESSION_KEY, updatedSession)
          setUser(updatedSession)
        }
      } catch {
        // Retain local session if offline
      }
    }
    checkAuthSession()
  }, [])

  const login = useCallback(async (identifier, role, password = 'password123') => {
    const chosenRole = role || ROLES.HEALTH_WORKER

    const res = await authService.signInWithPassword({
      identifier,
      password,
      role: chosenRole,
    })

    if (res.error || !res.data?.user) {
      const errorMsg = res.error?.message || res.error?.data?.message || 'Invalid credentials or user not found.'
      throw new Error(errorMsg)
    }

    const fullSession = {
      id: res.data.user.id || res.data.user._id,
      name: res.data.user.name,
      email: res.data.user.email,
      avatar: res.data.user.avatar || '',
      role: res.data.user.role || chosenRole,
      status: res.data.user.status || 'active',
      loggedInAt: new Date().toISOString(),
    }
    writeJSON(SESSION_KEY, fullSession)
    setUser(fullSession)
    return fullSession
  }, [])

  const loginWithGoogle = useCallback(() => {
    authService.signInWithGoogle()
  }, [])

  const logout = useCallback(async () => {
    removeKey(SESSION_KEY)
    await authService.signOut()
    setUser(null)
  }, [])

  const setRole = useCallback((role) => {
    setUser((prev) => {
      const next = { ...(prev || { name: 'Health Worker' }), role, email: `${role}@drishtiai.health` }
      writeJSON(SESSION_KEY, next)
      authService.signInWithPassword({ email: next.email, password: 'password123', role }).catch(() => {})
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
      loginWithGoogle,
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
    [user, login, loginWithGoogle, logout, setRole, can, language, setLanguage, t, isOnline, lowBandwidthMode]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
