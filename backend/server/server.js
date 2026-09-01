import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from 'passport'
import { connectDB } from './config/db.js'
import { configurePassport } from './config/passport.js'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { seedDatabaseIfEmpty } from './seed/seedData.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Passport config
configurePassport()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'drishtiai_super_secure_session_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Mount API Routes
app.use('/api', apiRoutes)

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'DrishtiAI API Server',
    version: '1.0.0',
    status: 'running',
    docs: '/api/health',
  })
})

// Error Handler Middleware
app.use(errorHandler)

// Start Server
async function startServer() {
  try {
    await connectDB()
    await seedDatabaseIfEmpty()

    app.listen(PORT, () => {
      console.log(`=========================================`)
      console.log(`  DrishtiAI Backend Server Running!`)
      console.log(`  Port: http://localhost:${PORT}`)
      console.log(`  Health: http://localhost:${PORT}/api/health`)
      console.log(`=========================================`)
    })
  } catch (err) {
    console.error('Failed to start DrishtiAI server:', err)
    process.exit(1)
  }
}

startServer()

export default app
