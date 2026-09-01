import { verifyToken, optionalAuth, signToken } from './auth.js'

export const protect = verifyToken
export { verifyToken, optionalAuth, signToken }
export default verifyToken
