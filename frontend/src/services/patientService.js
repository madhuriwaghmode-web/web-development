import { readJSON, writeJSON } from '../utils/storage'
import { SEED_PATIENTS } from './mock/mockData'
import { api } from './api/apiClient'

const PATIENTS_KEY = 'patients'

function loadLocalPatients() {
  const existing = readJSON(PATIENTS_KEY, null)
  if (existing && existing.length > 0) return existing
  writeJSON(PATIENTS_KEY, SEED_PATIENTS)
  return SEED_PATIENTS
}

export const patientService = {
  // Synchronous cache read for immediate render
  getPatients() {
    return [...loadLocalPatients()].sort((a, b) => (a.name > b.name ? 1 : -1))
  },

  getPatientById(id) {
    return loadLocalPatients().find((p) => p.id === id || p.patientId === id || p._id === id) || null
  },

  // Async API methods (MongoDB)
  async fetchPatients(query = '') {
    try {
      const endpoint = query ? `/patients?query=${encodeURIComponent(query)}` : '/patients'
      const response = await api.get(endpoint)
      if (response?.data) {
        writeJSON(PATIENTS_KEY, response.data)
        return response.data
      }
    } catch (err) {
      console.warn('[patientService] Fallback to local patients:', err.message)
    }
    return this.searchPatients(query)
  },

  async fetchPatientById(id) {
    try {
      const response = await api.get(`/patients/${id}`)
      if (response?.data) {
        const current = loadLocalPatients()
        const index = current.findIndex((p) => p.id === id || p.patientId === id || p._id === id)
        if (index >= 0) {
          current[index] = response.data
        } else {
          current.push(response.data)
        }
        writeJSON(PATIENTS_KEY, current)
        return response.data
      }
    } catch (err) {
      console.warn('[patientService] Fallback to local patientById:', err.message)
    }
    return this.getPatientById(id)
  },

  async addPatient(data) {
    try {
      const response = await api.post('/patients', data)
      if (response?.data) {
        const patients = loadLocalPatients()
        const updated = [response.data, ...patients]
        writeJSON(PATIENTS_KEY, updated)
        return response.data
      }
    } catch (err) {
      console.warn('[patientService] API addPatient failed, saving locally:', err.message)
    }

    // Local fallback if server unreachable
    const patients = loadLocalPatients()
    const max = patients.reduce((acc, p) => {
      const n = Number(String(p.patientId).replace(/\D/g, ''))
      return Number.isFinite(n) ? Math.max(acc, n) : acc
    }, 1046)
    const patient = {
      id: `p_${Date.now()}`,
      patientId: `PT-${max + 1}`,
      previousScreeningDate: '',
      previousResult: '',
      previousRiskScore: null,
      createdAt: new Date().toISOString(),
      ...data,
    }
    const updated = [patient, ...patients]
    writeJSON(PATIENTS_KEY, updated)
    return patient
  },

  async updatePatient(id, updates) {
    try {
      const response = await api.put(`/patients/${id}`, updates)
      if (response?.data) {
        const patients = loadLocalPatients()
        const updated = patients.map((p) => (p.id === id || p.patientId === id || p._id === id ? { ...p, ...response.data } : p))
        writeJSON(PATIENTS_KEY, updated)
        return response.data
      }
    } catch (err) {
      console.warn('[patientService] API updatePatient failed, updating locally:', err.message)
    }

    const patients = loadLocalPatients()
    const updated = patients.map((p) => (p.id === id || p.patientId === id || p._id === id ? { ...p, ...updates } : p))
    writeJSON(PATIENTS_KEY, updated)
    return updated.find((p) => p.id === id || p.patientId === id || p._id === id)
  },

  searchPatients(query) {
    const q = (query || '').trim().toLowerCase()
    if (!q) return this.getPatients()
    return this.getPatients().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        (p.village || '').toLowerCase().includes(q)
    )
  },
}
