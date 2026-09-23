import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import LeadRow from './LeadRow';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants';

export default function LeadTable({
  leads,
  loading,
  error,
  total,
  page,
  totalPages,
  onPageChange,
  onRetry,
}) {
  if (error) {
    return (
      <div className="bg-surface rounded-card border border-border shadow-card p-8">
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
    <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left" aria-label="Leads table">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-5 py-3.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Name &amp; Contact
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">
                Business Type
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                Challenge
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                Follow-up / Session
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider hidden xl:table-cell">
                Received
              </th>
              <th className="px-5 py-3.5 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" className="text-accent" />
                    <span className="text-sm text-text-secondary">Loading enquiries...</span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16">
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

      {/* Pagination Bar */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-surface">
          <p className="text-xs text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{start}–{end}</span> of{' '}
            <span className="font-semibold text-text-primary">{total}</span> enquiries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 w-8 flex items-center justify-center rounded-btn border border-border text-text-secondary hover:bg-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-base cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) {
                  return [
                    <span key={`ellipsis-${p}`} className="px-1 text-xs text-text-muted">
                      …
                    </span>,
                    <PageButton key={p} p={p} current={page} onClick={onPageChange} />,
                  ];
                }
                return <PageButton key={p} p={p} current={page} onClick={onPageChange} />;
              })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-btn border border-border text-text-secondary hover:bg-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-base cursor-pointer"
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
  const isActive = p === current;
  return (
    <button
      onClick={() => onClick(p)}
      className={`h-8 min-w-[32px] px-2 flex items-center justify-center rounded-btn text-xs font-semibold transition-base cursor-pointer ${
        isActive
          ? 'bg-accent text-white shadow-xs'
          : 'border border-border text-text-secondary hover:bg-hover hover:text-text-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {p}
    </button>
  );
}
