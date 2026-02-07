import React from 'react';
import logo from '../assets/logos.png';
import ParticleText from './ParticleText';

function Hero({ isDark }) {
  return (
    <section
      className="relative w-full min-h-[100dvh] flex items-center px-4 sm:px-6 py-20 sm:py-32 overflow-x-hidden"
      data-aos="fade-up"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500/20 rounded-full blur-[80px] sm:blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-[80px] sm:blur-[100px] -z-10 animate-pulse-slow delay-1000"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

        {/* LEFT COLUMN: Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg" data-aos="fade-down">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">v1.1.3 Now Available</span>
          </div>

          {/* Particle Text */}
          <div className="w-full -ml-4 lg:-ml-8 transform scale-90 lg:scale-100 origin-center lg:origin-left">
            <ParticleText text="BunkBook" isDark={isDark} />
          </div>

          <div className="space-y-6 max-w-2xl relative">
            <div className="absolute -left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-20 hidden lg:block rounded-full"></div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
              Attendance Management, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Reimagined.</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed font-light">
              Stop worrying about attendance criteria. Let <span className="font-semibold text-blue-400">BunkBook</span> handle the math while you enjoy college life. Smart alerts, safe bunks, and seamless tracking.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" data-aos="fade-up" data-aos-delay="200">
              <a href="https://github.com/Somesh520/Kietkt/releases/download/v1.1.3/BunkBook.apk" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
                <button className="relative px-8 py-4 bg-gray-900 dark:bg-black text-white rounded-xl font-bold text-lg shadow-2xl flex items-center gap-3 ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all">
                  download_app
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Download .APK</span>
                </button>
              </a>

              <a href="#features" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-800 dark:text-white rounded-xl font-bold text-lg backdrop-blur-sm border border-black/5 dark:border-white/10 transition-all">
                Explore Features
              </a>
            </div>

            {/* User Stats */}
            <div className="pt-8 flex items-center gap-8 justify-center lg:justify-start text-gray-600 dark:text-gray-400" data-aos="fade-up" data-aos-delay="400">
              <div className="flex flex-col items-center lg:items-start group cursor-default">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform">300+</p>
                <p className="text-sm font-medium uppercase tracking-wider">Total Users</p>
              </div>
              <div className="w-px h-10 bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex flex-col items-center lg:items-start group cursor-default">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 transition-transform">200+</p>
                <p className="text-sm font-medium uppercase tracking-wider">Daily Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Logo / Visuals */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2 relative" data-aos="fade-left">
          {/* Rotating Ring */}
          <div className="absolute inset-0 m-auto w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-0 m-auto w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full border border-white/10 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Glass Container for Logo */}
          <div className="relative z-10 p-10 bg-white/5 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl shadow-blue-500/10 transform hover:rotate-2 transition-transform duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={logo}
              alt="BunkBook Logo"
              className="relative w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Floating Info Cards */}
          <div className="absolute bottom-10 -left-4 md:-left-12 bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl animate-bounce-slow hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-xl">🛡️</div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-sm font-bold text-white">Safe to Bunk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credits Box - Fixed Bottom Right */}
        <div
          className="lg:fixed lg:bottom-8 lg:right-8 w-full max-w-xs mx-auto lg:mx-0 bg-white/5 dark:bg-black/40 backdrop-blur-xl border border-white/10 dark:border-white/5 p-5 rounded-2xl shadow-2xl hover:bg-white/10 transition-colors text-left z-40 transform hover:-translate-y-1 duration-300 order-3 lg:order-3 mt-12 lg:mt-0"
        >
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Credits</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Backend & Frontend</span>
              <span className="text-xs font-bold text-gray-800 dark:text-white">Somesh</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block">UI/UX & Frontend</span>
              <span className="text-xs font-bold text-gray-800 dark:text-white">Aviral</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Contributor</span>
              <span className="text-xs font-bold text-gray-800 dark:text-white">Sujal Kumar</span>
            </div>
            <div className="pt-2 border-t border-white/10 mt-1">
              <span className="text-[10px] font-semibold text-blue-400">KIET-IT Students</span>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-gray-400/80 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
// herer we end
