import AuditLog from '../models/AuditLog.js'

export async function getAuditLogs(req, res, next) {
  try {
    const { action, limit = 50, page = 1 } = req.query
    const filter = {}

    if (action) {
      filter.action = action
    }

    const p = parseInt(page, 10) || 1
    const l = parseInt(limit, 10) || 50

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)

    const total = await AuditLog.countDocuments(filter)

    res.json({
      success: true,
      count: logs.length,
      total,
      data: logs,
    })
  } catch (err) {
    next(err)
  }
}

export async function logEvent(req, res, next) {
  try {
    const { action, resourceType, resourceId, meta } = req.body

    if (!action) {
      return res.status(400).json({ success: false, message: 'Action is required.' })
    }

    const entry = await AuditLog.create({
      user: req.user?._id || null,
      userEmail: req.user?.email || 'anonymous',
      userName: req.user?.name || 'Anonymous User',
      userRole: req.user?.role || 'health_worker',
      action,
      resourceType: resourceType || '',
      resourceId: resourceId || '',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
      meta: meta || {},
    })

    res.status(201).json({ success: true, data: entry })
  } catch (err) {
    next(err)
  }
}
