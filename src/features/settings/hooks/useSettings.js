import { useState, useEffect } from 'react';
import { fetchProfile, upsertProfile, uploadAvatar } from '../services/settingsService';
import { useAuth } from '../../auth/hooks/useAuth';
import { isSupabaseConfigured } from '../../../config/env';

export function useSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProfile(user.id, user)
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

  async function uploadPhoto(file) {
    if (!user) throw new Error('Not authenticated.');
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadAvatar(user.id, file);
      const updated = await upsertProfile(user.id, { avatar_url: publicUrl });
      setProfile(updated);
      return publicUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto() {
    if (!user) throw new Error('Not authenticated.');
    setUploading(true);
    setError(null);
    try {
      const updated = await upsertProfile(user.id, { avatar_url: null });
      setProfile(updated);
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return { profile, loading, saving, uploading, error, saveProfile, uploadPhoto, removePhoto };
}

