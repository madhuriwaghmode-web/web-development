export function errorHandler(err, req, res, _next) {
  console.error('[API Error]', err)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    const errors = Object.values(err.errors).map((e) => e.message)
    message = errors.join(', ')
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `Duplicate value entered for ${field}: ${err.keyValue ? err.keyValue[field] : ''}. Must be unique.`
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Resource not found or invalid ID format: ${err.value}`
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}
