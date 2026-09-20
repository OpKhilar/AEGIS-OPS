import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './envConfig';

export { isSupabaseConfigured } from './envConfig';

export const supabase = isSupabaseConfigured 
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;
