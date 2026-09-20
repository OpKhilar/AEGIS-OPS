import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Moderation queue service — the human gate of the trust pipeline.
 *
 * All functions require an authenticated moderator (row-level security
 * enforces membership in the `moderators` table server-side; the client-side
 * checks below are only fast-paths to avoid pointless network calls).
 */

/**
 * Fetch pending incident reports. Calls the `get_moderation_queue()` RPC,
 * which auto-expires stale reports (> 30 min) before returning the queue.
 * Returns [] when not signed in as a moderator (RPC raises — caught here).
 */
export async function fetchModerationQueue() {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase.rpc('get_moderation_queue');
    if (error) {
      // 42501 = insufficient_privilege: signed in but not a moderator
      console.warn('Moderation queue unavailable:', error.message);
      return [];
    }
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      severity: row.severity || 'critical',
      lat: row.lat,
      long: row.long,
      address: row.address,
      status: row.status,
      corroborationCount: row.corroboration_count || 0,
      simulatedGps: row.simulated_gps || false,
      verificationStatus: row.verification_status,
      timestamp: new Date(row.created_at).getTime()
    }));
  } catch (err) {
    console.error('fetchModerationQueue error:', err);
    return [];
  }
}

/** Promote a pending report to the live map. Moderator-only (RLS). */
export async function verifyIncident(id) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase
    .from('incidents')
    .update({
      verification_status: 'verified',
      verified_at: new Date().toISOString()
    })
    .eq('id', id);
  return { error };
}

/** Remove a pending report from the pipeline. Moderator-only (RLS). */
export async function rejectIncident(id) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase
    .from('incidents')
    .update({ verification_status: 'rejected' })
    .eq('id', id);
  return { error };
}

/** Moderator email/password sign-in. Returns the email or null. */
export async function signInModerator(email, password) {
  if (!supabase) return { email: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { email: error ? null : (data?.user?.email || null), error };
}

export async function signOutModerator() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** Current moderator email, if signed in. */
export async function getModeratorSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.email || null;
}
