import React from 'react';

function CTASection() {
  return (
    <section
      id="cta"
      className="px-4 py-20 w-full text-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500"
      data-aos="fade-up"
    >
      <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Join students already using <span className="font-semibold text-blue-600 dark:text-blue-400">BunkBook</span>
        to manage attendance smartly.
      </p>
      
      {/* The button is now wrapped in a link */}
      <a href="https://github.com/Somesh520/Kietkt/releases/download/v1.1.3/BunkBook.apk">
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-6 text-2xl rounded-lg font-bold shadow-lg hover:scale-105 transition animated-gradient-button"
          data-aos="zoom-in"
        >
          Download App
        </button>
      </a>
    </section>
  );
}
export default CTASection;