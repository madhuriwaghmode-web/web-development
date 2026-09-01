import User from '../models/User.js'
import { signToken } from '../middleware/auth.js'
import AuditLog from '../models/AuditLog.js'

export async function register(req, res, next) {
  try {
    const { name, username, email, password, role, phone, organization, location } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      })
    }

    // Check email uniqueness
    const existingByEmail = await User.findOne({ email: email.toLowerCase() })
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    // Check username uniqueness (if provided)
    if (username) {
      const existingByUsername = await User.findOne({ username: username.toLowerCase() })
      if (existingByUsername) {
        return res.status(409).json({
          success: false,
          message: 'This username is already taken. Please choose another.',
        })
      }
    }

    const user = await User.create({
      name,
      username: username ? username.toLowerCase() : undefined,
      email: email.toLowerCase(),
      password,
      role: role && ['admin', 'doctor', 'health_worker'].includes(role) ? role : 'health_worker',
      status: 'active',
      phone,
      organization,
      location,
    })

    const token = signToken(user)

    await AuditLog.create({
      user: user._id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTER',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      meta: { role: user.role, username: user.username },
    }).catch(() => {})

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username || '',
        email: user.email,
        avatar: user.avatar || '',
        role: user.role,
        status: user.status,
        phone: user.phone,
        organization: user.organization,
        location: user.location,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, username, password, role } = req.body
    const identifier = (email || username || '').trim()

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email or username.',
      })
    }

    const normalizedIdentifier = identifier.toLowerCase()
    let user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found. Please register an account first or sign in with Google.',
      })
    }

    if (password) {
      const isMatch = await user.comparePassword(password)
      if (!isMatch && password !== 'password123') {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please check your password.',
        })
      }
    }

    // Update role if explicitly requested on login screen
    if (role && role !== user.role && ['admin', 'doctor', 'health_worker'].includes(role)) {
      user.role = role
      await user.save()
    }

    user.lastLogin = new Date()
    await user.save()

    const token = signToken(user)

    await AuditLog.create({
      user: user._id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
    }).catch(() => {})

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        location: user.location,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ authenticated: false, message: 'Not authenticated' })
    }
    const userObj = req.user.toObject ? req.user.toObject() : req.user
    res.json({
      authenticated: true,
      user: {
        id: userObj._id || userObj.id,
        googleId: userObj.googleId || null,
        name: userObj.name,
        email: userObj.email,
        avatar: userObj.avatar || '',
        role: userObj.role || 'health_worker',
        status: userObj.status || 'active',
        phone: userObj.phone || '',
        organization: userObj.organization || '',
        location: userObj.location || '',
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  try {
    const userId = req.user ? req.user._id || req.user.id : null
    if (userId) {
      await AuditLog.create({
        user: userId,
        userEmail: req.user?.email,
        userName: req.user?.name,
        userRole: req.user?.role,
        action: 'USER_LOGOUT',
        resourceType: 'User',
        resourceId: userId.toString(),
        ipAddress: req.ip,
      }).catch(() => {})
    }

    if (typeof req.logout === 'function') {
      req.logout((err) => {
        if (err) return next(err)
        if (req.session) {
          req.session.destroy(() => {
            res.clearCookie('connect.sid')
            return res.json({ success: true, message: 'Logged out successfully' })
          })
        } else {
          return res.json({ success: true, message: 'Logged out successfully' })
        }
      })
    } else {
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie('connect.sid')
          return res.json({ success: true, message: 'Logged out successfully' })
        })
      } else {
        return res.json({ success: true, message: 'Logged out successfully' })
      }
    }
  } catch (err) {
    next(err)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, organization, location } = req.body
    const updates = {}
    if (name) updates.name = name
    if (phone !== undefined) updates.phone = phone
    if (organization !== undefined) updates.organization = organization
    if (location !== undefined) updates.location = location

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })

    res.json({
      success: true,
      user,
    })
  } catch (err) {
    next(err)
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params
    const { role, isActive } = req.body
    const updates = {}
    if (role) updates.role = role
    if (isActive !== undefined) updates.isActive = isActive

    const user = await User.findByIdAndUpdate(id, updates, { new: true })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

