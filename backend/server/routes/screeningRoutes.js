import express from 'express'
import {
  getAllScreenings,
  getScreeningById,
  getScreeningsForPatient,
  createScreening,
  updateFollowUp,
} from '../controllers/screeningController.js'
import { optionalAuth } from '../middleware/auth.js'
import { canAccessPatientData } from '../middleware/rbac.js'

const router = express.Router()

router.get('/', optionalAuth, canAccessPatientData, getAllScreenings)
router.get('/:id', optionalAuth, canAccessPatientData, getScreeningById)
router.get('/patient/:patientId', optionalAuth, canAccessPatientData, getScreeningsForPatient)
router.post('/', optionalAuth, canAccessPatientData, createScreening)
router.patch('/:id/followup', optionalAuth, canAccessPatientData, updateFollowUp)

export default router
