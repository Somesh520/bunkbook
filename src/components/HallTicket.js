import React, { useEffect, useState } from 'react';
import { dataService } from '../services/api';
import { FileText, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const HallTicket = ({ profile }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState('');

  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoadingSessions(true);
      setError('');
      try {
        // Fallback to studentId 1 if profile doesn't have it directly exposed
        // Real implementation should ensure studentId is available.
        const sId = profile?.studentId || localStorage.getItem('studentId');
        console.log(sId)

        if (sId) {
          const data = await dataService.getExamSession(sId);
          setSessions(data || []);
          if (data && data.length > 0) {
            setSelectedSessionId(data[0].sessionId.toString());
          }
        } else {
          // Attempt generic fetch if studentId missing
          const data = await dataService.getExamSession(1); // placeholder
          setSessions(data || []);
        }
      } catch (err) {
        setError('Failed to load exam sessions.');
      } finally {
        setIsLoadingSessions(false);
      }
    };
    fetchSessions();
  }, [profile]);

  // 2. Fetch options when session changes
  useEffect(() => {
    if (!selectedSessionId) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      setError(''); // Clear previous errors
      try {
        const data = await dataService.getHallTicketOptions(selectedSessionId);
        setOptions(data || []);
        if (data && data.length > 0) {
          // Attempt to find the correct ID field (could be id, hallTicketId, or optionId)
          const firstId = data[0].id || data[0].hallTicketId || data[0].optionId;
          setSelectedOptionId(firstId ? firstId.toString() : '');
        } else {
          setSelectedOptionId('');
        }
      } catch (err) {
        setOptions([]);
        setError(`Failed to fetch options: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [selectedSessionId]);

  const handleDownload = async () => {
    if (!selectedOptionId) {
      setError("Please select a hall ticket option.");
      return;
    }

    setIsDownloading(true);
    setError('');
    setSuccess('');

    try {
      const selectedOption = options.find(o => {
        const val = o.id || o.hallTicketId || o.optionId;
        return val?.toString() === selectedOptionId;
      });
      const title = selectedOption ? (selectedOption.title || selectedOption.name || selectedOption.hallTicketName || 'Hall_Ticket') : 'Hall_Ticket';

      await dataService.downloadHallTicketPDF(selectedOptionId, title);
      setSuccess("Hall ticket downloaded successfully!");

      // clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || "Failed to download hall ticket.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-[#09090b] shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121214]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Download Hall Ticket
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select your exam session to generate and download your official hall ticket.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
            </div>
          )}

          {isLoadingSessions ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No exam sessions currently available.</p>
            </div>
          ) : (
            <div className="space-y-5 max-w-md mx-auto">

              {/* Session Dropdown */}
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Session
                </label>
                <select
                  id="session"
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  {sessions.map(s => (
                    <option key={s.sessionId} value={s.sessionId}>{s.sessionName}</option>
                  ))}
                </select>
              </div>

              {/* Options Dropdown */}
              <div>
                <label htmlFor="option" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                  <span>Hall Ticket Type</span>
                  {isLoadingOptions && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                </label>
                <select
                  id="option"
                  value={selectedOptionId}
                  onChange={(e) => setSelectedOptionId(e.target.value)}
                  disabled={isLoadingOptions || options.length === 0}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
                >
                  {options.length === 0 ? (
                    <option value="">No options available</option>
                  ) : (
                    options.map((o, idx) => {
                      const val = o.id || o.hallTicketId || o.optionId || idx;
                      const label = o.title || o.name || o.hallTicketName || `Option ${idx + 1}`;
                      return (
                        <option key={val} value={val}>{label}</option>
                      );
                    })
                  )}
                </select>
              </div>

              {/* Download Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!selectedOptionId || isDownloading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Download Hall Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallTicket;
