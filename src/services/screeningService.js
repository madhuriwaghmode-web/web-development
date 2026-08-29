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

const SCREENINGS_KEY = 'screenings'

function loadScreenings() {
  const existing = readJSON(SCREENINGS_KEY, null)
  if (existing) return existing
  writeJSON(SCREENINGS_KEY, SEED_SCREENINGS)
  return SEED_SCREENINGS
}

function saveScreenings(list) {
  writeJSON(SCREENINGS_KEY, list)
}

// Team 3's orchestrator: runs the full screening pipeline in sequence,
// calling only the service interfaces (never a mock directly), then persists
// the result. This is the single place that "knows" the pipeline order —
// pages just call runScreening() and render whatever comes back.
export const screeningService = {
  getAll() {
    return [...loadScreenings()].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  getById(id) {
    return loadScreenings().find((s) => s.id === id || s.screeningId === id) || null
  },

  getForPatient(patientId) {
    return this.getAll().filter((s) => s.patientId === patientId)
  },

  async checkQuality(imageFile) {
    return imageQualityService.analyzeQuality(imageFile)
  },

  async runScreening({ patientId, eye, imageFile, imageDataUrl, quality }) {
    const classification = await aiClassificationService.classify(imageFile, eye)
    const segmentation = await segmentationService.segment(imageFile, classification.grade)
    const xai = await xaiService.explain(imageFile, classification)
    const fusion = await evidenceFusionService.fuse({ classification, segmentation, xai })

    const screenings = loadScreenings()
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

    saveScreenings([...screenings, record])

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

  updateFollowUp(screeningId, followUp) {
    const screenings = loadScreenings()
    const updated = screenings.map((s) =>
      s.id === screeningId ? { ...s, followUp: { ...s.followUp, ...followUp } } : s
    )
    saveScreenings(updated)
    return updated.find((s) => s.id === screeningId)
  },
}
