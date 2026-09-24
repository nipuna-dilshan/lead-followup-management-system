import { Copy, ExternalLink, MessageCircle, Clock, Target } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

export default function LeadInfo({ lead }) {
  const toast = useToast();

  function copyToClipboard(text) {
    navigator.clipboard?.writeText(text);
    toast({ message: 'Copied to clipboard', type: 'success' });
  }

  return (
    <div className="space-y-6">
      {/* Contact Quick-Actions Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Email */}
        <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-btn">
          <div className="min-w-0 mr-2">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-medium text-text-primary truncate mt-0.5">{lead.email}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => copyToClipboard(lead.email)}
              className="p-1.5 text-text-secondary hover:text-accent hover:bg-hover transition-colors rounded-md cursor-pointer"
              aria-label="Copy email"
              title="Copy email"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <a
              href={`mailto:${lead.email}`}
              className="p-1.5 text-text-secondary hover:text-accent hover:bg-hover transition-colors rounded-md"
              aria-label="Send email"
              title="Send email"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Phone / WhatsApp */}
        <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-btn">
          <div className="min-w-0 mr-2">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Phone / WhatsApp</p>
            <p className="text-sm font-medium text-text-primary truncate mt-0.5">
              {lead.phone || 'Not provided'}
            </p>
          </div>
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-success-light text-success border border-success/20 px-2.5 py-1.5 rounded-btn hover:bg-success hover:text-white transition-colors shrink-0"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Business Meta (Type & Age) */}
      <div className="grid grid-cols-2 gap-4 pt-1 border-t border-border">
        <div>
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Business Type</p>
          <p className="text-sm font-semibold text-text-primary mt-1">{lead.business_type || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Trading Age</p>
          <p className="text-sm font-semibold text-text-primary mt-1">{lead.business_age || '—'}</p>
        </div>
      </div>

      {/* Core Coaching Context */}
      <div className="space-y-4 pt-2 border-t border-border">
        {/* Challenge */}
        <div>
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
            Primary Operational Challenge
          </p>
          <div className="bg-background border border-border border-l-[3px] border-l-accent rounded-btn p-4">
            <p className="text-sm text-text-primary leading-relaxed font-normal">
              &ldquo;{lead.main_challenge}&rdquo;
            </p>
          </div>
        </div>

        {/* Goal */}
        <div>
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Stated Strategic Objective
          </p>
          <div className="flex items-start gap-2.5 p-3.5 bg-background border border-border rounded-btn">
            <Target className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-text-primary leading-snug">{lead.main_goal}</p>
          </div>
        </div>

        {/* Urgency */}
        {lead.urgency && (
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Decision Timeline / Urgency
            </p>
            <div className="flex items-center gap-2.5 p-3.5 bg-background border border-border rounded-btn">
              <Clock className="h-4 w-4 text-text-secondary shrink-0" />
              <p className="text-sm font-medium text-text-primary">{lead.urgency}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
