import { UserPlus, Mail, Send, Calendar, CheckCircle } from 'lucide-react';
import { formatDate, formatTime, timeAgo } from '../../../lib/utils';

function buildTimeline(lead, emailEvents, followups, consultation) {
  const events = [];

  // Lead received
  events.push({
    id: 'lead-received',
    icon: UserPlus,
    label: 'Enquiry form submitted from website',
    timestamp: lead.created_at,
    color: 'text-accent',
    bgColor: 'bg-accent-light',
  });

  // Welcome email
  const welcomeEmail = emailEvents?.find((e) => e.type === 'WELCOME' && e.status === 'SENT');
  if (welcomeEmail) {
    events.push({
      id: 'welcome-email',
      icon: Mail,
      label: 'Welcome email sent',
      timestamp: welcomeEmail.sent_at || welcomeEmail.created_at,
      color: 'text-success',
      bgColor: 'bg-success-light',
    });
  }

  // Follow-up emails
  emailEvents?.forEach((e) => {
    if (e.type !== 'WELCOME' && e.status === 'SENT') {
      events.push({
        id: `email-${e.id}`,
        icon: Send,
        label: `Follow-up email delivered`,
        timestamp: e.sent_at || e.created_at,
        color: 'text-accent',
        bgColor: 'bg-accent-light',
      });
    }
  });

  // Consultation booked
  if (consultation) {
    events.push({
      id: 'consultation-booked',
      icon: Calendar,
      label: 'Consultation booked',
      timestamp: consultation.created_at,
      color: 'text-success',
      bgColor: 'bg-success-light',
    });
  }

  if (consultation?.status === 'COMPLETED') {
    events.push({
      id: 'consultation-completed',
      icon: CheckCircle,
      label: 'Consultation completed',
      timestamp: consultation.updated_at,
      color: 'text-success',
      bgColor: 'bg-success-light',
    });
  }

  // Sort by timestamp descending (most recent first)
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export default function ActivityTimeline({ lead, emailEvents, followups, consultation }) {
  const timeline = buildTimeline(lead, emailEvents, followups, consultation);

  if (timeline.length === 0) {
    return <p className="text-sm text-text-secondary py-4 text-center">No activity yet.</p>;
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-border" aria-hidden="true" />

      <ol className="space-y-4">
        {timeline.map((event) => {
          const Icon = event.icon;
          return (
            <li key={event.id} className="flex items-start gap-4 relative pl-10">
              <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${event.bgColor} border border-white shrink-0`}>
                <Icon className={`h-3.5 w-3.5 ${event.color}`} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm text-text-primary">{event.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {formatDate(event.timestamp)} · {formatTime(event.timestamp)}
                  <span className="ml-2 opacity-60">{timeAgo(event.timestamp)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
