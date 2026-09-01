import express from 'express'
import { getDashboardStats } from '../controllers/analyticsController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', optionalAuth, getDashboardStats)

export default router
