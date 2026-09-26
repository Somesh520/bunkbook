import React, { useEffect, useState } from 'react';
import { authService, dataService } from '../services/api';
import { Activity, Loader2, X, Calendar, CheckCircle2, XCircle, FolderIcon } from 'lucide-react';
import Layout from './Layout';
import ExamSection from './ExamSection';
import HallTicket from './HallTicket';
import About from './About';
import TripSimulator from './TripSimulator';
import Schedule from './Schedule';

const parseScheduleDate = (dateString) => {
  if (!dateString) return null;

  const [datePart, timePart = '00:00:00'] = dateString.split(' ');
  const dateParts = datePart.split(/[/-]/).map(Number);
  let date;

  if (dateParts.length === 3) {
    const [first, second, third] = dateParts;
    const isYearFirst = String(first).length === 4;
    date = isYearFirst
      ? new Date(first, second - 1, third)
      : new Date(third, second - 1, first);
    const [hours, minutes, seconds = 0] = timePart.split(':').map(Number);
    date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
  } else {
    date = new Date(dateString);
  }

  return Number.isNaN(date.getTime()) ? null : date;
};

const isToday = (date) => {
  const today = new Date();
  return date && date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
};

const getTodayAttendanceStatuses = async (courses) => {
  const statuses = {};

  try {
    const schedule = await dataService.getWeeklySchedule();
    const todayClasses = schedule.filter((event) => {
      const start = parseScheduleDate(event.start);
      return isToday(start) && event.type !== 'HOLIDAY' && event.courseCode;
    });

    await Promise.all(courses.map(async (course) => {
      const courseCode = course.courseCode?.trim().toUpperCase();
      const courseName = course.courseName?.toLowerCase() || '';
      const courseIsTheory = !/(lab|practical|project)/i.test(courseName);
      const scheduledClasses = todayClasses.filter((event) => {
        const eventName = event.courseName?.toLowerCase() || '';
        const eventIsTheory = !/(lab|practical|project)/i.test(eventName);
        return event.courseCode?.trim().toUpperCase() === courseCode && eventIsTheory === courseIsTheory;
      });

      if (scheduledClasses.length === 0) return;

      const hasUpcomingClass = scheduledClasses.some((scheduledClass) => {
        const endTime = parseScheduleDate(scheduledClass.end) || (() => {
          const startTime = parseScheduleDate(scheduledClass.start);
          return startTime ? new Date(startTime.getTime() + 60 * 60 * 1000) : null;
        })();
        return endTime && new Date() < endTime;
      });

      if (hasUpcomingClass) {
        statuses[course.courseId] = 'SCHEDULED';
        return;
      }

      const components = course.studentCourseCompDetails || [];
      for (const component of components) {
        const lectures = await dataService.getLectureWiseAttendance(
          course.studentId,
          course.courseId,
          component.courseCompId
        );
        const todayRecord = lectures.find((lecture) => isToday(parseScheduleDate(lecture.planLecDate)));
        const attendance = todayRecord?.attendance?.toUpperCase();
        if (attendance === 'PRESENT' || attendance === 'ABSENT') {
          statuses[course.courseId] = attendance;
          return;
        }
      }

      statuses[course.courseId] = 'PENDING';
    }));
  } catch (error) {
    console.error('Failed to fetch today attendance statuses:', error);
  }

  return statuses;
};

