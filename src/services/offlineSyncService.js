import { readJSON, writeJSON } from '../utils/storage'

const QUEUE_KEY = 'offline-queue'

// Team 3 / P5's offline architecture. This does NOT run AI offline — it only
// lets a health worker keep working (save patient / save image / queue a
// screening) without connectivity, then sync once the connection returns.
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

  // Simulated sync: in the real integration this would POST each queued item
  // to the backend. For now it just marks items as synced and clears them.
  async syncQueue(onEach) {
    const queue = this.getQueue()
    for (const item of queue) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (onEach) onEach(item)
      this.removeFromQueue(item.id)
    }
    return true
  },
}
