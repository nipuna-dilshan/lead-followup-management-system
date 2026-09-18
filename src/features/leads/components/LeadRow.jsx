import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import LeadStatusBadge from './LeadStatusBadge';
import { formatDate, getInitials, truncate, formatFollowUpStage } from '../../../lib/utils';

export default function LeadRow({ lead }) {
  const navigate = useNavigate();
  const initials = getInitials(lead.full_name);

  return (
    <tr
      onClick={() => navigate(`/admin/leads/${lead.id}`)}
      className="cursor-pointer hover:bg-background transition-base group"
    >
      {/* Lead */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{lead.full_name}</p>
            <p className="text-xs text-text-secondary truncate">{lead.email}</p>
          </div>
        </div>
      </td>

      {/* Business Type */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-sm text-text-secondary">{lead.business_type || '—'}</span>
      </td>

      {/* Challenge */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-sm text-text-secondary">{truncate(lead.main_challenge, 60)}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </td>

      {/* Follow-up */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-text-secondary">{formatFollowUpStage(lead.follow_up_stage)}</span>
      </td>

      {/* Created */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-text-secondary">{formatDate(lead.created_at)}</span>
      </td>

      {/* View link */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-base">
          View <ExternalLink className="h-3 w-3" />
        </span>
      </td>
    </tr>
  );
}