const AttendanceView = ({ attendance, courses, openCourseDetails, profile, todayStatuses }) => {
  const [photoUrl, setPhotoUrl] = React.useState(null);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    if (profile?.profilePhoto) {
      dataService.getProfilePhoto(profile.profilePhoto).then(url => {
        if (url) {
          setPhotoUrl(url);
        } else {
          setImgError(true);
        }
      });
    }
  }, [profile?.profilePhoto]);

  // Safe checks for attendance
  const presentPerc = attendance?.presentPerc || 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Combined Profile & Attendance Card */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800/80 rounded-3xl shadow-sm p-6 sm:p-8 relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          {/* Profile Section */}
          {profile && (
            <div className="flex items-center">
              <div className="mr-5 sm:mr-6 flex-shrink-0 relative">
                 {photoUrl && !imgError ? (
                   <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#09090b]">
                     <img 
                       src={photoUrl} 
                       alt="Profile" 
                       className="w-full h-full rounded-full object-cover" 
                       onError={() => setImgError(true)}
                     />
                   </div>
                 ) : (
                   <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#09090b] bg-blue-900/50 flex items-center justify-center text-blue-400 text-3xl font-bold">
                     {profile.fullName?.charAt(0) || 'U'}
                   </div>
                 )}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{profile.fullName}</h3>
                <div className="flex flex-col mt-2 gap-1.5">
                  <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{profile.registrationNumber}</p>
                  {(() => {
                    const sem = profile.semester || profile.currentSemester || profile.studentPersonalInformation?.semester || profile.studentPersonalInformation?.currentSemester;
                    const year = profile.year || profile.currentYear || profile.studentPersonalInformation?.year || profile.studentPersonalInformation?.currentYear;
                    
                    const parts = [];
                    if (year) parts.push(`Year ${year}`);
                    if (sem) parts.push(`Sem ${sem}`);
                    
                    if (parts.length > 0) {
                      return (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 w-fit">
                          {parts.join(' • ')}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Overall Attendance Circular Progress */}
          {attendance ? (
            <div className="flex flex-col items-center justify-center relative mt-2 sm:mt-0">
               <div className="flex items-center justify-center relative">
                  <svg className="w-32 h-32 sm:w-36 sm:h-36 transform -rotate-90" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-slate-800" />
                    <circle
                      cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray={377} strokeDashoffset={377 - (377 * presentPerc) / 100}
                      className="text-blue-500 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-gray-900 dark:text-white">{presentPerc.toFixed(1)}%</span>
                  </div>
               </div>
               <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-slate-400 flex items-center">
                 <Activity className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" /> Overall Attendance
               </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full sm:w-auto">
               <p className="text-sm text-gray-500 dark:text-slate-400">Attendance data not available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Subjects Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Subject-wise Breakdown</h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{courses.length} Subjects</span>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => {
          let totalLectures = 0;
          let presentLectures = 0;
          
          if (course.studentCourseCompDetails && course.studentCourseCompDetails.length > 0) {
            course.studentCourseCompDetails.forEach(comp => {
              totalLectures += comp.totalLecture || 0;
              presentLectures += comp.presentLecture || 0;
            });
          }

          const percentage = totalLectures > 0 ? ((presentLectures / totalLectures) * 100) : 0;
          const isDanger = percentage < 75;
          const todayStatus = todayStatuses[course.courseId];

          let bunkStatus = null;
          if (totalLectures > 0) {
            if (percentage >= 75) {
              const canBunk = Math.floor((presentLectures / 0.75) - totalLectures);
              bunkStatus = canBunk > 0 
                ? { text: `You can bunk ${canBunk} class${canBunk > 1 ? 'es' : ''}`, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' }
                : { text: "On track, don't bunk next class", color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-700' };
            } else {
              const needToAttend = Math.ceil(((0.75 * totalLectures) - presentLectures) / 0.25);
              bunkStatus = { text: `Must attend next ${needToAttend} class${needToAttend > 1 ? 'es' : ''}`, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30' };
            }
          }

          return (
            <div 
              key={idx} 
              onClick={() => openCourseDetails(course)}
              className="flex flex-col gap-3 p-5 bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-[#121214] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{course.courseCode}</span>
                </div>
                {todayStatus && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                    todayStatus === 'PRESENT' ? 'bg-green-100/50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' :
                    todayStatus === 'ABSENT' ? 'bg-red-100/50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' :
                    todayStatus === 'SCHEDULED' ? 'bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' :
                    'bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50'
                  }`}>
                    {todayStatus === 'PRESENT' ? 'Present Today' :
                      todayStatus === 'ABSENT' ? 'Absent Today' :
                      todayStatus === 'SCHEDULED' ? 'Upcoming' : 'No Data'}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 mt-1">
                <h3 className="font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.courseName}
                </h3>
                {bunkStatus && (
                  <div className="pt-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-current/10 ${bunkStatus.bg} ${bunkStatus.color}`}>
                      {bunkStatus.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Open
                </button>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Attended: <strong className="text-gray-900 dark:text-gray-100">{presentLectures}/{totalLectures}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 dark:bg-[#09090b] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${!isDanger ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = ({ onLogout, dark, setDark }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [attendance, setAttendance] = useState(null);
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [todayStatuses, setTodayStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Attendance
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isLecturesLoading, setIsLecturesLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashAtt, regCourses, profileInfo] = await Promise.all([
          dataService.getDashboardAttendance(),
          dataService.getRegisteredCourses(),
          dataService.getStudentProfileInfo()
        ]);
        
        if (dashAtt) setAttendance(dashAtt);
        if (regCourses) setCourses(regCourses);
        if (profileInfo) setProfile(profileInfo);
        setTodayStatuses(await getTodayAttendanceStatuses(regCourses || []));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const openCourseDetails = async (course) => {
    setSelectedCourse(course);
    setIsLecturesLoading(true);
    setLectures([]);
    try {
      const comp = course.studentCourseCompDetails?.[0];
      if (comp && course.studentId) {
        const data = await dataService.getLectureWiseAttendance(course.studentId, course.courseId, comp.courseCompId);
        setLectures(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLecturesLoading(false);
    }
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
    setLectures([]);
  };

  if (isLoading) {
    return (
      <Layout 
        onLogout={handleLogout} 
        dark={dark} 
        setDark={setDark} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        profile={profile}
      >
        <div className="space-y-8 animate-pulse pt-6">
          {/* Hero Skeleton */}
          <div className="h-48 bg-gray-200 dark:bg-[#09090b] rounded-3xl w-full"></div>
          
          {/* Subjects Grid Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 dark:bg-[#09090b] rounded-lg w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-white dark:bg-[#09090b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      onLogout={handleLogout} 
      dark={dark} 
      setDark={setDark} 
      currentTab={currentTab} 
      setCurrentTab={setCurrentTab}
      profile={profile}
    >
      {currentTab === 'dashboard' && (
        <AttendanceView 
          attendance={attendance} 
          courses={courses} 
          openCourseDetails={openCourseDetails} 
          profile={profile}
          todayStatuses={todayStatuses}
        />
      )}
      
      {currentTab === 'simulator' && <TripSimulator />}

      {currentTab === 'schedule' && <Schedule dark={dark} />}
      
      {currentTab === 'exam' && <ExamSection dark={dark} />}
      
      {currentTab === 'hallticket' && <HallTicket profile={profile} />}
      
      {currentTab === 'about' && <About profile={profile} />}

      {/* Lecture Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 sm:p-0 transition-opacity">
          <div className="bg-white dark:bg-[#09090b] rounded-lg shadow-xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#121214]">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedCourse.courseName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCourse.courseCode} - Lecture History</p>
              </div>
              <button 
                onClick={closeCourseDetails}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
              {isLecturesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              ) : lectures.length > 0 ? (
                <div className="space-y-3">
                  {[...lectures]
                    .sort((a, b) => new Date(b.planLecDate) - new Date(a.planLecDate))
                    .map((lecture, i) => {
                    const isPresent = lecture.attendance?.toUpperCase() === 'PRESENT';
                    
                    // Format date (e.g. "2026-08-21" -> "Aug 21")
                    let formattedDate = lecture.planLecDate;
                    try {
                      if (formattedDate) {
                        const d = new Date(formattedDate);
                        if (!isNaN(d.getTime())) {
                          formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }
                      }
                    } catch(e) {}

                    return (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border flex items-start animate-fade-in-up ${isPresent ? 'border-green-100 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/20' : 'border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/20'}`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="mr-4 mt-0.5">
                          {isPresent ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between flex-wrap gap-2">
                            <span className={`font-semibold text-sm ${isPresent ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              {lecture.attendance}
                            </span>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formattedDate}
                              </span>
                            </div>
                          </div>
                          {lecture.topicCovered && (
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {lecture.topicCovered}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No lecture records found for this course.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
