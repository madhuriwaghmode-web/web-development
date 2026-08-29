import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const NOT_CONFIGURED = 'Authentication is not connected yet. Ask an admin to set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'

function requireClient() {
  if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED)
}

// Every method returns { data, error } (mirroring supabase-js) so callers can render the exact
// message instead of a generic failure. Role is intentionally never accepted as a parameter here —
// it is never set by the client, only ever read back from `profiles` after the session exists.
export const authService = {
  async signUp({ fullName, email, password, phone, organization, location }) {
    requireClient()
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, organization, location },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    })
  },

  async signInWithPassword({ email, password }) {
    requireClient()
    return supabase.auth.signInWithPassword({ email, password })
  },

  async signInWithGoogle() {
    requireClient()
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  },

  async signOut() {
    requireClient()
    return supabase.auth.signOut()
  },

  async resendVerificationEmail(email) {
    requireClient()
    return supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    })
  },

  async requestPasswordReset(email) {
    requireClient()
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  },

  async updatePassword(newPassword) {
    requireClient()
    return supabase.auth.updateUser({ password: newPassword })
  },

  async getSession() {
    requireClient()
    return supabase.auth.getSession()
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) return { data: { subscription: { unsubscribe() {} } } }
    return supabase.auth.onAuthStateChange(callback)
  },

  // Reads the caller's own profile (role/status come from here, never from the client).
  async getProfile(userId) {
    requireClient()
    return supabase.from('profiles').select('*').eq('id', userId).single()
  },

  async updateOwnProfile(userId, updates) {
    requireClient()
    // role/status are silently reverted server-side even if included here — see
    // protect_privileged_profile_fields() in db/schema.sql.
    return supabase.from('profiles').update(updates).eq('id', userId)
  },
}

export const AUTH_NOT_CONFIGURED_MESSAGE = NOT_CONFIGURED
