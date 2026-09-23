import supabase from '../../../lib/supabase';
import { isSupabaseConfigured } from '../../../config/env';

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured.');
}

export async function fetchProfile(userId, user = null) {
  requireSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (data) return data;

  if (error && error.code === 'PGRST116' && user) {
    const emailPrefix = user.email ? user.email.split('@')[0] : '';
    let derivedName = 'Nipun Dilshan';
    if (user.user_metadata?.full_name) {
      derivedName = user.user_metadata.full_name;
    } else if (emailPrefix && !emailPrefix.toLowerCase().includes('nipun')) {
      derivedName = emailPrefix
        .replace(/[0-9_.-]+/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
    }

    const defaultProfile = {
      id: userId,
      full_name: derivedName,
      email: user.email,
      title: 'Business Growth Coach & Executive Advisor',
      booking_url: 'https://cal.com/nipun-dilshan-p5amnb/business-growth-consultation',
      notification_email: true,
      notification_followup: true,
      updated_at: new Date().toISOString(),
    };

    const { data: created } = await supabase
      .from('profiles')
      .upsert(defaultProfile)
      .select()
      .single()
      .catch(() => ({ data: defaultProfile }));

    return created || defaultProfile;
  }

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertProfile(userId, updates) {
  requireSupabase();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    // Graceful fallback if database schema hasn't yet added bio or title columns
    if (err.message && (err.message.includes('bio') || err.message.includes('title'))) {
      const fallbackUpdates = { ...updates };
      delete fallbackUpdates.bio;
      delete fallbackUpdates.title;
      const { data: retryData, error: retryError } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...fallbackUpdates, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (!retryError) return retryData;
    }
    throw err;
  }
}

export async function uploadAvatar(userId, file) {
  requireSupabase();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
}

