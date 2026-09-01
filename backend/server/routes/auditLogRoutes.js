import express from 'express'
import { getAuditLogs, logEvent } from '../controllers/auditLogController.js'
import { optionalAuth, verifyToken } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'

const router = express.Router()

router.get('/', verifyToken, requireRole('admin'), getAuditLogs)
router.post('/log', optionalAuth, logEvent)

export default router
