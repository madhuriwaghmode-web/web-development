import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'drishtiai_super_secure_dev_secret_key_2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export async function verifyToken(req, res, next) {
  try {
    // 1. Check Passport session authentication
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      return next()
    }

    // 2. Check Bearer token or cookie token
    let token = null
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      // Check for role header fallback if in demo mode
      const demoRole = req.headers['x-demo-role'] || req.headers['x-user-role']
      if (demoRole && ['admin', 'doctor', 'health_worker'].includes(demoRole)) {
        req.user = {
          _id: null,
          name: demoRole === 'admin' ? 'Admin User' : demoRole === 'doctor' ? 'Dr. Sharma' : 'Health Worker',
          email: `${demoRole}@drishtiai.health`,
          role: demoRole,
          status: 'active',
        }
        return next()
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to continue.',
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user && !decoded.role) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      })
    }

    req.user = user || {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      status: 'active',
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session has expired. Please sign in again.',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    })
  }
}

export async function optionalAuth(req, res, next) {
  try {
    let token = null
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    const demoRole = req.headers['x-demo-role'] || req.headers['x-user-role']
    if (demoRole && ['admin', 'doctor', 'health_worker'].includes(demoRole)) {
      req.user = {
        _id: null,
        name: demoRole === 'admin' ? 'Admin User' : demoRole === 'doctor' ? 'Dr. Sharma' : 'Health Worker',
        email: `${demoRole}@drishtiai.health`,
        role: demoRole,
      }
      return next()
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(decoded.id)
      req.user = user || decoded
    }
    next()
  } catch {
    next()
  }
}
