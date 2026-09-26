import React from 'react';
import { User, LogOut, LayoutDashboard, FileText, FileBadge, Plane, Smartphone, CalendarDays, Code2, Star } from 'lucide-react';
import BunkbookLogo from '../assets/logos.png';
import { ThemeToggle } from './ThemeToggle';
import { GooeyNav } from './ui/gooey-nav';
import TechText from './ui/TechText';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { StickyBanner } from './ui/sticky-banner';

const Layout = ({ children, onLogout, dark, setDark, currentTab, setCurrentTab, profile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Attendance', icon: <LayoutDashboard className="h-4 w-4 mr-1.5" /> },
    { id: 'schedule', label: 'Schedule', icon: <CalendarDays className="h-4 w-4 mr-1.5" /> },
    { id: 'simulator', label: 'Trip Simulator', icon: <Plane className="h-4 w-4 mr-1.5" /> },
    { id: 'exam', label: 'Exam & Scores', icon: <FileBadge className="h-4 w-4 mr-1.5" /> },
    { id: 'hallticket', label: 'Hall Tickets', icon: <FileText className="h-4 w-4 mr-1.5" /> },
    { id: 'about', label: 'About', icon: <User className="h-4 w-4 mr-1.5" /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${dark ? 'bg-black text-slate-50' : 'bg-gray-50 text-gray-900'} font-sans pb-20 sm:pb-10`}>
      <StickyBanner className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <p className="mx-0 max-w-[90%] text-sm font-medium flex items-center justify-center gap-2 drop-shadow-sm text-center flex-wrap">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 hidden sm:block" />
          <span>If you like BunkBook, please consider starring our repo!</span>
          <a
            href="https://github.com/Somesh520/Kietkt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2 transition duration-200 hover:text-yellow-200"
          >
            Star the Repo
          </a>
        </p>
      </StickyBanner>

      {/* Top Navbar */}
      <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${dark ? 'bg-black border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="mr-3 transition-transform group-hover:scale-105">
                <img src={BunkbookLogo} alt="Bunkbook Logo" className="h-8 w-8 object-contain rounded-xl shadow-sm" />
              </div>
              <div className="h-8 w-48 sm:w-64">
                <TechText
                  text="Bunkbook for KIET"
                  fontSize={22}
                  fontWeight={700}
                  color={dark ? '#ffffff' : '#111827'}
                  accentColor={dark ? '#3b82f6' : '#2563eb'}
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-3">
              <HoverBorderGradient
                as="a"
                href="https://github.com/Somesh520/Kietkt/releases/download/v1.1.6/BunkBook.apk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download the BunkBook app"
                containerClassName="rounded-full"
                className="inline-flex items-center px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-[#09090b]"
              >
                <Smartphone className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Get App</span>
              </HoverBorderGradient>

              <HoverBorderGradient
                as="a"
                href="https://github.com/Somesh520/Kietkt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Star the BunkBook repository"
                containerClassName="rounded-full"
                className="inline-flex items-center px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-[#09090b]"
              >
                <Code2 className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Star Repo</span>
              </HoverBorderGradient>

              <ThemeToggle
                isDark={dark}
                onToggle={() => setDark(!dark)}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />



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
            <div className="flex overflow-x-auto scrollbar-hide py-3 sm:justify-center">
              <GooeyNav
                items={navItems}
                value={Math.max(0, navItems.findIndex(item => item.id === currentTab))}
                onChange={(index) => setCurrentTab(navItems[index].id)}
                size="sm"
                activeColor={dark ? "#2563eb" : "#111827"}
                activeLabelColor="#ffffff"
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </nav>



      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t transition-colors duration-300 ${dark ? 'border-slate-800 bg-slate-950/40' : 'border-gray-200 bg-white/60'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-7 sm:px-6 lg:px-8">
          <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a
              href="https://instagram.com/someshxd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              @someshxd
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
