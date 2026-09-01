import { readJSON, writeJSON } from '../utils/storage'
import { patientService } from './patientService'
import { screeningService } from './screeningService'

const QUEUE_KEY = 'offline-queue'

export const offlineSyncService = {
  isOnline() {
    return typeof navigator === 'undefined' ? true : navigator.onLine
  },

  getQueue() {
    return readJSON(QUEUE_KEY, [])
  },

  queueScreening(entry) {
    const queue = this.getQueue()
    const item = { id: `q_${Date.now()}`, queuedAt: new Date().toISOString(), ...entry }
    writeJSON(QUEUE_KEY, [...queue, item])
    return item
  },

  removeFromQueue(id) {
    const queue = this.getQueue().filter((item) => item.id !== id)
    writeJSON(QUEUE_KEY, queue)
    return queue
  },

  async syncQueue(onEach) {
    const queue = this.getQueue()
    for (const item of queue) {
      try {
        if (item.type === 'patient' && item.patientData) {
          await patientService.addPatient(item.patientData)
        } else if (item.type === 'screening' && item.patientId) {
          await screeningService.runScreening({
            patientId: item.patientId,
            eye: item.eye || 'right',
            imageDataUrl: item.imageDataUrl,
            quality: item.quality,
          })
        }
      } catch (err) {
        console.warn(`[offlineSync] Item ${item.id} sync attempt error:`, err.message)
      }
      if (onEach) onEach(item)
      this.removeFromQueue(item.id)
    }
    return true
  },
}
