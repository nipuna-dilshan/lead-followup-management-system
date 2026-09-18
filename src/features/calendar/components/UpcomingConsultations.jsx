import { useNavigate } from 'react-router-dom';
import { Calendar, Video } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';

function ConsultationLabel({ startTime }) {
  const d = parseISO(startTime);
  if (isToday(d)) return <span className="text-xs font-semibold text-accent uppercase tracking-wide">Today · {format(d, 'h:mm a')}</span>;
  if (isTomorrow(d)) return <span className="text-xs font-semibold text-warning uppercase tracking-wide">Tomorrow · {format(d, 'h:mm a')}</span>;
  return <span className="text-xs text-text-secondary">{format(d, 'MMM d · h:mm a')}</span>;
}

export default function UpcomingConsultations({ consultations, loading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Upcoming Consultations</h3>
          <p className="text-xs text-text-secondary mt-0.5">Scheduled strategic sessions</p>
        </div>
        <Calendar className="h-4 w-4 text-text-secondary" />
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : consultations.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-6">No upcoming consultations.</p>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div key={c.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <ConsultationLabel startTime={c.start_time} />
              <p className="text-sm font-semibold text-text-primary mt-1">{c.leads?.full_name}</p>
              <p className="text-xs text-text-secondary">{c.leads?.business_type || 'Growth Consultation'}</p>
              <div className="flex gap-2 mt-2">
                {c.meeting_url && (
                  <a
                    href={c.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs border border-border rounded px-2 py-1 text-text-secondary hover:bg-background hover:text-accent transition-base"
                  >
                    <Video className="h-3 w-3" />
                    Join Room
                  </a>
                )}
                <button
                  onClick={() => navigate(`/admin/leads/${c.leads?.id}`)}
                  className="text-xs text-accent hover:underline"
                >
                  View dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-4"
        onClick={() => navigate('/admin/calendar')}
      >
        View Calendar →
      </Button>
    </div>
  );
}
