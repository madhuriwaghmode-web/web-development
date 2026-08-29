import { readJSON, writeJSON } from '../utils/storage'
import { SEED_PATIENTS } from './mock/mockData'

const PATIENTS_KEY = 'patients'

function loadPatients() {
  const existing = readJSON(PATIENTS_KEY, null)
  if (existing) return existing
  writeJSON(PATIENTS_KEY, SEED_PATIENTS)
  return SEED_PATIENTS
}

function nextPatientId(patients) {
  const max = patients.reduce((acc, p) => {
    const n = Number(String(p.patientId).replace(/\D/g, ''))
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 1041)
  return `PT-${max + 1}`
}

export const patientService = {
  getPatients() {
    return [...loadPatients()].sort((a, b) => (a.name > b.name ? 1 : -1))
  },

  getPatientById(id) {
    return loadPatients().find((p) => p.id === id || p.patientId === id) || null
  },

  addPatient(data) {
    const patients = loadPatients()
    const patient = {
      id: `p_${Date.now()}`,
      patientId: nextPatientId(patients),
      previousScreeningDate: '',
      previousResult: '',
      previousRiskScore: null,
      createdAt: new Date().toISOString(),
      ...data,
    }
    const updated = [...patients, patient]
    writeJSON(PATIENTS_KEY, updated)
    return patient
  },

  updatePatient(id, updates) {
    const patients = loadPatients()
    const updated = patients.map((p) => (p.id === id ? { ...p, ...updates } : p))
    writeJSON(PATIENTS_KEY, updated)
    return updated.find((p) => p.id === id)
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
