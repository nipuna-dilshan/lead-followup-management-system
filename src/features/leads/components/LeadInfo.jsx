import { Phone, Mail, Copy, ExternalLink } from 'lucide-react';

export default function LeadInfo({ lead }) {
  function copyToClipboard(text) {
    navigator.clipboard?.writeText(text);
  }

  return (
    <div className="space-y-4">
      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-background rounded-btn p-4">
          <p className="text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wide">Direct Email</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-text-primary font-medium">{lead.email}</p>
            <div className="flex gap-1">
              <button
                onClick={() => copyToClipboard(lead.email)}
                className="p-1 text-text-secondary hover:text-accent transition-base rounded"
                aria-label="Copy email"
                title="Copy email"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <a
                href={`mailto:${lead.email}`}
                className="p-1 text-text-secondary hover:text-accent transition-base rounded"
                aria-label="Send email"
                title="Send email"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-btn p-4">
          <p className="text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wide">Phone / WhatsApp</p>
          {lead.phone ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-primary font-medium">{lead.phone}</p>
              <a
                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-success-light text-success border border-success/20 px-2 py-0.5 rounded font-medium hover:bg-success hover:text-white transition-base"
              >
                WhatsApp
              </a>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Not provided</p>
          )}
        </div>
      </div>

      {/* Business Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-text-secondary mb-1 font-medium uppercase tracking-wide">Business Type</p>
          <p className="text-sm text-text-primary">{lead.business_type || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1 font-medium uppercase tracking-wide">Business Age</p>
          <p className="text-sm text-text-primary">{lead.business_age || '—'}</p>
        </div>
      </div>

      {/* Challenge */}
      <div>
        <p className="text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wide">Primary Operational Challenge</p>
        <div className="bg-background rounded-btn p-4 border-l-2 border-accent">
          <p className="text-sm text-text-primary leading-relaxed">"{lead.main_challenge}"</p>
        </div>
      </div>

      {/* Goal */}
      <div>
        <p className="text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wide">Stated Strategic Objective</p>
        <div className="flex items-start gap-2 bg-background rounded-btn p-4">
          <span className="text-accent mt-0.5">🎯</span>
          <p className="text-sm text-text-primary">{lead.main_goal}</p>
        </div>
      </div>

      {/* Urgency */}
      {lead.urgency && (
        <div className="flex items-center gap-3 bg-background rounded-btn p-4">
          <span className="text-lg">⏱</span>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-0.5">Desired Timeline / Urgency</p>
            <p className="text-sm text-text-primary font-medium">{lead.urgency}</p>
          </div>
        </div>
      )}
    </div>
  );
}
