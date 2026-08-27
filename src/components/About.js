import React from 'react';
import { Shield, ArrowRight, User, Download } from 'lucide-react';

const teamMembers = [
  {
    name: 'Somesh Tiwari',
    role: 'Lead Developer',
    linkedinUrl: 'https://www.linkedin.com/in/somesh-tiwari-236555322/',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/png?seed=Somesh&backgroundColor=b6e3f4'
  },
  {
    name: 'Aviral Rajput',
    role: 'UI/UX Designer',
    linkedinUrl: 'https://www.linkedin.com/in/aviral-rajput-077a37309/',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/png?seed=Aviral&backgroundColor=c0aede'
  },
  {
    name: 'Sujal Kumar',
    role: 'Contributor',
    linkedinUrl: 'https://www.linkedin.com/in/sujal-kumar-8a31bb320/',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/png?seed=Sujal&backgroundColor=d1d4f9'
  },
  {
    name: 'Pushkar Garg',
    role: 'Contributor',
    linkedinUrl: 'https://www.linkedin.com/in/pushkar-garg-836542328/',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/png?seed=Pushkar&backgroundColor=ffdfbf'
  },
];

const About = ({ profile }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Banner */}
      <div className="relative bg-blue-600 rounded-2xl overflow-hidden shadow-lg">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-400 rounded-full opacity-50"></div>

        <div className="relative z-10 px-8 py-12 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">About App</h1>
          <p className="text-lg text-blue-100 font-medium">Built for Students, by Students.</p>
        </div>
      </div>

      {/* Mobile App Promotion */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden relative">
        <div className="px-6 py-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left mb-6 sm:mb-0 z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Get the Mobile App</h2>
            <p className="text-indigo-100 max-w-sm">
              Experience Bunkbook natively on your phone. Faster, smoother, and built for on-the-go access!
            </p>
          </div>
          <div className="z-10 flex-shrink-0">
            <a
              href="https://github.com/Somesh520/Kietkt/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Download APK
            </a>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="150" r="100" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Creators Section */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 ml-2">The Creators</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {teamMembers.map((member, index) => (
              <a
                key={member.name}
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full mr-5 bg-gray-100 dark:bg-gray-700 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-5 bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{member.role}</p>
                </div>

                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 ml-2">Information</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="flex items-center px-6 py-5">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-5 flex-shrink-0">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">100% Secure</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Data is fetched directly from CyberVidya securely on your browser.</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default About;
