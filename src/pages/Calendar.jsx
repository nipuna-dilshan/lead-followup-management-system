import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  ArrowRight,
  MoreVertical,
  Calendar as CalIcon,
} from 'lucide-react';
import { useCalendar } from '../features/calendar/hooks/useCalendar';
import { CAL_BOOKING_URL } from '../lib/constants';
import { formatDate } from '../lib/utils';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { consultations, loading } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('Month');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Month navigation
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  // Build real dynamic calendar grid
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday-based day of week (0 = Mon, 6 = Sun)
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const daysInCurrentMonth = lastDayOfMonth.getDate();

    const grid = [];

    // Prev month padding
    for (let i = startDay - 1; i >= 0; i--) {
      grid.push({
        day: daysInPrevMonth - i,
        isOutside: true,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(year, month, i);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      // Find real consultations for this day
      const dayConsultations = consultations.filter((c) => {
        const cDate = new Date(c.start_time);
        return (
          cDate.getDate() === i &&
          cDate.getMonth() === month &&
          cDate.getFullYear() === year
        );
      });

      grid.push({
        day: i,
        isOutside: false,
        isToday,
        date,
        consultations: dayConsultations,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (grid.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      grid.push({
        day: i,
        isOutside: true,
        date: new Date(year, month + 1, i),
      });
    }

    return grid;
  }, [currentDate, consultations]);

  // Active displayed consultation: selected or first upcoming
  const activeBrief = useMemo(() => {
    if (selectedConsultation) return selectedConsultation;
    if (consultations && consultations.length > 0) return consultations[0];
    return null;
  }, [selectedConsultation, consultations]);

  const thisWeekConsultations = useMemo(() => {
    return consultations.filter((c) => {
      const cDate = new Date(c.start_time);
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      return cDate >= now && cDate <= nextWeek;
    });
  }, [consultations]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1917] tracking-tight">Calendar</h1>
            <p className="text-xs text-[#78716C] mt-1 font-medium">
              View and manage your upcoming coaching consultations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Month selector */}
            <div className="flex items-center bg-white border border-[#EDE5DA] rounded-xl px-2 py-1 shadow-sm">
              <button
                onClick={prevMonth}
                className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors rounded cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-xs font-bold text-[#1C1917] min-w-[110px] text-center">
                {monthName}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors rounded cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Today button */}
            <button
              onClick={setToday}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-[#EDE5DA] rounded-xl text-[#443E3A] hover:bg-[#FAF7F2] transition-colors shadow-sm cursor-pointer"
            >
              Today
            </button>

            {/* View switcher */}
            <div className="flex items-center bg-[#F2EDE6] p-0.5 rounded-xl text-xs font-medium border border-[#E6E0D6]">
              {['Month', 'Week', 'Agenda'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    currentView === view
                      ? 'bg-white text-[#1C1917] font-semibold shadow-sm'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Schedule Consultation Button */}
            <a
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#8C432D] hover:bg-[#793926] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Schedule Consultation</span>
            </a>
          </div>
        </div>

        {/* Calendar Grid + Right Detail Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Calendar View (8 cols) */}
          <div className="xl:col-span-8 bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-5">
            {/* Days of week */}
            <div className="grid grid-cols-7 border-b border-[#EDE5DA] pb-3 text-center">
              {daysOfWeek.map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Grid Days */}
            {loading ? (
              <div className="py-24 text-center text-xs text-[#78716C]">Loading calendar events...</div>
            ) : (
              <div className="grid grid-cols-7 border-l border-t border-[#EDE5DA] mt-2">
                {calendarGrid.map((item, index) => {
                  const hasEvents = item.consultations && item.consultations.length > 0;
                  return (
                    <div
                      key={index}
                      className={`min-h-[88px] sm:min-h-[96px] p-2 border-r border-b border-[#EDE5DA] transition-colors relative flex flex-col justify-between ${
                        item.isOutside
                          ? 'bg-[#FAF7F2]/80 text-[#A8A29E]'
                          : item.isToday
                          ? 'bg-[#FAF4ED]'
                          : 'bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            item.isOutside
                              ? 'text-[#A8A29E]'
                              : item.isToday
                              ? 'text-[#8C432D]'
                              : 'text-[#1C1917]'
                          }`}
                        >
                          {item.day}
                        </span>
                        {item.isToday && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#8C432D]" />
                        )}
                      </div>

                      {hasEvents && (
                        <div className="space-y-1 mt-1">
                          {item.consultations.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setSelectedConsultation(c)}
                              className="w-full text-left bg-[#E8F5EE] border border-[#2D7A51]/20 text-[#2D7A51] rounded-lg p-1.5 text-[10px] leading-tight font-medium shadow-xs hover:bg-[#DDF0E5] transition-colors cursor-pointer block"
                            >
                              <span className="font-bold block">
                                {new Date(c.start_time).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="truncate block opacity-90">
                                {c.leads?.full_name || c.title || 'Consultation'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend & Timezone Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EDE5DA] mt-4 text-xs text-[#78716C]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-[#E8F5EE] border border-[#2D7A51]/30" />
                  <span className="text-[11px] font-medium text-[#57524E]">
                    Confirmed Advisory ({consultations.length} total)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-[#FAF7F2] border border-[#EDE5DA]" />
                  <span className="text-[11px] font-medium text-[#57524E]">
                    Executive Focus Time
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-[#78716C]">
                Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>
          </div>

          {/* Right Column: Brief & Week Sessions (4 cols) */}
          <div className="xl:col-span-4 space-y-5">
            {/* Card 1: Consultation Brief */}
            <div className="bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5DA]">
                <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                  Consultation Brief
                </h3>
                {activeBrief && (
                  <span className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#2D7A51] text-[11px] font-bold px-2 py-0.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2D7A51]" />
                    {activeBrief.status || 'Confirmed'}
                  </span>
                )}
              </div>

              {activeBrief ? (
                <div className="pt-4 space-y-4">
                  {/* Client info */}
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[#EFE8E1] text-[#8C432D] font-bold text-sm flex items-center justify-center shrink-0 ring-1 ring-black/5">
                      {activeBrief.leads?.full_name?.slice(0, 2).toUpperCase() || 'EA'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1C1917]">
                        {activeBrief.leads?.full_name || 'Client Name'}
                      </h4>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {activeBrief.title || 'Executive Advisory Consultation'}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#EDE5DA] space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#443E3A]">
                      <Clock className="h-3.5 w-3.5 text-[#8C432D] shrink-0" />
                      <span>{formatDate(activeBrief.start_time)}</span>
                    </div>
                    {activeBrief.meeting_url && (
                      <div className="flex items-center gap-2 text-[#443E3A]">
                        <Video className="h-3.5 w-3.5 text-[#8C432D] shrink-0" />
                        <span className="truncate">
                          Meeting Link:{' '}
                          <a
                            href={activeBrief.meeting_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#8C432D] underline"
                          >
                            {activeBrief.meeting_url}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Join Room Button */}
                  {activeBrief.meeting_url && (
                    <a
                      href={activeBrief.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#8C432D] hover:bg-[#793926] text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Room</span>
                    </a>
                  )}

                  {/* Strategic Context */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                      Lead Strategic Context
                    </span>
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] text-xs text-[#443E3A] leading-relaxed">
                      {activeBrief.leads?.main_challenge ||
                        'Executive practice client consultation context.'}
                    </div>
                  </div>

                  {/* View Details Link */}
                  {activeBrief.lead_id && (
                    <button
                      onClick={() => navigate(`/admin/leads/${activeBrief.lead_id}`)}
                      className="text-xs font-semibold text-[#8C432D] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>View Lead Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-full bg-[#EFE8E1] text-[#8C432D] flex items-center justify-center">
                    <CalIcon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1C1917]">No Consultation Selected</h4>
                  <p className="text-[11px] text-[#78716C]">
                    Bookings will display full client briefing notes here.
                  </p>
                </div>
              )}
            </div>

            {/* Card 2: This Week's Consultations */}
            <div className="bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5DA]">
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] tracking-tight">
                    This Week&apos;s Consultations
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#78716C]">
                  {thisWeekConsultations.length} Sessions
                </span>
              </div>

              {thisWeekConsultations.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#78716C]">
                  No consultations scheduled for this week.
                </div>
              ) : (
                <div className="divide-y divide-[#F2EDE6] mt-2">
                  {thisWeekConsultations.map((c) => (
                    <div key={c.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1C1917]">
                          {c.leads?.full_name || 'Client Session'}
                        </span>
                        <button className="text-[#A8A29E] hover:text-[#1C1917]">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#78716C]">{c.title || 'Advisory Call'}</p>
                      <p className="text-[11px] text-[#2D7A51] font-semibold">
                        {formatDate(c.start_time)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[#EDE5DA] mt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#78716C]">Calendar connection: Cal.com</span>
                <a
                  href={CAL_BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#8C432D] hover:underline cursor-pointer"
                >
                  Manage Availability
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
