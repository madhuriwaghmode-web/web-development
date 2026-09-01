import { api } from './api/apiClient'

export const adminService = {
  async getUsers() {
    return api.get('/auth/users')
  },

  async updateUser(id, updates) {
    return api.put(`/auth/users/${id}`, updates)
  },

  async getAuditLogs(page = 1, limit = 50) {
    return api.get(`/audit?page=${page}&limit=${limit}`)
  },
}
