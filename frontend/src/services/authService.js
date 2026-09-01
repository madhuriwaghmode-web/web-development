import { api } from './api/apiClient'

export const authService = {
  async signUp({ fullName, email, password, phone, organization, location, role }) {
    try {
      const response = await api.post('/auth/register', {
        name: fullName,
        email,
        password,
        phone,
        organization,
        location,
        role: role || 'health_worker',
      })
      if (response?.token) {
        localStorage.setItem('drishtiai:token', response.token)
      }
      return { data: response, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  async signInWithPassword({ identifier, email, username, password, role }) {
    try {
      const loginIdentifier = identifier || email || username
      const response = await api.post('/auth/login', {
        email: loginIdentifier,
        password,
        role,
      })
      if (response?.token) {
        localStorage.setItem('drishtiai:token', response.token)
      }
      return { data: response, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  signInWithGoogle() {
    // Redirect browser to Express Google OAuth Endpoint
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${backendUrl}/api/auth/google`
  },

  async signOut() {
    try {
      await api.post('/auth/logout', {})
    } catch {
      // Ignore network failure on logout
    }
    localStorage.removeItem('drishtiai:token')
    return { error: null }
  },

  async getSession() {
    try {
      const response = await api.get('/auth/me')
      if (response?.authenticated && response?.user) {
        return { data: { session: response.user, user: response.user }, error: null }
      }
      return { data: { session: null, user: null }, error: null }
    } catch {
      return { data: { session: null, user: null }, error: null }
    }
  },

  async getProfile(_userId) {
    try {
      const response = await api.get('/auth/me')
      return { data: response?.user || null, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  async updateOwnProfile(userId, updates) {
    try {
      const response = await api.put('/auth/profile', updates)
      return { data: response?.user || null, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  },
}
