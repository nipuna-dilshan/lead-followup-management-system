import { useState, useEffect, useCallback } from 'react';
import { fetchLeads } from '../services/leadService';
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants';

export function useLeads({ search = '', status = 'ALL', businessType = '' } = {}) {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeads({ page: currentPage, pageSize: DEFAULT_PAGE_SIZE, search, status, businessType });
      setLeads(result.leads);
      setTotal(result.total);
    } catch (err) {
      setError(err.message || 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [search, status, businessType]);

  useEffect(() => {
    setPage(1);
    load(1);
  }, [load]);

  function goToPage(p) {
    setPage(p);
    load(p);
  }

  function refresh() {
    load(page);
  }

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return { leads, total, totalPages, page, goToPage, loading, error, refresh };
}
