import React from 'react';
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer
      className="bg-gray-100 dark:bg-black transition-colors duration-500 text-gray-500 dark:text-gray-300 px-8 py-10"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              BunkBook
            </h2>
            <p className="mt-2 text-sm">Manage your attendance smartly.</p>
          </div>
          <nav className="flex items-center gap-6 text-lg font-medium">
            <a href="#features" className="hover:text-blue-500 dark:hover:text-blue-400">Features</a>
            <a href="#faq" className="hover:text-blue-500 dark:hover:text-blue-400">FAQ</a>
            <a href="#about" className="hover:text-blue-500 dark:hover:text-blue-400">About</a>
          </nav>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500"><FaTwitter size={28} /></a>
            <a href="https://www.instagram.com/dark10.aviral/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram size={28} /></a>
            <a href="https://www.instagram.com/someshxd/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram size={28} /></a>
            <a href="https://www.linkedin.com/in/aviral-rajput-077a37309" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700"><FaLinkedin size={28} /></a>
          </div>
        </div>

        {/* Open Source Section */}
        <div className="text-center mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4">
          <p className="font-semibold text-gray-800 dark:text-gray-200">This project is Open Source</p>
          <div className="flex items-center gap-6">
            <a 
              href="https://logonoid.com/open-source-logo/" 
              target="_blank" 
              // FIX: Added rel="noopener noreferrer"
              rel="noopener noreferrer" 
            >
              <img src="https://logonoid.com/images/thumbs/open-source-logo.png" alt="Open Source Logo" className="h-12"/>
            </a>
            <a 
              href="https://github.com/Somesh520/Kietkt" 
              target="_blank" 
              // FIX: Added rel="noopener noreferrer"
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-lg font-bold text-blue-500 hover:underline"
            >
              <FaGithub size={24} />
              Contribute on GitHub
            </a>
            
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-xs mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          © 2025 BunkBook. All rights reserved. Made by Avi and Somesh.
        </div>
      </div>
    </footer>
  );
}

export default Footer;