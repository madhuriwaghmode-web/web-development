export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before verifying permissions.',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized to access this resource. Required: [${roles.join(', ')}]`,
      })
    }

    next()
  }
}

export function canAccessPatientData(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access patient clinical data.',
    })
  }

  const allowedRoles = ['admin', 'doctor', 'health_worker']
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized patient-data access prevented.',
    })
  }

  next()
}
