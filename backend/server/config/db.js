import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

let isConnected = false
let memoryServer = null

export async function connectDB() {
  if (isConnected) {
    return mongoose.connection
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/drishtiai'

  try {
    console.log(`[MongoDB] Connecting to ${uri}...`)
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    })
    isConnected = true
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${uri}): ${err.message}`)
    console.log('[MongoDB] Starting zero-config in-memory MongoDB fallback...')

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      memoryServer = await MongoMemoryServer.create()
      const fallbackUri = memoryServer.getUri()
      const conn = await mongoose.connect(fallbackUri)
      isConnected = true
      console.log(`[MongoDB] Connected to in-memory fallback instance: ${fallbackUri}`)
      return conn
    } catch (fallbackErr) {
      console.error('[MongoDB] Failed to initialize in-memory fallback:', fallbackErr.message)
      throw err
    }
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect()
    isConnected = false
  }
  if (memoryServer) {
    await memoryServer.stop()
    memoryServer = null
  }
}
