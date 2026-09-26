import React from 'react';
import { Shield, ArrowRight, User, Download } from 'lucide-react';

const teamMembers = [
  {
    name: 'Somesh Tiwari',
    role: 'Lead Developer',
    linkedinUrl: 'https://www.linkedin.com/in/somesh-tiwari-236555322/',
    imageUrl: 'https://unavatar.io/linkedin/somesh-tiwari-236555322'
  },
  {
    name: 'Aviral Rajput',
    role: 'UI/UX Designer',
    linkedinUrl: 'https://www.linkedin.com/in/aviral-rajput-077a37309/',
    imageUrl: 'https://unavatar.io/linkedin/aviral-rajput-077a37309'
  },
  {
    name: 'Sujal Kumar',
    role: 'Contributor',
    linkedinUrl: 'https://www.linkedin.com/in/sujal-kumar-8a31bb320/',
    imageUrl: 'https://unavatar.io/linkedin/sujal-kumar-8a31bb320'
  },
  {
    name: 'Pushkar Garg',
    role: 'Contributor',
    linkedinUrl: 'https://www.linkedin.com/in/pushkar-garg-836542328/',
    imageUrl: 'https://unavatar.io/linkedin/pushkar-garg-836542328'
  },
];

const About = ({ profile }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
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

      {/* Suggestion Form Link */}
      <div className="flex flex-col gap-5 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Have a suggestion?</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Tell us how we can make BunkBook better for you.</p>
        </div>
        <a
          href="https://forms.gle/8Lw8L81YCt77bLKUA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
        >
          Open Google Form
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>

      {/* Creators Section */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 ml-2">The Creators</h2>
        <div className="bg-white dark:bg-[#09090b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
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
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
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
        <div className="bg-white dark:bg-[#09090b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
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
