import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { X, ExternalLink, Video, User } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function CalendarEvent({ event, onClose }) {
  const navigate = useNavigate();

  if (!event) return null;

  const start = parseISO(event.start_time);
  const end = event.end_time ? parseISO(event.end_time) : null;

  return (
    <div className="bg-surface rounded-card border border-border shadow-modal p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-base font-semibold text-text-primary">{event.leads?.full_name || 'Consultation'}</p>
          <p className="text-sm text-text-secondary mt-0.5">Business Growth Consultation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={event.status} label={event.status === 'CONFIRMED' ? 'Confirmed' : event.status} variant={event.status === 'CONFIRMED' ? 'success' : 'default'} />
          {onClose && (
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">{format(start, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-primary">{format(start, 'h:mm a')}</span>
          {end && <span className="text-text-secondary">→ {format(end, 'h:mm a')}</span>}
        </div>

        {event.meeting_url && (
          <a
            href={event.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <Video className="h-4 w-4" />
            Join Session Meeting Room
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {event.leads && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/admin/leads/${event.leads.id}`)}
            className="mt-2"
          >
            <User className="h-3.5 w-3.5" />
            View Lead
          </Button>
        )}
      </div>
    </div>
  );
}
