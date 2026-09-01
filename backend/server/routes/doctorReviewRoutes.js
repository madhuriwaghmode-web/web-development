import express from 'express'
import { createReview, getReviewsForScreening } from '../controllers/doctorReviewController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/', optionalAuth, createReview)
router.get('/screening/:screeningId', optionalAuth, getReviewsForScreening)

export default router
