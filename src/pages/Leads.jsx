import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import LeadTable from '../features/leads/components/LeadTable';
import LeadFilters from '../features/leads/components/LeadFilters';
import LeadForm from '../features/leads/components/LeadForm';
import { useLeads } from '../features/leads/hooks/useLeads';
import { createLead } from '../features/leads/services/leadService';
import { useToast } from '../components/ui/Toast';
import { isSupabaseConfigured } from '../config/env';

export default function Leads() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [businessType, setBusinessType] = useState('ALL');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef(null);

  // Add lead modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const formRef = useRef(null);

  // Open modal if ?add=true in URL (from sidebar button)
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setAddModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Debounce search
  function handleSearchChange(value) {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  }

  const { leads, total, totalPages, page, goToPage, loading, error, refresh } = useLeads({
    search: debouncedSearch,
    status,
    businessType,
  });

  async function handleAddLead(values) {
    if (!isSupabaseConfigured) {
      setAddError('Supabase is not configured. Cannot save lead.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      await createLead(values);
      setAddModalOpen(false);
      refresh();
      toast({ message: 'Lead added successfully.', type: 'success' });
    } catch (err) {
      setAddError(err.message || 'Unable to save this lead. Please try again.');
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Leads"
        description="Manage enquiries, follow-ups, and consultation bookings."
        actions={
          <Button onClick={() => setAddModalOpen(true)} size="sm">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-4">
        <LeadFilters
          search={search}
          onSearchChange={handleSearchChange}
          status={status}
          onStatusChange={setStatus}
          businessType={businessType}
          onBusinessTypeChange={setBusinessType}
        />
      </div>

      {/* Table */}
      <LeadTable
        leads={leads}
        loading={loading}
        error={error}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
        onRetry={refresh}
      />

      {/* Add Lead Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); setAddError(''); }}
        title="New Inquiry"
        description="Capture client context and schedule advisory intake."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setAddModalOpen(false); setAddError(''); }} disabled={addLoading}>
              Cancel
            </Button>
            <Button
              loading={addLoading}
              onClick={() => {
                // Trigger form submit via custom event
                formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              }}
            >
              Save Inquiry
            </Button>
          </>
        }
      >
        <LeadForm ref={formRef} onSubmit={handleAddLead} loading={addLoading} serverError={addError} />
      </Modal>
    </AdminLayout>
  );
}
