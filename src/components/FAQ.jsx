import React, { useState } from "react";

function FAQ() {
  // 1. Longer, more detailed answers
  const faqs = [
    { 
      q: "Is BunkBook safe to use with my college portal?", 
      a: "Yes, absolutely. BunkBook uses secure, read-only permissions to sync with your college portal. We never store your login credentials on our servers, and our system is designed only to fetch attendance data, meaning it cannot make any changes to your account." 
    },
    { 
      q: "How does the 'Safe Skip Suggestion' feature work?", 
      a: "Our smart algorithm continuously calculates your real-time attendance percentage and compares it against the minimum requirement for each subject. It then determines the exact number of classes you can afford to miss without your attendance dropping below the critical threshold, giving you peace of mind." 
    },
    { 
      q: "What if my college doesn't have an online portal?", 
      a: "No problem at all! BunkBook is designed for everyone. You can easily switch to manual tracking mode, where you simply mark your status (Attended, Missed, or Canceled) after each class. The app will handle all the complex calculations and provide you with the same valuable insights." 
    },
    {
      q: "Can I use BunkBook for multiple semesters?",
      a: "Yes, BunkBook fully supports your entire academic journey. You can archive your old semester data at any time to keep your dashboard clean and start fresh with new subjects. Your past records are always securely stored and available to view if you need to access them later."
    }
  ];
  const [open, setOpen] = useState(null);

  return (
    <section
      id="faq"
      className="px-8 py-20 w-full transition-colors duration-500"
    >
      <h2
        className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12"
        data-aos="fade-up"
      >
        Frequently Asked Questions
      </h2>
      <div className="space-y-5 max-w-4xl mx-auto"> {/* Increased max-width */}
        {faqs.map((f, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm"
            data-aos="fade-right"
            data-aos-delay={i * 100}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              // 2. Bigger boxes (px-8 py-6) and 3. Larger font (text-xl)
              className="w-full text-left px-8 py-6 text-xl font-semibold flex justify-between items-center text-gray-900 dark:text-white"
            >
              {f.q}
              <span className="text-3xl transition-transform duration-300" style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              // 3. Larger font for the answer (text-lg)
              <div className="px-8 pb-6 text-lg text-gray-700 dark:text-gray-300">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;