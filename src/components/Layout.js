import React from 'react';
import { BookOpen, User, LogOut, Sun, Moon, LayoutDashboard, FileText, FileBadge, Calendar, Plane, Smartphone } from 'lucide-react';
import BunkbookLogo from '../assets/logos.png';

const Layout = ({ children, onLogout, dark, setDark, currentTab, setCurrentTab, profile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Attendance', icon: <LayoutDashboard className="h-4 w-4 mr-1.5" /> },
    { id: 'simulator', label: 'Trip Simulator', icon: <Plane className="h-4 w-4 mr-1.5" /> },
    { id: 'exam', label: 'Exam & Scores', icon: <FileBadge className="h-4 w-4 mr-1.5" /> },
    { id: 'hallticket', label: 'Hall Tickets', icon: <FileText className="h-4 w-4 mr-1.5" /> },
    { id: 'about', label: 'About', icon: <User className="h-4 w-4 mr-1.5" /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${dark ? 'bg-slate-900 text-slate-50' : 'bg-gray-50 text-gray-900'} font-sans pb-20 sm:pb-10`}>
      {/* Top Navbar */}
      <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 backdrop-blur-xl ${dark ? 'bg-slate-900/80 border-slate-800 shadow-slate-900/20' : 'bg-white/80 border-gray-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="mr-3 transition-transform group-hover:scale-105">
                <img src={BunkbookLogo} alt="Bunkbook Logo" className="h-8 w-8 object-contain rounded-xl shadow-sm" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight truncate">Bunkbook</span>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/Somesh520/Kietkt/releases/download/v1.1.6/BunkBook.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none transition-all active:scale-95"
              >
                <Smartphone className="h-4 w-4 mr-1.5" /> <span>Get App</span>
              </a>

              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-full bg-gray-100/80 dark:bg-slate-800/80 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                aria-label="Toggle Dark Mode"
              >
                {dark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>

              {profile && (
                <div className="hidden sm:flex items-center text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700">
                  <User className="h-4 w-4 mr-2 text-gray-500 dark:text-slate-400" />
                  <span className="truncate max-w-[120px]">{profile.fullName?.split(' ')[0] || 'Student'}</span>
                </div>
              )}

              <button
                onClick={onLogout}
                className="inline-flex items-center px-2 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-full text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none transition-all active:scale-95"
              >
                <LogOut className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on mobile, centered on desktop) */}
        <div className={`border-t transition-colors duration-300 ${dark ? 'border-slate-800' : 'border-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide py-3 sm:justify-center">
              {navItems.map((item) => {
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`whitespace-nowrap flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${active
                      ? (dark ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-900 text-white shadow-md')
                      : (dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className={`py-6 text-center text-sm font-medium transition-colors duration-300 ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
        <p>
          Made with ❤️ by{' '}
          <a
            href="https://instagram.com/someshxd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            @someshxd
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
