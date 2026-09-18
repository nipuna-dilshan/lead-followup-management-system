import { useState, useEffect } from 'react';
import { fetchProfile, upsertProfile } from '../services/settingsService';
import { useAuth } from '../../auth/hooks/useAuth';
import { isSupabaseConfigured } from '../../../config/env';

export function useSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProfile(user.id)
      .then((data) => setProfile(data || {}))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  async function saveProfile(updates) {
    if (!user) throw new Error('Not authenticated.');
    setSaving(true);
    setError(null);
    try {
      const updated = await upsertProfile(user.id, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return { profile, loading, saving, error, saveProfile };
}
