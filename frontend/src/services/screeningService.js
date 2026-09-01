import { readJSON, writeJSON } from '../utils/storage'
import { SEED_SCREENINGS } from './mock/mockData'
import { imageQualityService } from './imageQualityService'
import { aiClassificationService } from './aiClassificationService'
import { segmentationService } from './segmentationService'
import { xaiService } from './xaiService'
import { evidenceFusionService } from './evidenceFusionService'
import { patientService } from './patientService'
import { daysFromNow } from '../utils/formatters'
import { DEFAULT_FOLLOWUP_DAYS } from '../utils/constants'
import { api } from './api/apiClient'

const SCREENINGS_KEY = 'screenings'

function loadLocalScreenings() {
  const existing = readJSON(SCREENINGS_KEY, null)
  if (existing && existing.length > 0) return existing
  writeJSON(SCREENINGS_KEY, SEED_SCREENINGS)
  return SEED_SCREENINGS
}

function saveLocalScreenings(list) {
  writeJSON(SCREENINGS_KEY, list)
}

export const screeningService = {
  // Synchronous read for instant render
  getAll() {
    return [...loadLocalScreenings()].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  getById(id) {
    return (
      loadLocalScreenings().find(
        (s) => s.id === id || s._id === id || s.screeningId === id
      ) || null
    )
  },

  getForPatient(patientId) {
    return this.getAll().filter(
      (s) => s.patientId === patientId || s.patient === patientId
    )
  },

  async fetchAll() {
    try {
      const response = await api.get('/screenings')
      if (response?.data) {
        saveLocalScreenings(response.data)
        return response.data
      }
    } catch (err) {
      console.warn('[screeningService] Fallback to local screenings:', err.message)
    }
    return this.getAll()
  },

  async fetchById(id) {
    try {
      const response = await api.get(`/screenings/${id}`)
      if (response?.data) {
        const current = loadLocalScreenings()
        const index = current.findIndex((s) => s.id === id || s._id === id || s.screeningId === id)
        if (index >= 0) {
          current[index] = response.data
        } else {
          current.unshift(response.data)
        }
        saveLocalScreenings(current)
        return response.data
      }
    } catch (err) {
      console.warn('[screeningService] Fallback to local getById:', err.message)
    }
    return this.getById(id)
  },

  async checkQuality(imageFile) {
    return imageQualityService.analyzeQuality(imageFile)
  },

  async runScreening({ patientId, eye, imageFile, imageDataUrl, quality }) {
    const classification = await aiClassificationService.classify(imageFile, eye)
    const segmentation = await segmentationService.segment(imageFile, classification.grade)
    const xai = await xaiService.explain(imageFile, classification)
    const fusion = await evidenceFusionService.fuse({ classification, segmentation, xai })

    const payload = {
      patientId,
      eye,
      imageDataUrl: imageDataUrl || null,
      quality,
      classification,
      segmentation,
      xai,
      fusion,
      followUp: {
        date: daysFromNow(DEFAULT_FOLLOWUP_DAYS),
        status: 'pending',
        notes: '',
      },
    }

    try {
      const response = await api.post('/screenings', payload)
      if (response?.data) {
        const screenings = loadLocalScreenings()
        saveLocalScreenings([response.data, ...screenings])
        return response.data
      }
    } catch (err) {
      console.warn('[screeningService] API runScreening failed, saving locally:', err.message)
    }

    // Local fallback
    const screenings = loadLocalScreenings()
    const record = {
      id: `s_${Date.now()}`,
      screeningId: `SCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${patientId.replace(/\D/g, '')}`,
      patientId,
      eye,
      date: new Date().toISOString(),
      imageDataUrl: imageDataUrl || null,
      quality,
      classification,
      segmentation,
      xai,
      fusion,
      followUp: { date: daysFromNow(DEFAULT_FOLLOWUP_DAYS), status: 'pending', notes: '' },
      status: 'completed',
    }

    saveLocalScreenings([record, ...screenings])

    patientService.updatePatient(
      patientService.getPatientById(patientId)?.id,
      {
        previousScreeningDate: record.date,
        previousResult: classification.classification,
        previousRiskScore: classification.riskScore,
      }
    )

    return record
  },

  async updateFollowUp(screeningId, followUp) {
    try {
      const response = await api.patch(`/screenings/${screeningId}/followup`, followUp)
      if (response?.data) {
        const screenings = loadLocalScreenings()
        const updated = screenings.map((s) =>
          s.id === screeningId || s._id === screeningId || s.screeningId === screeningId
            ? { ...s, followUp: { ...s.followUp, ...response.data.followUp } }
            : s
        )
        saveLocalScreenings(updated)
        return updated.find((s) => s.id === screeningId || s._id === screeningId || s.screeningId === screeningId)
      }
    } catch (err) {
      console.warn('[screeningService] API updateFollowUp failed, updating locally:', err.message)
    }

    const screenings = loadLocalScreenings()
    const updated = screenings.map((s) =>
      s.id === screeningId || s._id === screeningId || s.screeningId === screeningId
        ? { ...s, followUp: { ...s.followUp, ...followUp } }
        : s
    )
    saveLocalScreenings(updated)
    return updated.find((s) => s.id === screeningId || s._id === screeningId || s.screeningId === screeningId)
  },
}
