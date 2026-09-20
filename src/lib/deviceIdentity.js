import { supabase } from './supabaseClient';

/**
 * Stable per-device identity via Supabase anonymous auth.
 *
 * Gives every browser a durable `auth.uid()` (persisted in localStorage by
 * supabase-js) with no login UX. The database trust layer uses this uid for:
 *   - rate limiting (5 reports / 10 min per device)
 *   - duplicate suppression
 *   - corroboration scoring ("2+ independent devices")
 *
 * Returns the anonymous user's id, or null when Supabase is not configured
 * or identity could not be established (reports still submit, just unstamped).
 */
export async function ensureDeviceIdentity() {
  if (!supabase) return null;

  try {
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) throw sessionErr;
    if (session?.user) return session.user.id;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      // Most common cause: "Anonymous sign-ins" disabled in the Supabase dashboard
      console.warn('Anonymous sign-in unavailable, reports will be unstamped:', error.message);
      return null;
    }
    return data?.user?.id || null;
  } catch (err) {
    console.warn('ensureDeviceIdentity failed:', err?.message || err);
    return null;
  }
}
