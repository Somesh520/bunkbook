import React, { useState } from "react";

function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setDone(true);

    // Construct mailto link
    const subject = encodeURIComponent("BunkBook Feedback");
    const body = encodeURIComponent(`From: ${email}\n\nMessage:\n${msg}`);
    window.location.href = `mailto:someshtiwari.in@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setDone(false);
      setEmail("");
      setMsg("");
    }, 3000);
  };

  return (
    <section
      id="feedback"
      className="px-8 py-20 w-full transition-colors duration-500"
      data-aos="fade-up"
    >
      {/* 1. Title font increased from 4xl to 6xl */}
      <h2 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Share Your Feedback
      </h2>
      <form
        onSubmit={submit}
        className="space-y-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md"
      >
        {/* 2. Paragraph font increased from base to xl */}
        <p className="text-2xl text-gray-700 dark:text-gray-300">
          Got suggestions or ideas to improve BunkBook? We'd love to hear from you.
        </p>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          // 3. Input text font increased from lg to 2xl
          className="w-full px-4 py-3 text-2xl border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
        />
        <textarea
          placeholder="Your feedback"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          required
          rows="5"
          // 4. Textarea font increased from lg to 2xl
          className="w-full px-4 py-3 text-2xl border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
        />
        <button
          type="submit"
          // 5. Button text font increased from lg to 2xl
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-3xl rounded-lg font-bold shadow-md hover:scale-105 transition"
        >
          Submit Feedback
        </button>
        {done && (
          <p className="text-green-600 dark:text-green-400 mt-2 text-lg">
            Thanks for your feedback!
          </p>
        )}
      </form>
    </section>
  );
}

export default FeedbackForm;