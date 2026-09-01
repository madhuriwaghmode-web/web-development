import express from 'express'
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController.js'
import { optionalAuth, verifyToken } from '../middleware/auth.js'
import { requireRole, canAccessPatientData } from '../middleware/rbac.js'

const router = express.Router()

// Allow reading & creating with optionalAuth for rapid rural screening workflows,
// but validate role-based constraints when authenticated
router.get('/', optionalAuth, canAccessPatientData, getAllPatients)
router.get('/:id', optionalAuth, canAccessPatientData, getPatientById)
router.post('/', optionalAuth, canAccessPatientData, createPatient)
router.put('/:id', optionalAuth, canAccessPatientData, updatePatient)
router.delete('/:id', verifyToken, requireRole('admin'), deletePatient)

export default router
