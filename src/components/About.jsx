import React from 'react';

function About() {
  return (
    <section
      id="about"
      className="px-8 py-18 w-full text-center transition-colors duration-500"
    >
      <h2
        className="text-6xl font-extrabold text-gray-900 dark:text-white mb-8"
        data-aos="fade-up"
      >
        Meet the Creators
      </h2>
      <p
        className="text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        A passion project by Aviral and Somesh dedicated to solving a real-world problem.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-8">
        <div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg p-8 w-full sm:w-2/5 text-left"
          data-aos="zoom-in"
        >
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">Aviral Rajput</h3>
          <p className="text-6lg text-gray-700 dark:text-gray-300 mt-2">
            <p>As the lead UI/UX designer.</p>
            <p>Aviral crafted the entire user experience.</p>
             <p>Created the website, and handled its deployment.</p> <p>He made significant contributions to the frontend development, bringing the vision to life.</p>
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-4">
            - 2nd Year IT Student, KIET Group of Institutions
          </p>
        </div>
        <div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg p-8 w-full sm:w-2/5 text-left"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white">Somesh</h3>
          <p className="text-6lg text-gray-700 dark:text-gray-300 mt-2">
             <p>Somesh managed the project completely, contributing to both the backend and frontend architecture.</p> <p>He made significant contributions to the frontend development, bringing the vision to life.</p>
           <p>Created the Application, and handled its deployment. </p> <p>His expertise was crucial in building a robust and scalable application from the ground up.</p>
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-4">
            - 2nd Year IT Student, KIET Group of Institutions
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;