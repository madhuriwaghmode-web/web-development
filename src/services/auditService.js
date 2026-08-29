import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Fire-and-forget audit logging. Never throws — a logging failure must not block the action
// it's describing. Only non-sensitive context goes in `meta` (ids and labels, not clinical detail).
export const auditService = {
  async logEvent(userId, action, meta = {}) {
    if (!isSupabaseConfigured || !userId) return
    try {
      await supabase.from('audit_logs').insert({ user_id: userId, action, meta })
    } catch {
      /* noop — logging must never break the user-facing action */
    }
  },
}
