import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar as CalIcon,
  Search,
  Video,
  Lightbulb,
  ArrowRight,
  Plus,
  Users,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { fetchDashboardMetrics, fetchRecentLeads } from '../features/leads/services/leadService';
import { useUpcomingConsultations } from '../features/calendar/hooks/useCalendar';
import { isSupabaseConfigured } from '../config/env';
import { formatDate, timeAgo } from '../lib/utils';
import { CAL_BOOKING_URL } from '../lib/constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    total: 0,
    needsAttention: 0,
    activeFollowups: 0,
    booked: 0,
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { consultations, loading: consultationsLoading } = useUpcomingConsultations(4);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetchDashboardMetrics().catch(() => null),
      fetchRecentLeads(10).catch(() => []),
    ]).then(([metricsData, leadsData]) => {
      if (metricsData) {
        setMetrics(metricsData);
      }
      if (Array.isArray(leadsData)) {
        setLeads(leadsData);
      }
      setLoading(false);
    });
  }, []);

  const filterTabs = ['All', 'New', 'Contacted', 'Booked', 'No Response', 'Archived'];

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      activeFilter === 'All' ||
      lead.status?.toUpperCase() === activeFilter.toUpperCase().replace(' ', '_');
    const matchesSearch =
      filterText === '' ||
      lead.full_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      lead.company_name?.toLowerCase().includes(filterText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const conversionRate =
    metrics.total > 0 ? ((metrics.booked / metrics.total) * 100).toFixed(1) : '0.0';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1917] tracking-tight">
              Good morning, Michael.
            </h1>
            <p className="text-xs text-[#78716C] mt-1 font-medium">
              Here&apos;s what&apos;s happening with your enquiries.
            </p>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* TOTAL LEADS */}
          <div className="bg-white rounded-2xl p-5 border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                Total Leads
              </span>
              <TrendingUp className="h-4 w-4 text-[#78716C]" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#1C1917] tracking-tight">
                {metrics.total}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="inline-block bg-[#E8F5EE] text-[#2D7A51] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                Active pipeline
              </span>
            </div>
          </div>

          {/* NEEDS ATTENTION */}
          <div className="bg-white rounded-2xl p-5 border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                Needs Attention
              </span>
              <AlertCircle className="h-4 w-4 text-[#A06A32]" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#A06A32] tracking-tight">
                {metrics.needsAttention}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="inline-block bg-[#F5EFE6] text-[#8C6D46] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                {metrics.needsAttention} pending review
              </span>
            </div>
          </div>

          {/* ACTIVE FOLLOW-UPS */}
          <div className="bg-white rounded-2xl p-5 border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                Active Follow-ups
              </span>
              <Clock className="h-4 w-4 text-[#78716C]" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#1C1917] tracking-tight">
                {metrics.activeFollowups}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="inline-block bg-[#F5EFE6] text-[#8C6D46] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                In progress
              </span>
            </div>
          </div>

          {/* BOOKED */}
          <div className="bg-white rounded-2xl p-5 border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                Booked
              </span>
              <CheckCircle2 className="h-4 w-4 text-[#2D7A51]" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#2D7A51] tracking-tight">
                {metrics.booked}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="inline-block bg-[#E8F5EE] text-[#2D7A51] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                {conversionRate}% conversion
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Recent Leads (8 cols) */}
          <div className="xl:col-span-8 bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1C1917] tracking-tight">Recent Leads</h2>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Keep track of your latest enquiries and follow-up activity.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/leads')}
                className="text-xs font-semibold text-[#8C432D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all enquiries</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A29E]" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter by client..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6E0D6] rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#8C432D] focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-white border-[#8C432D] text-[#8C432D] shadow-sm font-semibold'
                        : 'bg-white border-[#E6E0D6] text-[#57524E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            {loading ? (
              <div className="py-12 text-center text-xs text-[#78716C]">Loading client enquiries...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-[#FAF7F2]/50 rounded-xl border border-dashed border-[#EDE5DA] p-6">
                <div className="h-10 w-10 mx-auto rounded-full bg-[#EFE8E1] text-[#8C432D] flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917]">No enquiries found</h3>
                  <p className="text-xs text-[#78716C] mt-1">
                    Client enquiries submitted via your public consultation form will appear here.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/leads?add=true')}
                  className="inline-flex items-center gap-1.5 bg-[#8C432D] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#793926] transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Add First Enquiry</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EDE5DA] text-[#78716C] font-semibold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Lead Name</th>
                      <th className="pb-3 font-semibold">Sector</th>
                      <th className="pb-3 font-semibold">Challenge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EDE6]">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => navigate(`/admin/leads/${lead.id}`)}
                        className="hover:bg-[#FAF7F2] cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#EFE8E1] text-[#8C432D] font-bold text-xs flex items-center justify-center shrink-0 ring-1 ring-black/5">
                              {lead.full_name?.slice(0, 2).toUpperCase() || 'NA'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#1C1917] group-hover:text-[#8C432D] transition-colors truncate">
                                {lead.full_name}
                              </p>
                              <p className="text-[11px] text-[#78716C] truncate mt-0.5">
                                {lead.company_name || timeAgo(lead.created_at)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-[#57524E] font-medium">
                          {lead.business_type || '—'}
                        </td>
                        <td className="py-3.5 text-[#57524E]">
                          <span className="truncate max-w-[240px] block" title={lead.main_challenge}>
                            {lead.main_challenge || '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EDE5DA] mt-4 text-xs text-[#78716C]">
              <span>
                Showing {filteredLeads.length} of {metrics.total} recorded enquiries
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="px-3 py-1 bg-white border border-[#E6E0D6] rounded-md text-[#A8A29E] font-medium opacity-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled
                  className="px-3 py-1 bg-white border border-[#E6E0D6] rounded-md text-[#A8A29E] font-medium opacity-50 cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Consultations & Practice Note (4 cols) */}
          <div className="xl:col-span-4 space-y-5">
            {/* Card 1: Upcoming Consultations */}
            <div className="bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5DA]">
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                    Upcoming Consultations
                  </h3>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Scheduled strategic sessions</p>
                </div>
                <CalIcon className="h-4 w-4 text-[#78716C]" />
              </div>

              {consultationsLoading ? (
                <div className="py-8 text-center text-xs text-[#78716C]">Loading sessions...</div>
              ) : consultations.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-[#78716C]">No upcoming consultations scheduled.</p>
                  <a
                    href={CAL_BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#8C432D] font-semibold hover:underline"
                  >
                    <span>Schedule on Cal.com</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-[#F2EDE6] mt-3">
                  {consultations.map((c) => (
                    <div key={c.id} className="py-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 font-bold text-[#8C432D] uppercase tracking-wide">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#8C432D]" />
                          {formatDate(c.start_time)}
                        </span>
                        <span className="text-[#78716C]">{c.duration_minutes || 45} mins</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1C1917]">
                          {c.leads?.full_name || 'Client Consultation'}
                        </h4>
                        <p className="text-xs text-[#78716C]">{c.title || 'Growth Consultation'}</p>
                      </div>
                      {c.meeting_url && (
                        <div className="pt-1">
                          <a
                            href={c.meeting_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#8C432D] hover:bg-[#793926] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Join Room</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* View Calendar Button */}
              <button
                onClick={() => navigate('/admin/calendar')}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EDE5DA] text-[#443E3A] font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <span>View Calendar</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 2: Advisor Practice Note */}
            <div className="bg-[#FAF5F0] rounded-2xl border border-[#EFE5DA] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#8C432D]">
                <Lightbulb className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Advisor Practice Note
                </span>
              </div>
              <p className="text-xs text-[#443E3A] leading-relaxed">
                Review new enquiries within 24 hours to maximize consultation booking conversion. Follow-up sequences and reminders are triggered automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
