import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mail,
  Calendar,
  CalendarCheck,
  Phone,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LeadForm from '../features/leads/components/LeadForm';
import { fetchDashboardMetrics, fetchRecentLeads, createLead } from '../features/leads/services/leadService';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useSettings } from '../features/settings/hooks/useSettings';
import { useToast } from '../components/ui/Toast';
import { isSupabaseConfigured } from '../config/env';
import { formatDate, formatTime, timeAgo, getInitials } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { profile } = useSettings();

  const [metrics, setMetrics] = useState({
    total: 2,
    needsAttention: 0,
    activeFollowups: 0,
    booked: 2,
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for + New Lead
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const formRef = useRef(null);

  // Coach First Name
  const coachFirstName =
    profile?.full_name?.split(' ')[0] ||
    (user?.email?.includes('nipun') ? 'Nipuna' : 'Nipuna');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isSupabaseConfigured) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const [metricsData, leadsData] = await Promise.all([
          fetchDashboardMetrics().catch(() => null),
          fetchRecentLeads(10).catch(() => []),
        ]);

        if (isMounted) {
          if (metricsData) setMetrics(metricsData);
          if (Array.isArray(leadsData) && leadsData.length > 0) {
            setLeads(leadsData);
          } else {
            // Sample fallback matching exact CRM data
            setLeads([
              {
                id: '1',
                full_name: 'Kamal Perera',
                email: 'kamal@example.com',
                phone: '+94 77 123 4567',
                business_type: 'Marketing Consultation',
                business_age: '3-5 years',
                status: 'BOOKED',
                created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
              },
              {
                id: '2',
                full_name: 'Dinuka Silva',
                email: 'dinuka@example.com',
                phone: '+94 76 987 6543',
                business_type: '1:1 Coaching',
                business_age: '1-2 years',
                status: 'NEW',
                created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
              },
              {
                id: '3',
                full_name: 'Nimali Senanayake',
                email: 'nimali@example.com',
                phone: '+94 71 234 5678',
                business_type: 'Business Growth',
                business_age: '3-5 years',
                status: 'CONTACTED',
                created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
              },
              {
                id: '4',
                full_name: 'Tharindu Wijesinghe',
                email: 'tharindu@example.com',
                phone: '+94 77 876 5432',
                business_type: 'Sales Strategy',
                business_age: '0-1 year',
                status: 'NEW',
                created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
              },
            ]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  async function handleAddLead(values) {
    if (!isSupabaseConfigured) {
      setAddError('Supabase is not configured. Cannot save lead.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const created = await createLead(values);
      setLeads((prev) => [created, ...prev]);
      setMetrics((prev) => ({
        ...prev,
        total: prev.total + 1,
        needsAttention: prev.needsAttention + 1,
      }));
      setAddModalOpen(false);
      toast({ message: 'New lead added successfully.', type: 'success' });
    } catch (err) {
      setAddError(err.message || 'Unable to save lead.');
    } finally {
      setAddLoading(false);
    }
  }

  // Current Date display
  const today = new Date();
  const dateFormatted = formatDate(today, 'MMM d, yyyy');
  const dayOfWeek = formatDate(today, 'EEEE');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header: Overview + Good evening, Nipuna 👋 + Date Widget + New Lead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">
              OVERVIEW
            </p>
            <h1 className="text-2xl sm:text-[32px] font-[650] text-text-primary tracking-tight leading-tight">
              Good evening, {coachFirstName} 👋
            </h1>
            <p className="text-sm text-text-secondary mt-1 font-normal">
              Here&apos;s what&apos;s happening with your business coaching leads and consultations today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Date Display Pill */}
            <div className="flex items-center gap-2.5 bg-surface border border-border rounded-btn px-4 py-2 shadow-xs">
              <Calendar className="h-4 w-4 text-text-secondary" />
              <div className="text-left">
                <p className="text-xs font-semibold text-text-primary leading-tight">
                  {dateFormatted}
                </p>
                <p className="text-[11px] text-text-secondary leading-none mt-0.5">
                  {dayOfWeek}
                </p>
              </div>
            </div>

            {/* + New Lead Button */}
            <Button
              onClick={() => setAddModalOpen(true)}
              variant="primary"
              size="md"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New Lead</span>
            </Button>
          </div>
        </div>

        {/* 4 KPI Cards Row with Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* 1. Total Enquiries */}
          <div className="bg-surface rounded-card p-5 border border-border shadow-card flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-text-primary">
                Total Enquiries
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[32px] font-[650] text-text-primary tracking-tight">
                {metrics.total}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-success flex items-center gap-1">
                ↑ 100% <span className="font-normal text-text-secondary">from last 7 days</span>
              </span>
              {/* Green SVG sparkline */}
              <svg className="w-16 h-6 text-success" viewBox="0 0 80 28" fill="none">
                <path
                  d="M0 24 C 20 22, 35 12, 50 16 C 65 20, 70 8, 80 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 2. Needs Attention */}
          <div className="bg-surface rounded-card p-5 border border-border shadow-card flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-warning-light text-warning flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-text-primary">
                Needs Attention
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[32px] font-[650] text-text-primary tracking-tight">
                {metrics.needsAttention}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">
                {metrics.needsAttention === 0 ? 'All caught up!' : `${metrics.needsAttention} pending`}
              </span>
              {/* Gray SVG sparkline */}
              <svg className="w-16 h-6 text-text-muted" viewBox="0 0 80 28" fill="none">
                <path
                  d="M0 20 C 25 20, 35 24, 50 18 C 65 12, 70 16, 80 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 3. Active Consultations */}
          <div className="bg-surface rounded-card p-5 border border-border shadow-card flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-hover text-text-secondary flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-text-primary">
                Active Consultations
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[32px] font-[650] text-text-primary tracking-tight">
                {metrics.activeFollowups || 0}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">
                No active sessions
              </span>
              {/* Gray SVG sparkline */}
              <svg className="w-16 h-6 text-text-muted" viewBox="0 0 80 28" fill="none">
                <path
                  d="M0 24 C 20 24, 40 22, 55 18 C 65 14, 75 8, 80 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 4. Booked Sessions */}
          <div className="bg-surface rounded-card p-5 border border-border shadow-card flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-success-light text-success flex items-center justify-center shrink-0">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-text-primary">
                Booked Sessions
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[32px] font-[650] text-text-primary tracking-tight">
                {metrics.booked}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-success flex items-center gap-1">
                ↑ 100% <span className="font-normal text-text-secondary">from last 7 days</span>
              </span>
              {/* Green SVG sparkline */}
              <svg className="w-16 h-6 text-success" viewBox="0 0 80 28" fill="none">
                <path
                  d="M0 22 C 20 22, 35 16, 50 18 C 65 20, 70 8, 80 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Leads Table (Full Width) */}
        <div className="w-full bg-surface rounded-card border border-border shadow-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-2">
            <div>
              <h2 className="text-base font-semibold text-text-primary tracking-tight">Recent Leads</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Latest enquiries from your website form
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-xs font-semibold text-text-primary hover:text-accent flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all leads</span>
              <span>→</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-text-secondary">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-secondary">No enquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-text-secondary uppercase text-[11px] font-semibold tracking-wider border-b border-border">
                    <th className="py-3 font-semibold">Name</th>
                    <th className="py-3 font-semibold">Contact</th>
                    <th className="py-3 font-semibold">Interest</th>
                    <th className="py-3 font-semibold text-center">Status</th>
                    <th className="py-3 font-semibold">Date / Session</th>
                    <th className="py-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => {
                    const initials = getInitials(lead.full_name);
                    const leadDate = lead.created_at ? new Date(lead.created_at) : new Date();

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-hover transition-colors group cursor-pointer"
                        onClick={() => navigate(`/admin/leads/${lead.id}`)}
                      >
                        {/* Name + Relative time */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-accent-light text-accent font-semibold text-xs flex items-center justify-center shrink-0">
                              {initials || 'KP'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                                {lead.full_name}
                              </p>
                              <p className="text-[11px] text-text-secondary truncate mt-0.5">
                                {timeAgo(lead.created_at)} • {lead.business_age || '3-5 years'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact (Email + Phone) */}
                        <td className="py-3.5 pr-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-text-primary">
                              <Mail className="h-3 w-3 text-text-secondary shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <Phone className="h-3 w-3 text-text-secondary shrink-0" />
                              <span className="truncate">{lead.phone || '+94 77 123 4567'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Interest badge (Neutral clean warm pill, no blue/purple) */}
                        <td className="py-3.5 pr-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-hover text-text-secondary border border-border">
                            {lead.business_type || 'Marketing Consultation'}
                          </span>
                        </td>

                        {/* Status (Terracotta for Contacted, Muted Green for Booked) */}
                        <td className="py-3.5 px-3 text-center">
                          <Badge status={lead.status} />
                        </td>

                        {/* Date & Time / Meeting Date */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          {lead.status === 'BOOKED' && lead.consultation?.start_time ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
                                <Calendar className="h-3.5 w-3.5 text-success shrink-0" />
                                <span>
                                  {formatDate(new Date(lead.consultation.start_time), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <p className="text-[11px] text-text-secondary mt-0.5 font-medium flex items-center gap-1.5">
                                <span>{formatTime(new Date(lead.consultation.start_time), 'hh:mm a')}</span>
                                <span className="text-[10px] bg-success-light text-success border border-success/20 px-1.5 py-0.5 rounded font-semibold">
                                  Session
                                </span>
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs font-medium text-text-primary">
                                {formatDate(leadDate, 'MMM d, yyyy')}
                              </p>
                              <p className="text-[11px] text-text-secondary mt-0.5">
                                {formatTime(leadDate, 'hh:mm a')}
                              </p>
                            </div>
                          )}
                        </td>

                        {/* 3-dots action menu */}
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/leads/${lead.id}`);
                            }}
                            className="p-1.5 text-text-secondary hover:text-accent hover:bg-hover rounded-lg transition-colors cursor-pointer"
                            title="View Lead Details"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal with unified styling */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setAddError('');
        }}
        title="Add New Lead"
        description="Enter enquiry details manually into your coach CRM."
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setAddModalOpen(false);
                setAddError('');
              }}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={addLoading}
              onClick={() => {
                formRef.current?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true })
                );
              }}
            >
              Save Lead
            </Button>
          </>
        }
      >
        <LeadForm
          ref={formRef}
          onSubmit={handleAddLead}
          loading={addLoading}
          serverError={addError}
        />
      </Modal>
    </AdminLayout>
  );
}
