import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'
import AuditLog from '../models/AuditLog.js'

export function configurePassport() {
  const clientID = process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id'
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'mock_google_client_secret'
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null
          const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : ''
          const googleId = profile.id

          if (!email) {
            return done(new Error('No email provided by Google OAuth'), null)
          }

          let user = await User.findOne({
            $or: [{ googleId }, { email }],
          })

          if (user) {
            // Update existing user with Google details if missing
            if (!user.googleId) user.googleId = googleId
            if (avatar && !user.avatar) user.avatar = avatar
            user.lastLogin = new Date()
            await user.save()

            await AuditLog.create({
              user: user._id,
              userEmail: user.email,
              userName: user.name,
              userRole: user.role,
              action: 'GOOGLE_LOGIN',
              resourceType: 'User',
              resourceId: user._id.toString(),
              ipAddress: req.ip,
            }).catch(() => {})
          } else {
            // Create new user for first-time Google OAuth sign in
            user = await User.create({
              googleId,
              name: profile.displayName || email.split('@')[0],
              email,
              avatar,
              role: 'health_worker',
              status: 'active',
              lastLogin: new Date(),
            })

            await AuditLog.create({
              user: user._id,
              userEmail: user.email,
              userName: user.name,
              userRole: user.role,
              action: 'GOOGLE_REGISTER',
              resourceType: 'User',
              resourceId: user._id.toString(),
              ipAddress: req.ip,
              meta: { role: user.role },
            }).catch(() => {})
          }

          return done(null, user)
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id || user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}
