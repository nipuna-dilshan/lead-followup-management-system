import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../config/env';

let supabase = null;

if (isSupabaseConfigured) {
  supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export { supabase };
export default supabase;
