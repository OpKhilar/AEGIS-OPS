import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_RESOURCES,
  INITIAL_USER_STATUSES 
} from '../data/mockEmergencyData';
import { saveOfflineSOS, saveOfflineStatus } from '../utils/offlineStore';

/**
 * Fetch active incidents from Supabase (or fallback seed data)
 */
export async function fetchIncidents() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: INITIAL_INCIDENTS, isRealtime: false };
  }

  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchIncidents error, using fallback:', error.message);
      return { data: INITIAL_INCIDENTS, isRealtime: false };
    }

    if (!data || data.length === 0) {
      return { data: INITIAL_INCIDENTS, isRealtime: true };
    }

    // Map database columns to app schema
    const mapped = data.map(row => ({
      id: row.id,
      title: row.title,
      type: row.type,
      severity: row.severity || 'critical',
      location: [row.lat, row.long],
      address: row.address || 'Operational Sector',
      reportedAt: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(row.created_at).getTime(),
      status: row.status,
      casualties: row.casualties || 'Assessing on scene',
      description: row.description || '',
      assignedResponders: [],
      radius: row.radius_meters || 350
    }));

    return { data: mapped, isRealtime: true };
  } catch (err) {
    console.error('fetchIncidents caught error:', err);
    return { data: INITIAL_INCIDENTS, isRealtime: false };
  }
}

/**
 * Insert a new incident into Supabase
 */
export async function createIncident(incident) {
  if (!navigator.onLine) {
    console.log('App is offline, saving incident to IndexedDB');
    await saveOfflineSOS(incident);
    return { data: { ...incident, status: 'queued' }, error: null };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { data: incident, error: null };
  }

  try {
    const payload = {
      title: incident.title,
      type: incident.type,
      severity: incident.severity,
      lat: incident.location[0],
      long: incident.location[1],
      address: incident.address,
      description: incident.description,
      casualties: incident.casualties,
      status: incident.status || 'active',
      radius_meters: incident.radius || 350
    };

    const { data, error } = await supabase
      .from('incidents')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('createIncident error:', err);
    return { data: incident, error: err };
  }
}

/**
 * Fetch resources (shelters, medical centers, volunteer contact info)
 */
export async function fetchResources() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: INITIAL_RESOURCES, isRealtime: false };
  }

  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('type', { ascending: true });

    if (error) {
      console.warn('Supabase fetchResources error, using fallback:', error.message);
      return { data: INITIAL_RESOURCES, isRealtime: false };
    }

    if (!data || data.length === 0) {
      return { data: INITIAL_RESOURCES, isRealtime: true };
    }

    const mapped = data.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type, // 'shelter', 'medical_center', 'volunteer_hub'
      location: [row.lat, row.long],
      address: row.address,
      capacityCurrent: row.capacity_current,
      capacityMax: row.capacity_max,
      contact: row.contact_info,
      services: Array.isArray(row.services) ? row.services : (row.services ? [row.services] : []),
      status: row.status
    }));

    return { data: mapped, isRealtime: true };
  } catch (err) {
    console.error('fetchResources caught error:', err);
    return { data: INITIAL_RESOURCES, isRealtime: false };
  }
}

/**
 * Insert citizen status check-in into user_status table
 */
export async function submitUserStatus(statusReport) {
  if (!navigator.onLine) {
    console.log('App is offline, saving status to IndexedDB');
    await saveOfflineStatus(statusReport);
    return { data: { ...statusReport, status: 'queued' }, error: null };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { data: statusReport, error: null };
  }

  try {
    const payload = {
      user_id: statusReport.id,
      status_type: statusReport.status,
      location: statusReport.address,
      lat: statusReport.coordinates[0],
      long: statusReport.coordinates[1],
      status_message: statusReport.medicalNotes || 'Citizen check-in reported.',
      headcount: statusReport.headcount || 1,
      contact_phone: statusReport.phone || null
    };

    const { data, error } = await supabase
      .from('user_status')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('submitUserStatus error:', err);
    return { data: statusReport, error: err };
  }
}

/**
 * Subscribe to real-time incident inserts/updates from Supabase
 */
export function subscribeToIncidents(onNewIncident) {
  if (!isSupabaseConfigured || !supabase) return null;

  const channel = supabase
    .channel('public:incidents')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'incidents' },
      (payload) => {
        const row = payload.new;
        const mapped = {
          id: row.id,
          title: row.title,
          type: row.type,
          severity: row.severity || 'critical',
          location: [row.lat, row.long],
          address: row.address || 'Operational Sector',
          reportedAt: 'Just now',
          timestamp: Date.now(),
          status: row.status,
          casualties: row.casualties || 'Assessing on scene',
          description: row.description || '',
          assignedResponders: [],
          radius: row.radius_meters || 350
        };
        onNewIncident(mapped);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
