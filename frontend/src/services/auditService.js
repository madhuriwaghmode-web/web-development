import { api } from './api/apiClient'

// Fire-and-forget audit logging to MongoDB backend
export const auditService = {
  async logEvent(userId, action, meta = {}) {
    try {
      await api.post('/audit/log', {
        action,
        resourceId: typeof meta === 'object' ? meta.id || meta.patientId || meta.screeningId : String(meta),
        meta: typeof meta === 'object' ? meta : { info: meta },
      })
    } catch {
      /* noop — logging must never break the user-facing action */
    }
  },
}
