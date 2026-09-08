import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import ss1 from '../assets/pic1.png';
import ss2 from '../assets/pic2.png';
import ss3 from '../assets/pic3.png';
import ss4 from '../assets/pic4.png';
import ss5 from '../assets/pic5.png';

function Screenshots({ isDark }) {
  const [activeIndex, setActiveIndex] = useState(2); // Start in the middle

  const shots = [
    { url: ss1, title: "Home Screen" },
    { url: ss2, title: "Attendance View" },
    { url: ss3, title: "Add Course" },
    { url: ss4, title: "Edit Criteria" },
    { url: ss5, title: "Profile & Stats" },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % shots.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + shots.length) % shots.length);
  };

  const getStyles = (index) => {
    if (index === activeIndex)
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        zIndex: 10,
      };
    else if (index === (activeIndex - 1 + shots.length) % shots.length)
      return {
        opacity: 1, // Visible but side
        transform: "translateX(-140px) translateZ(-100px) rotateY(15deg) scale(0.9)", // slightly tilted left
        zIndex: 8,
        filter: 'brightness(0.7) blur(1px)'
      };
    else if (index === (activeIndex + 1) % shots.length)
      return {
        opacity: 1,
        transform: "translateX(140px) translateZ(-100px) rotateY(-15deg) scale(0.9)", // slightly tilted right
        zIndex: 8,
        filter: 'brightness(0.7) blur(1px)'
      };
    else if (index === (activeIndex - 2 + shots.length) % shots.length)
      return {
        opacity: 0.7,
        transform: "translateX(-260px) translateZ(-200px) rotateY(25deg) scale(0.8)",
        zIndex: 6,
        filter: 'brightness(0.5) blur(2px)'
      };
    else if (index === (activeIndex + 2) % shots.length)
      return {
        opacity: 0.7,
        transform: "translateX(260px) translateZ(-200px) rotateY(-25deg) scale(0.8)",
        zIndex: 6,
        filter: 'brightness(0.5) blur(2px)'
      };
    else
      return {
        opacity: 0,
        transform: "translateX(0px) translateZ(-500px) rotateY(0deg)", // Hide others behind
        zIndex: 1,
      };
  };

  return (
    <section id="screenshots" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-16" data-aos="fade-up">
          App <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Screenshots</span>
        </h2>

        {/* Carousel Container */}
        <div className="relative h-[500px] md:h-[600px] w-full flex justify-center items-center perspective-1000">
          {shots.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className="absolute w-[260px] md:w-[320px] aspect-[9/16] rounded-3xl bg-gray-900 border-4 border-gray-800 shadow-2xl transition-all duration-500 ease-out cursor-pointer overflow-hidden"
              style={getStyles(index)}
            >
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />

              {/* Overlay Title */}
              <div className={`absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white font-bold text-lg">{item.title}</p>
              </div>
            </div>
          ))}

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {shots.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-blue-500 w-8' : 'bg-gray-400/50 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}

export default Screenshots;