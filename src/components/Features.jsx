import React from 'react';

function Features({ isDark }) {
  const features = [
    { title: "Attendance Tracking", desc: "Monitor attendance for all courses in one place.", icon: "📅" },
    { title: "Warnings & Alerts", desc: "Get timely alerts about low attendance.", icon: "🔔" },
    { title: "Safe Skip Suggestions", desc: "Know when it's safe to bunk without hurting grades.", icon: "🛡️" },
    { title: "Auto Sync", desc: "Instant synchronization across devices.", icon: "🔄" },
    { title: "Time Table", desc: "Access your daily class schedule instantly.", icon: "📅" },
    { title: "Exam Schedule", desc: "Stay updated with your sessional and semester exam dates.", icon: "📝" },
    { title: "Hall Ticket Download", desc: "Download your exam hall ticket directly from the app.", icon: "🎫" },
    { title: "Session Insights", desc: "Detailed breakdown of sessions for smarter planning.", icon: "📊" },
    { title: "Customization", desc: "Modify the interface to fit your preferences.", icon: "⚙️" },
  ];

  return (
    <section
      id="features"
      className="w-full px-4 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-16"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Key Features
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative p-8 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
              data-aos="fade-up"
              data-aos-delay={i * 100}
              data-aos-duration="1000"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/10">
                {f.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">
                {f.title}
              </h3>

              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-tr-3xl rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;