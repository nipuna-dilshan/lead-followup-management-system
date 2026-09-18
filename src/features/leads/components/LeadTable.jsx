import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import LeadRow from './LeadRow';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants';

export default function LeadTable({ leads, loading, error, total, page, totalPages, onPageChange, onRetry }) {
  if (error) {
    return (
      <div className="bg-surface rounded-card border border-border">
        <EmptyState
          icon={Users}
          title="Failed to load leads"
          description={error}
          action={
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const start = total === 0 ? 0 : (page - 1) * DEFAULT_PAGE_SIZE + 1;
  const end = Math.min(page * DEFAULT_PAGE_SIZE, total);

  return (
    <div className="bg-surface rounded-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left" aria-label="Leads table">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wide">Lead</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wide hidden sm:table-cell">Business Type</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wide hidden md:table-cell">Challenge</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wide hidden lg:table-cell">Follow-up</th>
              <th className="px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wide hidden lg:table-cell">Created</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" />
                    <span className="text-sm text-text-secondary">Loading leads...</span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={Users}
                    title="No leads found"
                    description="No enquiries match your current filters. Try adjusting your search."
                  />
                </td>
              </tr>
            ) : (
              leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-text-secondary">
            Showing {start}–{end} of {total} leads
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 w-8 flex items-center justify-center rounded text-text-secondary hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-base"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) {
                  return [
                    <span key={`ellipsis-${p}`} className="px-1 text-xs text-text-secondary">…</span>,
                    <PageButton key={p} p={p} current={page} onClick={onPageChange} />,
                  ];
                }
                return <PageButton key={p} p={p} current={page} onClick={onPageChange} />;
              })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-8 w-8 flex items-center justify-center rounded text-text-secondary hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-base"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PageButton({ p, current, onClick }) {
  return (
    <button
      onClick={() => onClick(p)}
      className={`h-8 w-8 flex items-center justify-center rounded text-xs font-medium transition-base
        ${p === current
          ? 'bg-accent text-white'
          : 'text-text-secondary hover:bg-background hover:text-text-primary'
        }`}
      aria-current={p === current ? 'page' : undefined}
    >
      {p}
    </button>
  );
}
