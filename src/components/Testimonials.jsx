import React from 'react';

function Testimonials() {
    const reviews = [
        { name: "Rahul S.", year: "2nd Year", comment: "Saved me from debarment! The 75% calculator is a lifesaver.", avatar: "👨‍🎓" },
        { name: "Priya M.", year: "2nd Year", comment: "Best app for KIET students. No more manual calculations.", avatar: "👩‍🎓" },
        { name: "Aman K.", year: "1st Year", comment: "The UI is so clean and smooth. Loving the new update!", avatar: "👨‍💻" },
        { name: "Sneha R.", year: "1st Year", comment: "Helps me bunk safely without guilt. Highly recommended.", avatar: "💃" },
        { name: "Vikram J.", year: "2nd Year", comment: "User friendly and accurate. A must-have tool.", avatar: "🚀" },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-transparent to-blue-500/5 relative overflow-hidden">
            {/* Marquee Container */}
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center" data-aos="fade-down">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    Student <span className="text-blue-500">Love</span>
                </h2>
            </div>

            <div className="flex overflow-x-hidden relative group">
                <div className="flex animate-marquee gap-8 py-4 whitespace-nowrap">
                    {[...reviews, ...reviews].map((review, i) => (
                        <div
                            key={i}
                            className="w-80 md:w-96 p-6 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-lg flex flex-col gap-4 flex-shrink-0 hover:border-blue-500/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                                    {review.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{review.year}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 italic whitespace-normal">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* Gradient Fade Edges */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-[#0f172a] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-[#0f172a] to-transparent z-10"></div>
            </div>

            <style jsx>{`
         @keyframes marquee {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
         }
         .animate-marquee {
           animation: marquee 30s linear infinite;
         }
         .group:hover .animate-marquee {
           animation-play-state: paused;
         }
       `}</style>
        </section>
    );
}

export default Testimonials;
