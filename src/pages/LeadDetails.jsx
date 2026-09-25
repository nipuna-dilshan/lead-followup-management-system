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
import { fetchLeadById, updateLeadStatus, updateLeadFollowUpStage } from '../features/leads/services/leadService';
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
  const [advancingStage, setAdvancingStage] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchLeadById(id);
        if (isCurrent) setData(result);
      } catch (err) {
        if (isCurrent) setError(err.message || 'Failed to load lead details.');
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    load();
    return () => { isCurrent = false; };
  }, [id]);

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

  async function handleAdvanceStage(newStage) {
    setAdvancingStage(true);
    try {
      await updateLeadFollowUpStage(id, newStage);
      const refreshed = await fetchLeadById(id);
      setData(refreshed);
      setStatusModalOpen(false);
      toast({
        message: newStage >= 3
          ? 'Final follow-up sent. Sequence completed!'
          : `Follow-up #${newStage} marked as sent. Next stage scheduled!`,
        type: 'success',
      });
    } catch (err) {
      toast({ message: err.message || 'Unable to advance follow-up stage.', type: 'error' });
    } finally {
      setAdvancingStage(false);
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left column: Client Dossier */}
        <section className="bg-surface rounded-card border border-border shadow-card p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-text-primary tracking-tight">
                Client Profile &amp; Enquiry
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Full enquiry details submitted via web form
              </p>
            </div>
            <span className="text-[11px] font-semibold text-text-secondary bg-hover border border-border rounded-md px-2.5 py-1">
              Active Record
            </span>
          </div>
          <LeadInfo lead={lead} />
        </section>

        {/* Right column: Action & Timeline Hub */}
        <div className="space-y-6">
          {/* Card 1: Primary Action (Consultation if booked, Follow-up sequence if not) */}
          {isBooked ? (
            <section className="bg-surface rounded-card border border-border shadow-card p-6 sm:p-7">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div>
                  <h2 className="text-sm font-bold text-text-primary tracking-tight">
                    Consultation Booking
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Confirmed consultation appointment with client
                  </p>
                </div>
                <Badge variant="success" label="Confirmed" />
              </div>

              {consultation ? (
                <div className="space-y-4">
                  <div className="bg-background rounded-btn p-4 border border-border">
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                      Scheduled Session
                    </p>
                    <p className="text-base font-bold text-text-primary">
                      {formatDate(consultation.start_time, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm font-medium text-text-secondary mt-0.5">
                      {formatTime(consultation.start_time, 'h:mm a')}
                      {consultation.end_time && ` – ${formatTime(consultation.end_time, 'h:mm a')}`}
                    </p>
                  </div>

                  {consultation.meeting_url && (
                    <a
                      href={consultation.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full h-[42px] px-4 text-sm font-semibold rounded-btn bg-accent hover:bg-[#A95C46] text-white transition-colors shadow-xs"
                    >
                      <span>Join Session Meeting Room</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <div className="flex items-center gap-2 text-xs text-success bg-success-light border border-success/20 rounded-btn px-3.5 py-2.5">
                    <span className="font-semibold">Notice:</span>
                    <span>Follow-up sequence paused — client booked consultation.</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-text-secondary mb-4">
                    Status is marked as Booked, but no calendar meeting record is linked yet.
                  </p>
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
          ) : (
            <section className="bg-surface rounded-card border border-border shadow-card p-6 sm:p-7">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div>
                  <h2 className="text-sm font-bold text-text-primary tracking-tight">
                    Follow-up Sequence Status
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Automated email nurture cadence
                  </p>
                </div>
                <Badge variant="success" label="Active Nurture" />
              </div>

              <FollowUpStatus
                lead={lead}
                followups={followups}
                consultation={consultation}
                onAdvanceStage={handleAdvanceStage}
                advancing={advancingStage}
              />
            </section>
          )}

          {/* Card 2: Unified Activity Feed */}
          <section className="bg-surface rounded-card border border-border shadow-card p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-text-primary tracking-tight">
                  Activity &amp; Engagement History
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Complete audit trail of touchpoints and interactions
                </p>
              </div>
              <span className="text-[11px] font-semibold text-text-muted">
                LIVE AUDIT
              </span>
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
        title="Update Lead & Follow-Up Status"
        description="Select pipeline status or advance the nurture sequence stage."
        size="md"
      >
        <div className="space-y-6">
          {/* Pipeline Status */}
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
              Pipeline Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusUpdate(s)}
                  disabled={updatingStatus || s === lead.status}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-btn border text-sm font-medium transition-base cursor-pointer
                    ${s === lead.status
                      ? 'bg-background border-border text-text-secondary cursor-default font-semibold'
                      : 'bg-surface border-border hover:border-accent hover:bg-accent-light hover:text-accent text-text-primary'
                    } disabled:opacity-50`}
                >
                  <span>{LEAD_STATUS_LABELS[s]}</span>
                  {s === lead.status && (
                    <span className="text-[10px] bg-hover px-1.5 py-0.5 rounded text-text-secondary">Current</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Sequence Stage */}
          {!isBooked && (
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5">
                Nurture Sequence Stage
              </p>
              <div className="space-y-2">
                {[
                  { stage: 0, label: 'Stage 0: Welcome Sent', desc: 'Follow-up 1 is due next' },
                  { stage: 1, label: 'Stage 1: Follow-up 1 Sent', desc: 'Follow-up 2 is due next' },
                  { stage: 2, label: 'Stage 2: Follow-up 2 Sent', desc: 'Final Follow-up is due next' },
                  { stage: 3, label: 'Stage 3: Sequence Completed', desc: 'All 3 follow-ups sent' },
                ].map(({ stage, label, desc }) => {
                  const currentStage = lead.follow_up_stage || 0;
                  const isCurrent = currentStage === stage;
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => handleAdvanceStage(stage)}
                      disabled={advancingStage || isCurrent}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn border text-left transition-base cursor-pointer
                        ${isCurrent
                          ? 'bg-background border-border text-text-secondary cursor-default'
                          : 'bg-surface border-border hover:border-accent hover:bg-accent-light hover:text-accent'
                        } disabled:opacity-50`}
                    >
                      <div>
                        <p className={`text-sm font-medium ${isCurrent ? 'text-text-secondary' : 'text-text-primary'}`}>{label}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{desc}</p>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] bg-hover px-1.5 py-0.5 rounded text-text-secondary font-semibold">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}
