import { api } from './api/apiClient'

export const analyticsService = {
  async getDashboardStats() {
    return api.get('/analytics/stats')
  },
}
