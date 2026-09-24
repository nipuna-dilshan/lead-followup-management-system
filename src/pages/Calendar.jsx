import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
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
import { fetchRecentLeads } from '../features/leads/services/leadService';
import { useToast } from '../components/ui/Toast';
import { CAL_BOOKING_URL } from '../lib/constants';
import { formatDate } from '../lib/utils';

export default function CalendarPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { consultations, loading, scheduleConsultation } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('Month');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [leadsList, setLeadsList] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    lead_id: '',
    date: '2026-10-01',
    time: '10:00',
    meeting_url: 'https://meet.google.com/coaching-session',
  });

  useEffect(() => {
    fetchRecentLeads(50)
      .then((leads) => {
        setLeadsList(leads || []);
        if (leads && leads.length > 0) {
          setScheduleForm((prev) => (prev.lead_id ? prev : { ...prev, lead_id: leads[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenScheduleForDate = (dateObj) => {
    if (!dateObj) return;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setScheduleForm((prev) => ({
      ...prev,
      date: `${year}-${month}-${day}`,
    }));
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.lead_id) {
      toast({ message: 'Please select a lead.', type: 'error' });
      return;
    }
    setScheduleLoading(true);
    try {
      const startTime = new Date(`${scheduleForm.date}T${scheduleForm.time}:00`).toISOString();
      await scheduleConsultation({
        lead_id: scheduleForm.lead_id,
        start_time: startTime,
        meeting_url: scheduleForm.meeting_url,
      });
      toast({ message: 'Consultation scheduled successfully!', type: 'success' });
      setScheduleModalOpen(false);
    } catch (err) {
      toast({ message: err.message || 'Failed to schedule consultation.', type: 'error' });
    } finally {
      setScheduleLoading(false);
    }
  };

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

  // Calendar Grid calculation
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDay = firstDayOfMonth.getDay() - 1; // 0=Mon, 6=Sun
    if (startDay === -1) startDay = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const grid = [];

    // Prev month padding
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const d = new Date(year, month - 1, dayNum);
      grid.push({
        day: dayNum,
        date: d,
        isOutside: true,
        isToday: false,
        consultations: [],
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const isToday =
        today.getDate() === i &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      const matchingConsultations = consultations.filter((c) => {
        if (!c.start_time) return false;
        const cStart = new Date(c.start_time);
        return (
          cStart.getDate() === i &&
          cStart.getMonth() === month &&
          cStart.getFullYear() === year
        );
      });

      grid.push({
        day: i,
        date: d,
        isOutside: false,
        isToday,
        consultations: matchingConsultations,
      });
    }

    // Next month padding to fill complete weeks (up to 35 or 42)
    const totalCells = grid.length > 35 ? 42 : 35;
    const remaining = totalCells - grid.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      grid.push({
        day: i,
        date: d,
        isOutside: true,
        isToday: false,
        consultations: [],
      });
    }

    return grid;
  }, [currentDate, consultations]);

  // Active brief consultation
  const activeBrief = selectedConsultation || (consultations.length > 0 ? consultations[0] : null);

  // This week's sessions
  const thisWeekConsultations = useMemo(() => {
    return consultations.slice(0, 5);
  }, [consultations]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[32px] font-[650] text-text-primary tracking-tight leading-tight">
              Advisory Calendar
            </h1>
            <p className="text-sm text-text-secondary mt-1 font-normal">
              Manage executive consultations, 1:1 strategy calls, and booked client sessions.
            </p>
          </div>

          {/* Controls: Prev/Next Month + Today + View + Schedule */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month Navigator */}
            <div className="flex items-center bg-surface border border-border rounded-btn px-2 py-1 shadow-xs">
              <button
                onClick={prevMonth}
                className="p-1.5 text-text-secondary hover:text-text-primary transition-colors rounded cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-xs font-semibold text-text-primary min-w-[110px] text-center">
                {monthName}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 text-text-secondary hover:text-text-primary transition-colors rounded cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Today button */}
            <button
              onClick={setToday}
              className="px-3.5 py-1.5 text-xs font-semibold bg-surface border border-border rounded-btn text-text-primary hover:bg-hover transition-colors shadow-xs cursor-pointer"
            >
              Today
            </button>

            {/* View switcher */}
            <div className="flex items-center bg-hover p-0.5 rounded-btn text-xs font-medium border border-border">
              {['Month', 'Week', 'Agenda'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${
                    currentView === view
                      ? 'bg-surface text-text-primary font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Schedule Consultation Button */}
            <Button
              onClick={() => setScheduleModalOpen(true)}
              variant="primary"
              size="md"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Schedule Consultation</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid + Right Detail Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Calendar View (8 cols) */}
          <div className="xl:col-span-8 bg-surface rounded-card border border-border shadow-card p-5">
            {/* Days of week */}
            <div className="grid grid-cols-7 border-b border-border pb-3 text-center">
              {daysOfWeek.map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Grid Days */}
            {loading ? (
              <div className="py-24 text-center text-xs text-text-secondary">Loading calendar events...</div>
            ) : (
              <div className="grid grid-cols-7 border-l border-t border-border mt-2">
                {calendarGrid.map((item, index) => {
                  const hasEvents = item.consultations && item.consultations.length > 0;
                  return (
                    <div
                      key={index}
                      onClick={() => !item.isOutside && handleOpenScheduleForDate(item.date)}
                      className={`min-h-[88px] sm:min-h-[96px] p-2 border-r border-b border-border transition-colors relative flex flex-col justify-between ${
                        item.isOutside
                          ? 'bg-hover/60 text-text-muted'
                          : item.isToday
                          ? 'bg-accent-light/40 cursor-pointer'
                          : 'bg-surface hover:bg-hover/70 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            item.isOutside
                              ? 'text-text-muted'
                              : item.isToday
                              ? 'text-accent font-bold'
                              : 'text-text-primary'
                          }`}
                        >
                          {item.day}
                        </span>
                        {item.isToday && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </div>

                      {hasEvents && (
                        <div className="space-y-1 mt-1">
                          {item.consultations.map((c) => (
                            <button
                              key={c.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedConsultation(c);
                              }}
                              className="w-full text-left bg-success-light border border-success/20 text-success rounded-md p-1.5 text-[10px] leading-tight font-medium shadow-xs hover:bg-success-light/80 transition-colors cursor-pointer block"
                            >
                              <span className="font-bold block">
                                {new Date(c.start_time).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="truncate block opacity-95">
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
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border mt-4 text-xs text-text-secondary">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-success-light border border-success/30" />
                  <span className="text-[11px] font-medium text-text-secondary">
                    Confirmed Advisory ({consultations.length} total)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-hover border border-border" />
                  <span className="text-[11px] font-medium text-text-secondary">
                    Executive Focus Time
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-text-secondary">
                Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>
          </div>

          {/* Right Column: Brief & Week Sessions (4 cols) */}
          <div className="xl:col-span-4 space-y-5">
            {/* Card 1: Consultation Brief */}
            <div className="bg-surface rounded-card border border-border shadow-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-semibold text-text-primary tracking-tight">
                  Consultation Brief
                </h3>
                {activeBrief && (
                  <span className="inline-flex items-center gap-1 bg-success-light text-success text-[11px] font-semibold px-2 py-0.5 rounded-md border border-success/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {activeBrief.status || 'Confirmed'}
                  </span>
                )}
              </div>

              {activeBrief ? (
                <div className="pt-4 space-y-4">
                  {/* Client info */}
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-accent-light text-accent font-semibold text-sm flex items-center justify-center shrink-0">
                      {activeBrief.leads?.full_name?.slice(0, 2).toUpperCase() || 'EA'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {activeBrief.leads?.full_name || 'Client Name'}
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {activeBrief.title || 'Executive Advisory Consultation'}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="bg-background rounded-btn p-3 border border-border space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-text-primary font-medium">
                      <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{formatDate(activeBrief.start_time)}</span>
                    </div>
                    {activeBrief.meeting_url && (
                      <div className="flex items-center gap-2 text-text-primary font-medium">
                        <Video className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">
                          Meeting Link:{' '}
                          <a
                            href={activeBrief.meeting_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent underline"
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
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold text-xs py-2.5 rounded-btn transition-colors shadow-xs cursor-pointer"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Room</span>
                    </a>
                  )}

                  {/* Strategic Context */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
                      Lead Strategic Context
                    </span>
                    <div className="p-3 bg-background rounded-btn border border-border text-xs text-text-primary leading-relaxed">
                      {activeBrief.leads?.main_challenge ||
                        'Executive practice client consultation context.'}
                    </div>
                  </div>

                  {/* View Details Link */}
                  {activeBrief.lead_id && (
                    <button
                      onClick={() => navigate(`/admin/leads/${activeBrief.lead_id}`)}
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>View Lead Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-full bg-accent-light text-accent flex items-center justify-center">
                    <CalIcon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-text-primary">No Consultation Selected</h4>
                  <p className="text-[11px] text-text-secondary">
                    Bookings will display full client briefing notes here.
                  </p>
                </div>
              )}
            </div>

            {/* Card 2: This Week's Consultations */}
            <div className="bg-surface rounded-card border border-border shadow-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary tracking-tight">
                    This Week&apos;s Consultations
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-text-secondary">
                  {thisWeekConsultations.length} Sessions
                </span>
              </div>

              {thisWeekConsultations.length === 0 ? (
                <div className="py-6 text-center text-xs text-text-secondary">
                  No consultations scheduled for this week.
                </div>
              ) : (
                <div className="divide-y divide-border mt-2">
                  {thisWeekConsultations.map((c) => (
                    <div key={c.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-primary">
                          {c.leads?.full_name || 'Client Session'}
                        </span>
                        <button className="text-text-muted hover:text-text-primary">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary">{c.title || 'Advisory Call'}</p>
                      <p className="text-[11px] text-success font-semibold">
                        {formatDate(c.start_time)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-border mt-2 flex items-center justify-between text-[11px]">
                <span className="text-text-secondary">Calendar connection: Cal.com</span>
                <a
                  href={CAL_BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-accent hover:underline cursor-pointer"
                >
                  Manage Availability
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Consultation Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Coaching Consultation"
        description="Book a 1:1 strategy session directly to your calendar."
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setScheduleModalOpen(false)}
              disabled={scheduleLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={scheduleLoading}
              onClick={handleScheduleSubmit}
            >
              Save Consultation
            </Button>
          </>
        }
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Select Client / Lead *
            </label>
            <select
              value={scheduleForm.lead_id}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, lead_id: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
              required
            >
              <option value="">-- Choose an Enquiry --</option>
              {leadsList.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.full_name || lead.name || 'Client'} ({lead.email}) — {lead.business_type || 'Lead'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Session Date *
              </label>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Start Time *
              </label>
              <input
                type="time"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm((prev) => ({ ...prev, time: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Meeting URL
            </label>
            <input
              type="url"
              value={scheduleForm.meeting_url}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, meeting_url: e.target.value }))}
              placeholder="https://meet.google.com/xyz-uvwx-yzz"
              className="w-full px-3.5 py-2 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
