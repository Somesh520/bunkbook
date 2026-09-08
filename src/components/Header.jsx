import React, { useState, useEffect } from "react";
import logo from '../assets/logos.png';

function Header({ dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for additional styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 
      transition-all duration-300 rounded-full border border-white/20 dark:border-gray-700/30
      ${scrolled ? "bg-white/70 dark:bg-black/80 shadow-xl backdrop-blur-md py-2" : "bg-white/30 dark:bg-black/40 backdrop-blur-sm shadow-lg py-3"}`}
    >
      <div className="flex items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="BunkBook Logo" className="w-10 h-10 rounded-full shadow-sm hover:rotate-12 transition-transform duration-300" />
          <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block tracking-tight">
            BunkBook
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Screenshots', 'FAQ', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-lg active:scale-90 duration-200"
            aria-label="Toggle Dark Mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-800 dark:text-gray-200 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${menuOpen ? "rotate-45" : ""}`} />
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${menuOpen ? "-rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`absolute top-full left-0 w-full mt-2 rounded-3xl overflow-hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 origin-top transform
        ${menuOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"}`}>
        <div className="flex flex-col items-center py-6 gap-6">
          {['Features', 'Screenshots', 'FAQ', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
