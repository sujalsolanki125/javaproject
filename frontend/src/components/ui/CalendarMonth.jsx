import PropTypes from 'prop-types';
import { useMemo } from 'react';

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const pad = (value) => value.toString().padStart(2, '0');

const formatKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function CalendarMonth({
  monthDate,
  selectedDate,
  onMonthChange,
  onSelectDate,
  highlights = {}
}) {
  const { firstDay, daysInMonth, monthLabel, todayKey } = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const label = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const today = formatKey(new Date());
    return { firstDay: firstDayOfWeek, daysInMonth: totalDays, monthLabel: label, todayKey: today };
  }, [monthDate]);

  const selectedKey = selectedDate ? formatKey(selectedDate) : '';

  const renderDay = (day) => {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const key = formatKey(date);
    const hasLogs = Boolean(highlights[key]);
    const isSelected = key === selectedKey;
    const isToday = key === todayKey;

    return (
      <button
        key={day}
        type="button"
        onClick={() => onSelectDate?.(date)}
        className={`h-12 w-full text-sm font-medium leading-normal transition-colors ${
          hasLogs ? 'bg-primary/15 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
        } ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
      >
        <div
          className={`flex h-full w-full items-center justify-center rounded-full ${
            isSelected
              ? 'bg-primary text-black'
              : isToday
              ? 'border border-primary text-primary'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            {day}
            {hasLogs && (
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_3px_rgba(13,242,108,0.25)]"></span>
            )}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-background-dark/50">
      <div className="flex items-center justify-between p-1">
        <button
          type="button"
          onClick={() => onMonthChange?.(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <p className="flex-1 text-center text-base font-bold leading-tight dark:text-white">{monthLabel}</p>
        <button
          type="button"
          onClick={() => onMonthChange?.(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7">
        {dayNames.map((day) => (
          <p
            key={day}
            className="flex h-12 items-center justify-center text-center text-[13px] font-bold leading-normal text-slate-500 dark:text-slate-400"
          >
            {day}
          </p>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="h-12 w-full"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => renderDay(i + 1))}
      </div>
    </div>
  );
}

CalendarMonth.propTypes = {
  monthDate: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onMonthChange: PropTypes.func,
  onSelectDate: PropTypes.func,
  highlights: PropTypes.object
};
