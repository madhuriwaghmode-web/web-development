import { api } from './api/apiClient'

export const doctorReviewService = {
  async submitReview(reviewData) {
    return api.post('/reviews', reviewData)
  },

  async getReviewsForScreening(screeningId) {
    return api.get(`/reviews/screening/${screeningId}`)
  },
}
