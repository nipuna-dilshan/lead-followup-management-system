import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import LeadInfo from '../features/leads/components/LeadInfo';
import FollowUpStatus from '../features/leads/components/FollowUpStatus';
import ActivityTimeline from '../features/leads/components/ActivityTimeline';
import EmailHistory from '../features/leads/components/EmailHistory';
import { fetchLeadById, updateLeadStatus } from '../features/leads/services/leadService';
import { useToast } from '../components/ui/Toast';
import { LEAD_STATUS, ALL_STATUSES, LEAD_STATUS_LABELS, CAL_BOOKING_URL } from '../lib/constants';
import { formatDate, formatTime, timeAgo, getInitials } from '../lib/utils';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeadById(id);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load lead details.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleStatusUpdate(newStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateLeadStatus(id, newStatus);
      setData((prev) => ({ ...prev, lead: updated }));
      setStatusModalOpen(false);
      toast({ message: 'Lead status updated.', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Unable to update status.', type: 'error' });
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Spinner size="xl" className="text-accent" />
          <p className="text-sm text-text-secondary">Loading lead details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="text-center py-24">
          <p className="text-danger mb-4">{error || 'Lead not found.'}</p>
          <Button variant="secondary" onClick={() => navigate('/admin/leads')}>
            Back to Leads
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const { lead, followups, emailEvents, consultation } = data;
  const initials = getInitials(lead.full_name);
  const isBooked = lead.status === LEAD_STATUS.BOOKED;

  return (
    <AdminLayout>
      {/* Back nav */}
      <Link
        to="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-base mb-6 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leads
      </Link>

      {/* Lead header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-accent-light flex items-center justify-center text-accent font-semibold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-[28px] font-semibold text-text-primary tracking-tight">{lead.full_name}</h1>
              <Badge status={lead.status} />
              {!isBooked && (
                <Badge variant="success" label="Follow-up Active" />
              )}
            </div>
            <p className="text-sm text-text-secondary mt-1">
              {lead.business_type || 'Business'} · Enquiry received {timeAgo(lead.created_at)}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap items-center">
          {!isBooked && (
            <a
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-[42px] px-4 text-sm font-semibold border border-border rounded-btn bg-surface text-text-primary hover:bg-hover transition-base shadow-xs"
            >
              <Calendar className="h-4 w-4 text-text-secondary" />
              Schedule via Cal.com
            </a>
          )}
          <Button variant="primary" size="md" onClick={() => setStatusModalOpen(true)}>
            Update Status
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Lead Information */}
          <section className="bg-surface rounded-card border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                📋 Lead Information
              </h2>
              <span className="text-[11px] font-medium text-text-secondary bg-hover border border-border rounded-md px-2 py-0.5">
                CONFIDENTIAL RECORD
              </span>
            </div>
            <LeadInfo lead={lead} />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Follow-up Status */}
          <section className="bg-surface rounded-card border border-border shadow-card p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-5">🔁 Follow-up Sequence Status</h2>
            <FollowUpStatus lead={lead} followups={followups} consultation={consultation} />
          </section>

          {/* Consultation Booking */}
          <section className="bg-surface rounded-card border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">📅 Consultation Booking</h2>
              {consultation && (
                <Badge variant="success" label="Confirmed" />
              )}
            </div>

            {consultation ? (
              <div className="space-y-3">
                <div className="bg-background rounded-btn p-4 border border-border">
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-2">Upcoming Consultation Booked</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {formatDate(consultation.start_time, 'EEEE, MMMM d · h:mm a')}
                    {consultation.end_time && ` – ${formatTime(consultation.end_time)}`}
                  </p>
                  {consultation.meeting_url && (
                    <p className="text-xs text-text-secondary mt-1">📹 Meeting link attached to calendar invitation</p>
                  )}
                </div>
                {consultation.meeting_url && (
                  <a
                    href={consultation.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-medium"
                  >
                    Join Session Meeting Room
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <p className="text-xs text-success bg-success-light border border-success/20 rounded-btn px-3 py-2">
                  Follow-ups paused — consultation confirmed.
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-text-secondary mb-4">No consultation booked yet.</p>
                <a
                  href={CAL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent border border-accent/30 rounded-btn px-4 py-2 hover:bg-accent-light transition-base font-medium"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule via Cal.com
                </a>
              </div>
            )}
          </section>

          {/* Email History */}
          <section className="bg-surface rounded-card border border-border shadow-card p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">✉️ Email History</h2>
            <EmailHistory emailEvents={emailEvents} lead={lead} />
          </section>

          {/* Activity Timeline */}
          <section className="bg-surface rounded-card border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-text-primary">🕐 Activity Timeline</h2>
              <span className="text-[11px] font-medium text-text-secondary">RECENT AUDIT</span>
            </div>
            <ActivityTimeline
              lead={lead}
              emailEvents={emailEvents}
              followups={followups}
              consultation={consultation}
            />
          </section>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Lead Status"
        description="Select the new status for this lead."
        size="sm"
      >
        <div className="space-y-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusUpdate(s)}
              disabled={updatingStatus || s === lead.status}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-btn border text-sm font-medium transition-base cursor-pointer
                ${s === lead.status
                  ? 'bg-background border-border text-text-secondary cursor-default'
                  : 'bg-surface border-border hover:border-accent hover:bg-accent-light hover:text-accent text-text-primary'
                } disabled:opacity-50`}
            >
              <span>{LEAD_STATUS_LABELS[s]}</span>
              {s === lead.status && (
                <span className="text-xs text-text-secondary">Current</span>
              )}
            </button>
          ))}
        </div>
      </Modal>
    </AdminLayout>
  );
}
