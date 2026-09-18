import { Search, SlidersHorizontal } from 'lucide-react';
import Select from '../../../components/ui/Select';
import { STATUS_FILTER_OPTIONS, BUSINESS_TYPES } from '../constants/leadOptions';

export default function LeadFilters({ search, onSearchChange, status, onStatusChange, businessType, onBusinessTypeChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email or challenge..."
          className="w-full h-10 pl-9 pr-3 text-sm rounded-input border border-border bg-surface
            text-text-primary placeholder:text-text-secondary/60
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-base"
          aria-label="Search leads"
        />
      </div>

      {/* Status filter */}
      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        containerClassName="w-full sm:w-40"
        aria-label="Filter by status"
      >
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>

      {/* Business type filter */}
      <Select
        value={businessType}
        onChange={(e) => onBusinessTypeChange(e.target.value)}
        containerClassName="w-full sm:w-48"
        aria-label="Filter by business type"
      >
        <option value="ALL">All Business Types</option>
        {BUSINESS_TYPES.filter(b => b.value).map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>
    </div>
  );
}
