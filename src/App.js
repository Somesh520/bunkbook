import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ParticleBackground from './components/ParticleBackground';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Screenshots from './components/Screenshots';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import FAQ from './components/FAQ';
import About from './components/About';
import FeedbackForm from './components/FeedbackForm';
import Footer from './components/Footer';

function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <ParticleBackground isDark={dark} />
      </div>

      <div className="relative z-10">
        <Header dark={dark} setDark={setDark} />
        <main>
          {/* FIX: Added the isDark={dark} prop back to the components that need it */}
          <Hero isDark={dark} />
          <Features isDark={dark} />
          <HowItWorks />
          <Screenshots isDark={dark} />
          <Testimonials />
          <CTASection />
          <FAQ />
          <About />
          <FeedbackForm />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;