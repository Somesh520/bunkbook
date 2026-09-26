import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { Lock, User, AlertCircle, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import BunkbookLogo from '../assets/logos.png';

const isUuid = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());

const getTransactionId = (value) => {
  if (typeof value === 'string') {
    try {
      return getTransactionId(JSON.parse(value));
    } catch {
      const normalized = value.trim();
      return isUuid(normalized)
        ? normalized
        : '';
    }
  }
  if (!value || typeof value !== 'object') return '';

  for (const [key, candidate] of Object.entries(value)) {
    if (/^transaction[_-]?id$/i.test(key)) {
      const nestedId = getTransactionId(candidate);
      if (nestedId) return nestedId;
    }
    const nestedId = getTransactionId(candidate);
    if (nestedId) return nestedId;
  }

  return '';
};

const getAuthToken = (value) => {
  if (!value || typeof value !== 'object') return '';

  for (const [key, candidate] of Object.entries(value)) {
    if (/^(token|id_token)$/i.test(key) && typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
    const nestedToken = getAuthToken(candidate);
    if (nestedToken) return nestedToken;
  }

  return '';
};

const Login = ({ onLoginSuccess, dark }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('saved_username');
    const savedPass = localStorage.getItem('saved_password');
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSuccessMethod = (token) => {
    if (rememberMe) {
      localStorage.setItem('saved_username', username);
      localStorage.setItem('saved_password', password);
    } else {
      localStorage.removeItem('saved_username');
      localStorage.removeItem('saved_password');
    }

    authService.setToken(token);
    onLoginSuccess(token);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Username and password are required.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);
      const data = response.data;
      const receivedAuthToken = getAuthToken(data);
      const receivedTransactionId = getTransactionId(data);

      if (receivedAuthToken) {
        handleLoginSuccessMethod(receivedAuthToken);
      } else if (receivedTransactionId) {
        setTransactionId(receivedTransactionId);
        setOtpStep(true);
      } else if (typeof data?.message === 'string' && data.message.toLowerCase().includes('otp')) {
        setErrorMsg('Login did not return a transaction ID. Please try again.');
      } else {
        setErrorMsg('Login failed. Invalid response format.');
      }
    } catch (e) {
      const data = e.response?.data;
      const serverError = data?.error?.reason || data?.message || data?.error || e.message;
      setErrorMsg(String(serverError || 'An error occurred during login.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg('OTP is required.');
      return;
    }
    if (!transactionId) {
      setErrorMsg('Your login session expired. Please sign in again.');
      setOtpStep(false);
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await authService.verifyOtp(otp, transactionId);
      const data = response.data;
      const receivedAuthToken = getAuthToken(data);

      if (receivedAuthToken) {
        handleLoginSuccessMethod(receivedAuthToken);
      } else if (typeof data?.data === 'string' && data.data.length > 20) {
        handleLoginSuccessMethod(data.data);
      } else {
        setErrorMsg('OTP verification failed.');
      }
    } catch (e) {
      const data = e.response?.data;
      const serverError = data?.error?.reason || data?.message || data?.error || e.message;
      setErrorMsg(String(serverError || 'An error occurred verifying OTP.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className={`min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans ${dark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} relative overflow-hidden`}>

      {/* Decorative blobs */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${dark ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${dark ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
      <div><header className="py-4 text-center text-sm font-large text-blue-700 dark:text-blue-400">
        Download Our Native app for speed and convenience <a href="https://github.com/Somesh520/Kietkt/releases/tag/v1.1.6" target="_blank" rel="noopener noreferrer" className="text-red-500 dark:text-red-400 hover:underline">
          Download Now
        </a>
      </header></div>
      <div className="w-full max-w-md mx-auto relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white/10 dark:bg-[#121214] backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10 border border-white/20 dark:border-gray-800 transform hover:scale-105 transition-transform duration-300">
            <img src={BunkbookLogo} alt="Bunkbook Logo" className="h-16 w-16 object-contain" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-4xl font-extrabold tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Bunkbook</span>
          <div className="flex items-center justify-center text-lg mt-1 font-bold text-gray-500 dark:text-gray-400 gap-1.5">
            <span>for</span>
            <div className="flex items-center">
              <img src={BunkbookLogo} alt="K" className="h-[18px] w-auto object-contain -mr-0.5" />
              <span>IET</span>
            </div>
          </div>
        </h2>
        <p className={`mt-3 text-center text-sm font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
          {otpStep ? 'Enter the verification code sent to your device' : 'Sign in to access your academic dashboard'}
        </p>
      </div>

      <div className="mt-8 w-full max-w-md mx-auto relative z-10">
        <div className={`py-8 px-5 sm:px-10 shadow-2xl backdrop-blur-xl rounded-3xl border transition-colors duration-300 animate-fade-in-up ${dark ? 'bg-slate-800/80 border-slate-700/50 shadow-black/50' : 'bg-white/80 border-white shadow-xl shadow-blue-900/5'}`} style={{ animationDelay: '0.1s' }}>

          {errorMsg && (
            <div className={`mb-6 border rounded-2xl p-4 flex items-center shadow-inner ${dark ? 'bg-red-900/30 border-red-800/50' : 'bg-red-50 border-red-100'}`}>
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-red-700'}`}>{errorMsg}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={otpStep ? handleVerifyOtp : handleLogin}>
            {!otpStep ? (
              <>
                <div className="space-y-1">
                  <label htmlFor="username" className={`block text-sm font-bold ml-1 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Cybervidhya Credentials (202X....)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`block w-full pl-11 pr-4 py-3.5 sm:text-sm rounded-2xl border-2 transition-all outline-none focus:ring-4 focus:ring-blue-500/20 ${dark
                          ? 'bg-slate-900/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500'
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 hover:bg-gray-100'
                        }`}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className={`block text-sm font-bold ml-1 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full pl-11 pr-12 py-3.5 sm:text-sm rounded-2xl border-2 transition-all outline-none focus:ring-4 focus:ring-blue-500/20 ${dark
                          ? 'bg-slate-900/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500'
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 hover:bg-gray-100'
                        }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center cursor-pointer group relative">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${rememberMe
                          ? 'bg-blue-600 border-blue-600'
                          : dark ? 'border-slate-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-400'
                        }`}>
                        {rememberMe && (
                          <svg className="w-3.5 h-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`ml-3 text-sm font-medium transition-colors ${dark ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      Remember me
                    </span>
                  </label>


                </div>
              </>
            ) : (
              <div className="space-y-3 animate-fade-in-up flex flex-col items-center">
                <label className={`block text-sm font-bold w-full text-center ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Verification Code
                </label>
                <div className="pt-2">
                  <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>

                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">{otpStep ? 'Verify Authentication' : 'Secure Login'}</span>
                    {!otpStep && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Made with love by Somesh */}
      <div className="absolute bottom-4 w-full text-center z-10">
        <p className={`text-sm font-medium opacity-80 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
          Made with <span className="text-red-500 animate-pulse inline-block">❤️</span> by{' '}
          <a href="https://instagram.com/someshxd" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
            @someshxd
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
