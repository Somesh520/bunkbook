import React from 'react';

function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Mark Daily Attendance",
            desc: "Quickly mark your lectures as Present, Absent, or Cancelled. It takes less than 5 seconds a day!",
            icon: "✅",
            color: "from-purple-400 to-purple-600"
        },
        {
            id: 2,
            title: "Get Smart Insights",
            desc: "See exactly how many classes you can safe bunk or need to attend to hit your target.",
            icon: "🧠",
            color: "from-pink-400 to-pink-600"
        },
        {
            id: 3,
            title: "Stay Organized",
            desc: "Access Time Table, Exam Schedule, and download Hall Tickets in one tap.",
            icon: "📅",
            color: "from-orange-400 to-orange-600"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Works</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Three simple steps to stress-free college life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -translate-y-1/2 z-0"></div>

                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="relative z-10 flex flex-col items-center text-center group"
                            data-aos="fade-up"
                            data-aos-delay={index * 200}
                        >
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                                {step.desc}
                            </p>

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold flex items-center justify-center shadow-lg">
                                {step.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
