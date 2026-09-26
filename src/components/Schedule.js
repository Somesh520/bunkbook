import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, MapPin, BookOpen, Sun, BedDouble, UserRound } from 'lucide-react';
import { dataService } from '../services/api';

const parseScheduleDate = (value) => {
  if (!value) return null;
  const [datePart, timePart = '00:00:00'] = value.split(' ');
  const parts = datePart.split(/[/-]/).map(Number);
  let date;

  if (parts.length === 3) {
    const [first, second, third] = parts;
    date = String(first).length === 4
      ? new Date(first, second - 1, third)
      : new Date(third, second - 1, first);
    const [hours, minutes, seconds = 0] = timePart.split(':').map(Number);
    date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
  } else {
    date = new Date(value);
  }

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateKey = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

const getNext7Days = () => Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + index);
  return date;
});

const formatTime = (value) => {
  const date = parseScheduleDate(value);
  return date ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Time unavailable';
};

const formatLongDate = (date) => date.toLocaleDateString('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const Schedule = ({ dark }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const days = useMemo(() => getNext7Days(), []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setEvents(await dataService.getWeeklySchedule());
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load schedule.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const selectedKey = formatDateKey(selectedDate);
  const selectedEvents = events
    .filter((event) => {
      const start = parseScheduleDate(event.start);
      return start && formatDateKey(start) === selectedKey;
    })
    .sort((first, second) => parseScheduleDate(first.start) - parseScheduleDate(second.start));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="flex items-center gap-3 text-3xl font-extrabold text-gray-900 dark:text-white">
          Schedule <CalendarDays className="h-8 w-8 text-blue-500" />
        </h2>
        <p className="mt-2 font-medium text-gray-500 dark:text-gray-400">{formatLongDate(selectedDate)}</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {days.map((day) => {
          const isSelected = formatDateKey(day) === selectedKey;
          return (
            <button
              key={formatDateKey(day)}
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`min-w-[72px] rounded-2xl border px-3 py-3 text-center transition-all ${isSelected
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 dark:border-gray-800 dark:bg-[#09090b] dark:text-slate-200'
              }`}
            >
              <span className={`block text-xs font-bold uppercase ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="mt-1 block text-xl font-extrabold">{day.getDate()}</span>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-[#09090b]" />)}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {!isLoading && !error && selectedEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-[#09090b]">
          <BedDouble className="h-20 w-20 text-gray-400 dark:text-slate-500" />
          <h3 className="mt-5 text-xl font-bold text-gray-700 dark:text-slate-200">No Schedule Found</h3>
          <p className="mt-2 text-gray-500 dark:text-slate-400">Select another date or enjoy your day.</p>
        </div>
      )}

      {!isLoading && !error && selectedEvents.length > 0 && (
        <div className="space-y-4">
          {selectedEvents.map((event, index) => {
            if (event.type === 'HOLIDAY') {
              return (
                <div key={`${event.start}-${index}`} className="flex items-start gap-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-200 p-5 dark:border-orange-900/50 dark:from-orange-950/50 dark:to-orange-900/40">
                  <Sun className="mt-1 h-7 w-7 flex-shrink-0 text-orange-500" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-orange-700 dark:text-orange-300">Relax & Chill</p>
                    <h3 className="mt-1 text-xl font-bold text-orange-900 dark:text-orange-100">{event.title || 'Holiday'}</h3>
                    <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">{event.content || 'Public Holiday'}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={`${event.start}-${event.courseCode}-${index}`} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#09090b]">
                <div className="flex flex-col items-center text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-6 w-6" />
                  <div className="mt-3 w-0.5 flex-1 bg-gray-200 dark:bg-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                    <Clock3 className="h-4 w-4" />
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{event.courseName || event.courseCode || 'Class'}</h3>
                  {event.facultyName && <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><UserRound className="h-4 w-4" />{event.facultyName}</p>}
                  <p className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400"><MapPin className="h-4 w-4" />{event.classRoom || 'N/A'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Schedule;
