import { readJSON } from '../../utils/storage'

const API_BASE = '/api'

function getAuthHeaders() {
  const session = readJSON('session', null)
  const token = localStorage.getItem('drishtiai:token')
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (session?.role) {
    headers['X-User-Role'] = session.role
  }
  return headers
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  }

  try {
    const res = await fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const error = new Error(data.message || `HTTP Error ${res.status}`)
      error.status = res.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    console.warn(`[API Client] Request to ${endpoint} failed:`, err.message)
    throw err
  }
}

export const api = {
  get: (url, options) => apiRequest(url, { ...options, method: 'GET' }),
  post: (url, body, options) => apiRequest(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options) => apiRequest(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body, options) => apiRequest(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url, options) => apiRequest(url, { ...options, method: 'DELETE' }),
}
