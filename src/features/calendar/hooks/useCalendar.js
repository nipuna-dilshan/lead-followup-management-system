import { useState, useEffect } from 'react';
import { fetchConsultations, fetchUpcomingConsultations } from '../services/calendarService';
import { isSupabaseConfigured } from '../../../config/env';

export function useCalendar() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConsultations();
      setConsultations(data);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return { consultations, loading, error, refresh: load };
}

export function useUpcomingConsultations(limit = 5) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    fetchUpcomingConsultations(limit)
      .then((data) => setConsultations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  return { consultations, loading, error };
}
