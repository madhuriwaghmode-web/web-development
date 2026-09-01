import express from 'express'
import passport from 'passport'
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  getAllUsers,
  updateUserRole,
} from '../controllers/authController.js'
import { verifyToken, optionalAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'

const router = express.Router()

// Google OAuth 2.0 routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
    session: true,
  }),
  (req, res) => {
    // Successful Google OAuth authentication -> Redirect to frontend dashboard
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    res.redirect(`${clientUrl}/dashboard`)
  }
)

// Auth routes
router.get('/me', verifyToken, getMe)
router.post('/logout', logout)

// Password-based auth routes
router.post('/register', register)
router.post('/login', login)

// Profile and user management
router.put('/profile', verifyToken, updateProfile)
router.get('/users', optionalAuth, requireRole('admin'), getAllUsers)
router.put('/users/:id', optionalAuth, requireRole('admin'), updateUserRole)

export default router
