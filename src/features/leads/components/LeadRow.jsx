import { useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { formatDate, getInitials, truncate, getNextFollowUpInfo } from '../../../lib/utils';

export default function LeadRow({ lead }) {
  const navigate = useNavigate();
  const initials = getInitials(lead.full_name);
  const followUpInfo = getNextFollowUpInfo(lead);

  return (
    <tr
      onClick={() => navigate(`/admin/leads/${lead.id}`)}
      className="cursor-pointer hover:bg-hover transition-colors group"
    >
      {/* Lead Name & Contact */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-accent-light text-accent text-xs font-semibold flex items-center justify-center shrink-0">
            {initials || 'LP'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
              {lead.full_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-text-secondary truncate">{lead.email}</span>
              {lead.phone && (
                <>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-xs text-text-secondary truncate">{lead.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Business Type (Clean neutral pill, NO purple) */}
      <td className="px-5 py-4 hidden sm:table-cell">
        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-hover text-text-secondary border border-border">
          {lead.business_type || '—'}
        </span>
      </td>

      {/* Challenge */}
      <td className="px-5 py-4 hidden md:table-cell max-w-xs">
        <span className="text-xs text-text-secondary line-clamp-1">
          {truncate(lead.main_challenge, 70)}
        </span>
      </td>

      {/* Status Badge */}
      <td className="px-5 py-4 text-center">
        <Badge status={lead.status} />
      </td>

      {/* Follow-up / Session */}
      <td className="px-5 py-4 hidden lg:table-cell whitespace-nowrap">
        {!followUpInfo ? (
          <span className="text-xs text-text-secondary">—</span>
        ) : followUpInfo.type === 'BOOKED_SESSION' ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <Calendar className="h-3.5 w-3.5 text-success shrink-0" />
              <span>{followUpInfo.formattedDate}</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5 font-medium flex items-center gap-1.5">
              <span>{followUpInfo.time}</span>
              <span className="text-[10px] bg-success-light text-success border border-success/20 px-1.5 py-0.2 rounded font-semibold">
                Session
              </span>
            </p>
          </div>
        ) : followUpInfo.type === 'BOOKED_PENDING' ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <Calendar className="h-3.5 w-3.5 text-success shrink-0" />
              <span>{followUpInfo.label}</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5 font-medium flex items-center gap-1.5">
              <span className="text-[10px] bg-hover text-text-secondary border border-border px-1.5 py-0.2 rounded font-medium">
                {followUpInfo.sublabel}
              </span>
            </p>
          </div>
        ) : followUpInfo.type === 'COMPLETED' ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <CheckCircle2 className="h-3.5 w-3.5 text-text-muted shrink-0" />
              <span>{followUpInfo.label}</span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5 font-normal">
              {followUpInfo.sublabel}
            </p>
          </div>
        ) : (
          /* UPCOMING_FOLLOWUP */
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>{followUpInfo.formattedDate}</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5 font-medium flex items-center gap-1.5">
              <span className="text-[10px] bg-accent-light text-accent border border-accent/20 px-1.5 py-0.2 rounded font-semibold">
                {followUpInfo.label}
              </span>
              <span className="text-[10px] text-text-muted">
                ({followUpInfo.sublabel})
              </span>
            </p>
          </div>
        )}
      </td>

      {/* Created */}
      <td className="px-5 py-4 hidden xl:table-cell whitespace-nowrap">
        <span className="text-xs text-text-secondary">
          {formatDate(lead.created_at, 'MMM d, yyyy')}
        </span>
      </td>

      {/* View Link */}
      <td className="px-5 py-4 text-right">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-base">
          View <ExternalLink className="h-3 w-3" />
        </span>
      </td>
    </tr>
  );
}
