import express from 'express'
import { uploadImage, getImageById } from '../controllers/retinalImageController.js'
import { optionalAuth } from '../middleware/auth.js'
import { canAccessPatientData } from '../middleware/rbac.js'

const router = express.Router()

router.post('/upload', optionalAuth, canAccessPatientData, uploadImage)
router.get('/:id', optionalAuth, canAccessPatientData, getImageById)

export default router
