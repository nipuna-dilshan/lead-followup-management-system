import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import { cn } from '../../../lib/utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ consultations, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function prevMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToToday() {
    setCurrentDate(new Date());
  }

  function getEventsForDay(day) {
    return consultations.filter((c) => {
      const eventDate = typeof c.start_time === 'string' ? parseISO(c.start_time) : c.start_time;
      return isSameDay(eventDate, day);
    });
  }

  return (
    <div className="bg-surface rounded-card border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-text-primary">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-btn text-text-secondary hover:bg-background hover:text-text-primary transition-base"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="h-8 w-8 flex items-center justify-center rounded text-text-secondary hover:bg-background transition-base"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className="h-8 w-8 flex items-center justify-center rounded text-text-secondary hover:bg-background transition-base"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-text-secondary">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const events = getEventsForDay(day);
          const inMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={idx}
              className={cn(
                'min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border-b border-r border-border',
                !inMonth && 'bg-background/40',
                idx % 7 === 6 && 'border-r-0'
              )}
            >
              <div
                className={cn(
                  'text-xs font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full',
                  isCurrentDay
                    ? 'bg-accent text-white'
                    : inMonth
                    ? 'text-text-primary'
                    : 'text-text-secondary/40'
                )}
              >
                {format(day, 'd')}
              </div>

              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left mb-0.5 px-1.5 py-0.5 rounded bg-success-light border border-success/20 text-xs text-success font-medium truncate hover:bg-success hover:text-white transition-base"
                >
                  <span className="hidden sm:inline">{format(parseISO(event.start_time), 'h:mm a')} · </span>
                  {event.leads?.full_name || 'Consultation'}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
