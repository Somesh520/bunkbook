import React from 'react';
import logo from '../assets/logos.png';
import ParticleText from './ParticleText';

function Hero({ isDark }) {
  return (
    <section
  className="relative w-full text-center px-4 pt-24 sm:pt-32 md:pt-40 pb-8 md:pb-20 overflow-x-hidden"
  data-aos="fade-up"
>

      <div className="relative z-10 flex flex-col items-center">
        
        <div className="w-full max-w-full mb-4">
          <ParticleText text="BunkBook" isDark={isDark} />
        </div>

        <img 
          src={logo} 
          alt="BunkBook Logo" 
          className="relative w-24 h-24 mb-4 md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 md:w-40 md:h-40 p-2 rounded-full"
          data-aos="fade-left"
          data-aos-delay="500"
        />

        <div className="max-w-4xl mx-auto space-y-4 text-gray-700 dark:text-gray-200 text-lg sm:text-xl md:text-3xl lg:text-4xl">
          <p className="underline decoration-2 underline-offset-4 mb-6">Keep Touching The BunkBook Logo</p>
          <a href="https://github.com/Somesh520/Kietkt/releases/download/v1.1.3/BunkBook.apk" className="mt-8">
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg sm:text-xl md:px-12 md:py-6 md:text-2xl shadow-lg hover:scale-105 transition animated-gradient-button"
            data-aos="zoom-in"
          >
            Download
          </button>
        </a>
          
          <p>
            Smart attendance tracker that helps you manage bunks without stress.
            Stay ahead with alerts, insights, and safe skip suggestions
          </p>

          <p className="underline decoration-2 underline-offset-4">Scroll down to know more.</p>
        </div>

        

        <div 
          className="relative mt-10 bg-white/10 dark:bg-black/10 backdrop-blur-sm p-4 rounded-lg text-left md:absolute md:bottom-12 md:left-3 md:mt-0"
          data-aos="fade-right" 
          data-aos-delay="500"
        >
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
            Backend & Frontend by Somesh
          </p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mt-1">
            UI/UX & Frontend by Aviral
          </p>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mt-1">
            Managed and contributed by Sujal Kumar
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            - KIET-IT Students
          </p>
        </div>

      </div>
    </section>
  );
}

export default Hero;
// herer we end
