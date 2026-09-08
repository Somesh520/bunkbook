import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE_URL = "/api";
const AUTH_TOKEN_KEY = 'authToken';

// --- API ENCRYPTION ---
const keyB64 = "NPdLWA5w7yFQhPeUuKmO/A==";
const ivB64 = "bV5V6nK4phvQG9ZhkAjugQ==";
const key = CryptoJS.enc.Base64.parse(keyB64);
const iv = CryptoJS.enc.Base64.parse(ivB64);

export function encryptText(text) {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Optional: Handle token refresh or logout here
            console.error("Authentication failed. Session may have expired.");
        }
        return Promise.reject(error);
    }
);

export const authService = {
  login: async (username, password) => {
    const payload = {
      userName: encryptText(username),
      password: encryptText(password),
      device: "WEB",
      version: null,
      reCaptchaToken: null
    };
    
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    };
    
    return axios.post(`${API_BASE_URL}/auth/encrypt/login`, payload, { headers, timeout: 15000 });
  },

  verifyOtp: async (otp, transactionId) => {
    const payload = {
      otp,
      transactionId,
      transactionID: transactionId,
      device: "WEB",
      version: null
    };
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    };

    return axios.post(`${API_BASE_URL}/auth/verify/otp`, payload, { headers, timeout: 15000 });
  },

  setToken: (token) => {
    let finalToken = token;
    if (finalToken.startsWith('"')) finalToken = JSON.parse(finalToken);
    if (!finalToken.includes('GlobalEducation')) finalToken = `GlobalEducation ${finalToken}`;
    localStorage.setItem(AUTH_TOKEN_KEY, finalToken);
  },

  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),

  isTokenExpired: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false; // Not a JWT
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Data Fetching Functions
export const dataService = {
  getDashboardAttendance: async () => {
    try {
      const response = await apiClient.get('/student/dashboard/attendance');
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to get dashboard attendance:', err);
      return null;
    }
  },

  getRegisteredCourses: async () => {
    try {
      const response = await apiClient.get('/student/dashboard/registered-courses');
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to get registered courses:', err);
      return [];
    }
  },

  getAttendanceAndDetails: async () => {
    try {
      const response = await apiClient.get('/attendance/course/component/student');
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to get attendance details:', err);
      return null;
    }
  },

  getStudentProfileInfo: async () => {
    try {
      const response = await apiClient.get('/info/student/fetch');
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to get profile info:', err);
      return null;
    }
  },

  getLectureWiseAttendance: async (studentId, courseId, courseCompId) => {
    try {
      const response = await apiClient.post('/attendance/schedule/student/course/attendance/percentage', {
        studentId,
        courseId,
        courseCompId
      });
      return response.data?.data?.[0]?.lectureList || [];
    } catch (err) {
      console.error('Lecture detail fetch failed:', err);
      return [];
    }
  },

  getExamSchedule: async () => {
    try {
      const response = await apiClient.get('/exam/schedule/student/exams');
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to fetch exam schedule:', err);
      return [];
    }
  },

  getExamSession: async (studentId) => {
    try {
      const response = await apiClient.get(`/exam/form/session/config/getById/student/${studentId}`);
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to fetch exam sessions:', err);
      return [];
    }
  },

  getHallTicketOptions: async (sessionId) => {
    try {
      const response = await apiClient.get(`/exam/hall-ticket/student/download/options/${sessionId}`);
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to fetch hall ticket options:', err);
      return [];
    }
  },

  downloadHallTicketPDF: async (hallTicketId, title) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get(`${API_BASE_URL}/report/pdf/exam/student/hall-ticket/download/${hallTicketId}`, {
        headers: { 'Authorization': token },
        responseType: 'blob'
      });

      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${cleanTitle}.pdf`;

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (err) {
      console.error("Download Error:", err);
      throw new Error(err.message || "Failed to download Hall Ticket PDF");
    }
  },

  getExamScore: async () => {
    try {
      const response = await apiClient.get('/exam/score/get/score');
      return response.data?.data || null;
    } catch (err) {
      console.error("Failed to fetch exam score:", err);
      return null;
    }
  },

  getWeeklySchedule: async () => {
    try {
      const getFormattedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDateObj = new Date();
      // Look back a bit to catch earlier classes in the week, and forward 14 days for simulator
      startDateObj.setDate(startDateObj.getDate() - 2); 
      const endDateObj = new Date();
      endDateObj.setDate(startDateObj.getDate() + 16);

      const weekStartDate = getFormattedDate(startDateObj);
      const weekEndDate = getFormattedDate(endDateObj);

      const url = `/student/schedule/class?weekEndDate=${weekEndDate}&weekStartDate=${weekStartDate}`;
      const response = await apiClient.get(url);
      
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to get weekly schedule:', err);
      return [];
    }
  },

  getProfilePhoto: async (fullUrl) => {
    try {
      // Extract the path after '/api' to use the local proxy
      let path = fullUrl;
      const apiIndex = fullUrl.indexOf('/api');
      if (apiIndex !== -1) {
        path = fullUrl.substring(apiIndex + 4);
      }
      
      const response = await apiClient.get(path, {
        responseType: 'blob'
      });
      return window.URL.createObjectURL(new Blob([response.data]));
    } catch (err) {
      console.error('Failed to get profile photo:', err);
      return null;
    }
  }
};
