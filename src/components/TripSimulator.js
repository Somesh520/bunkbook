import React, { useEffect, useState } from 'react';
import { dataService } from '../services/api';
import { Plane, AlertTriangle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const parseCustomDate = (dateString) => {
  try {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
  } catch(e) {
    return new Date();
  }
};

const getNext14Days = () => {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
};

const isSameDay = (d1, d2) => {
  if (!d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isBetweenDays = (d, start, end) => {
  if (!start || !end) return false;
  return d > start && d < end;
};

const TripSimulator = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);

  const dateList = getNext14Days();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sched = await dataService.getWeeklySchedule();
        const rCourses = await dataService.getRegisteredCourses();
        setTimetable(sched || []);
        setCourses(rCourses || []);
      } catch (err) {
        console.error('Error fetching simulator data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Default select today and tomorrow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(today.getDate() + 1);
    setSelectedStart(today);
    setSelectedEnd(tomorrow);
  }, []);

  const handleDatePress = (date) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      if (date >= selectedStart) {
        setSelectedEnd(date);
      } else {
        setSelectedStart(date);
        setSelectedEnd(null);
      }
    }
  };

  const getScheduleMap = () => {
    const map = {};
    timetable.forEach((event) => {
      if (event.courseCode) {
        try {
          const date = parseCustomDate(event.start);
          const dayOfWeek = date.getDay();
          if (!map[dayOfWeek]) map[dayOfWeek] = {};
          
          const code = event.courseCode.trim().toUpperCase();
          map[dayOfWeek][code] = (map[dayOfWeek][code] || 0) + 1;
        } catch (e) {}
      }
    });
    return map;
  };

  const calculateMissedLectures = () => {
    const map = getScheduleMap();
    const missed = {};

    if (!selectedStart) return missed;

    const current = new Date(selectedStart);
    const end = selectedEnd ? new Date(selectedEnd) : new Date(selectedStart);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const daySchedule = map[dayOfWeek];
      if (daySchedule) {
        Object.keys(daySchedule).forEach((code) => {
          missed[code] = (missed[code] || 0) + daySchedule[code];
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return missed;
  };

  const getSimulationResults = () => {
    const missed = calculateMissedLectures();
    return courses.map((course) => {
      const code = course.courseCode?.trim().toUpperCase();
      let missedCount = missed[code] || 0;

      if (missedCount === 0 && course.courseName) {
        const namePart = course.courseName.toLowerCase();
        Object.keys(missed).forEach((mCode) => {
          const matchingEvent = timetable.find(e => e.courseCode === mCode);
          if (matchingEvent && matchingEvent.courseName && namePart.includes(matchingEvent.courseName.toLowerCase())) {
            missedCount = missed[mCode];
          }
        });
      }

      const details = course.studentCourseCompDetails?.[0];
      const present = details?.presentLecture || 0;
      const total = details?.totalLecture || 0;

      const currentPerc = total > 0 ? (present / total) * 100 : 100;
      const projectedTotal = total + missedCount;
      const projectedPerc = projectedTotal > 0 ? (present / projectedTotal) * 100 : 100;

      return {
        courseCode: course.courseCode,
        courseName: course.courseName,
        currentPresent: present,
        currentTotal: total,
        currentPerc,
        projectedTotal,
        projectedPerc,
        missedCount,
      };
    });
  };

  const simulationResults = getSimulationResults();
  
  const getSuggestions = () => {
    const dangerCourses = simulationResults.filter(r => r.projectedPerc < 75);
    const warningCourses = simulationResults.filter(r => r.projectedPerc >= 75 && r.projectedPerc < 80);

    if (dangerCourses.length > 0) {
      const names = dangerCourses.map(c => c.courseName?.split(' ')[0]).join(', ');
      return {
        text: `Bunking these dates will drop your attendance below 75% in: ${names}. Consider attending some lectures.`,
        type: 'danger',
      };
    } else if (warningCourses.length > 0) {
      return {
        text: `Your attendance will stay above 75%, but will drop close to warning thresholds. Safe to go, but be careful!`,
        type: 'warning',
      };
    } else {
      return {
        text: `Great! You can take this trip safely. Your attendance will remain comfortably above 75%. Enjoy your trip!`,
        type: 'success',
      };
    }
  };

  const suggestion = getSuggestions();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-48 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-96"></div>
        </div>

        {/* Date Selector Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-32 mb-6"></div>
          <div className="flex space-x-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[70px] h-[90px] bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
            ))}
          </div>
        </div>

        {/* Suggestion Skeleton */}
        <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>

        {/* Results Skeleton */}
        <div>
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-lg w-40 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          Trip Simulator <Plane className="text-blue-500 w-8 h-8" />
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Select your trip dates to see how it affects your attendance.</p>
      </div>

      {/* Date Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/50">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Choose Bunk Dates</h3>
        <div className="flex overflow-x-auto hide-scrollbar space-x-3 pb-4">
          {dateList.map((item, index) => {
            const isStart = isSameDay(item, selectedStart);
            const isEnd = isSameDay(item, selectedEnd);
            const isBetween = isBetweenDays(item, selectedStart, selectedEnd);
            
            const dayName = item.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = item.getDate();
            const monthName = item.toLocaleDateString('en-US', { month: 'short' });

            let bgClass = "bg-gray-50 dark:bg-slate-700/50 border-gray-100 dark:border-slate-700";
            let textClass = "text-gray-900 dark:text-white";
            let subTextClass = "text-gray-500 dark:text-gray-400";
            
            if (isStart || isEnd) {
              bgClass = "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30";
              textClass = "text-white";
              subTextClass = "text-blue-100";
            } else if (isBetween) {
              bgClass = "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800/50";
              textClass = "text-blue-700 dark:text-blue-300";
              subTextClass = "text-blue-500 dark:text-blue-400";
            }

            return (
              <button
                key={index}
                onClick={() => handleDatePress(item)}
                className={`relative flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-2xl border transition-all duration-200 ${bgClass}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${subTextClass}`}>{monthName}</span>
                <span className={`text-xl font-extrabold my-0.5 ${textClass}`}>{dayNum}</span>
                <span className={`text-xs font-medium ${subTextClass}`}>{dayName}</span>
                
                {isStart && <div className="absolute -bottom-2 bg-green-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">Start</div>}
                {isEnd && <div className="absolute -bottom-2 bg-red-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">End</div>}
              </button>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedStart && (
          <div className="mt-6 flex items-center justify-center bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-gray-100 dark:border-slate-700/50">
            <div className="text-center flex-1">
              <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">TRIP START</div>
              <div className="font-bold text-gray-900 dark:text-white">
                {selectedStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
            <div className="text-center flex-1">
              <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">TRIP END</div>
              <div className="font-bold text-gray-900 dark:text-white">
                {selectedEnd ? selectedEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' }) : 'Select End Date'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Card */}
      <div className={`flex items-start p-5 rounded-2xl border shadow-sm ${
        suggestion.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' :
        suggestion.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50' :
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
      }`}>
        {suggestion.type === 'danger' && <AlertTriangle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />}
        {suggestion.type === 'warning' && <AlertCircle className="w-6 h-6 text-amber-500 mr-4 flex-shrink-0" />}
        {suggestion.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />}
        
        <p className={`font-semibold leading-relaxed ${
          suggestion.type === 'danger' ? 'text-red-700 dark:text-red-300' :
          suggestion.type === 'warning' ? 'text-amber-700 dark:text-amber-300' :
          'text-green-700 dark:text-green-300'
        }`}>
          {suggestion.text}
        </p>
      </div>

      {/* Results List */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Projected Attendance</h3>
        <div className="space-y-4">
          {simulationResults.map((result, idx) => {
            const drop = result.currentPerc - result.projectedPerc;
            const isDanger = result.projectedPerc < 75;
            const isWarning = result.projectedPerc >= 75 && result.projectedPerc < 80;

            return (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{result.courseCode}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{result.courseName}</h4>
                  </div>
                  {result.missedCount > 0 ? (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                      -{result.missedCount} Classes
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
                      0 Missed
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-3 border-t border-gray-50 dark:border-slate-700/50">
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Current</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {result.currentPresent}/{result.currentTotal} ({result.currentPerc.toFixed(1)}%)
                    </div>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 mx-4" />
                  
                  <div className="flex-1 text-right">
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Projected</div>
                    <div className={`font-bold ${isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-green-500'}`}>
                      {result.currentPresent}/{result.projectedTotal} ({result.projectedPerc.toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {drop > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50 dark:border-slate-700/50 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Will drop by <span className="font-bold text-red-500">-{drop.toFixed(1)}%</span> if you bunk
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripSimulator;
