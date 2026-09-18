import { Mail, CheckCircle, Clock, XCircle } from 'lucide-react';
import { EMAIL_TYPE_LABELS } from '../../../lib/constants';
import { formatDate, formatTime } from '../../../lib/utils';

function EmailIcon({ status }) {
  if (status === 'SENT') return <CheckCircle className="h-4 w-4 text-success" />;
  if (status === 'PENDING' || status === 'SCHEDULED') return <Clock className="h-4 w-4 text-warning" />;
  if (status === 'FAILED') return <XCircle className="h-4 w-4 text-danger" />;
  return <Mail className="h-4 w-4 text-text-secondary" />;
}

const EMAIL_ORDER = ['WELCOME', 'FOLLOW_UP_1', 'FOLLOW_UP_2', 'FINAL_FOLLOW_UP'];

export default function EmailHistory({ emailEvents, lead }) {
  if (!emailEvents || emailEvents.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-4 text-center">
        No email activity recorded yet.
      </p>
    );
  }

  // Build full list — show all types, mark missing ones as pending
  const emailMap = {};
  emailEvents.forEach((e) => { emailMap[e.type] = e; });

  return (
    <div className="space-y-3">
      {EMAIL_ORDER.map((type) => {
        const event = emailMap[type];
        const label = EMAIL_TYPE_LABELS[type];

        if (!event) {
          return (
            <div key={type} className="flex items-start gap-3 py-2 opacity-40">
              <div className="mt-0.5"><Mail className="h-4 w-4 text-text-secondary" /></div>
              <div>
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="text-xs text-text-secondary mt-0.5">Not yet sent</p>
              </div>
            </div>
          );
        }

        return (
          <div key={type} className="flex items-start gap-3 py-2">
            <div className="mt-0.5"><EmailIcon status={event.status} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <span className={`text-xs font-medium ${
                  event.status === 'SENT' ? 'text-success' :
                  event.status === 'FAILED' ? 'text-danger' : 'text-warning'
                }`}>
                  {event.status === 'SENT' ? 'Sent' : event.status === 'FAILED' ? 'Failed' : 'Pending'}
                </span>
              </div>
              {event.subject && (
                <p className="text-xs text-text-secondary mt-0.5 truncate">"{event.subject}"</p>
              )}
              {event.sent_at && (
                <p className="text-xs text-text-secondary mt-0.5">
                  {formatDate(event.sent_at)} · {formatTime(event.sent_at)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
