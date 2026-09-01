import express from 'express'
import authRoutes from './authRoutes.js'
import patientRoutes from './patientRoutes.js'
import screeningRoutes from './screeningRoutes.js'
import retinalImageRoutes from './retinalImageRoutes.js'
import doctorReviewRoutes from './doctorReviewRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import auditLogRoutes from './auditLogRoutes.js'
import analyticsRoutes from './analyticsRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/patients', patientRoutes)
router.use('/screenings', screeningRoutes)
router.use('/images', retinalImageRoutes)
router.use('/reviews', doctorReviewRoutes)
router.use('/notifications', notificationRoutes)
router.use('/audit', auditLogRoutes)
router.use('/analytics', analyticsRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DrishtiAI Backend API',
    database: 'MongoDB',
  })
})

export default router
