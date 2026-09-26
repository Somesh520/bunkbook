import React, { useEffect, useState } from 'react';
import { dataService } from '../services/api';
import { Calendar, Award, Loader2 } from 'lucide-react';

const ExamSection = ({ dark }) => {
  const [schedule, setSchedule] = useState([]);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'score'

  useEffect(() => {
    const fetchExamData = async () => {
      setIsLoading(true);
      try {
        const [examSched, examScore] = await Promise.all([
          dataService.getExamSchedule(),
          dataService.getExamScore()
        ]);
        setSchedule(examSched || []);
        setScore(examScore || null);
      } catch (e) {
        console.error("Failed to load exam data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExamData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Exam Schedule
            </div>
          </button>
          <button
            onClick={() => setActiveTab('score')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'score'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Exam Scores
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-[#09090b] shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {schedule.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#09090b] divide-y divide-gray-200 dark:divide-gray-700">
                    {schedule.map((exam, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {exam.strExamDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <div className="font-medium text-blue-600 dark:text-blue-400">{exam.courseCode}</div>
                          <div>{exam.courseName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{exam.evalLevelComponentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {exam.strExamTime || 'TBA'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {exam.examVenueName || 'TBA'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {exam.examMode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No upcoming exams scheduled.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'score' && (
          <div className="space-y-6">
            {score ? (
              <>
                <div className="bg-white dark:bg-[#09090b] shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{score.fullName}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Enrollment No: {score.enrollmentNo || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-center min-w-[150px]">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Overall CGPA</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{score.cgpa?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>

                {score.studentSemesterWiseMarksDetailsList?.map((semester, sIdx) => (
                  <div key={sIdx} className="bg-white dark:bg-[#09090b] shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121214] flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{semester.semesterName}</h3>
                      <div className="font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 px-3 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-600">
                        SGPA: {semester.sgpa?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subject</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Grade</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#09090b] divide-y divide-gray-200 dark:divide-gray-700">
                          {semester.studentMarksDetailsDTO?.map((sub, idx) => {
                            // Extract primary grade
                            let grade = 'N/A';
                            if (sub.courseCompDTOList?.length > 0 && sub.courseCompDTOList[0].compSessionLevelMarks?.length > 0) {
                                grade = sub.courseCompDTOList[0].compSessionLevelMarks[0].grade;
                            }
                            
                            const isPass = sub.resultSort === 'PASS';
                            
                            return (
                              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                  <div className="font-medium text-gray-900 dark:text-white">{sub.courseCode}</div>
                                  <div className="text-xs">{sub.courseName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900 dark:text-white">
                                  {grade}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isPass ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                    {sub.resultSort || 'N/A'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-[#09090b] shadow-sm rounded-lg border border-gray-200 dark:border-gray-800">
                <Award className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No exam scores available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSection;
