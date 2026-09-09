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
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { authService } from './services/api';

function App() {
  const [dark, setDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'landing', 'login', 'dashboard'

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    
    // Check initial auth state and handle refresh persistence
    const token = authService.getToken();
    if (token && !authService.isTokenExpired()) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else if (token) {
      // Token exists but is expired
      authService.logout();
      setIsAuthenticated(false);
      setCurrentView('login');
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setCurrentView('login');
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return (
      <div className={`relative overflow-x-hidden min-h-screen ${dark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="fixed top-4 right-4 z-50">
           <button 
             onClick={() => setDark(!dark)}
             className={`p-2 rounded-full ${dark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-800 shadow-md'}`}
           >
             {dark ? '☀️' : '🌙'}
           </button>
        </div>
        <Login onLoginSuccess={handleLoginSuccess} dark={dark} />
      </div>
    );
  }

  if (currentView === 'dashboard' || (currentView === 'landing' && isAuthenticated)) {
    return (
      <div className={`relative overflow-x-hidden min-h-screen ${dark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Dashboard onLogout={handleLogout} dark={dark} setDark={setDark} />
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <ParticleBackground isDark={dark} />
      </div>

      <div className="relative z-10">
        <div className="fixed top-4 right-4 z-50">
           <button 
             onClick={() => setCurrentView('login')}
             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-lg"
           >
             Sign In
           </button>
        </div>
        <Header dark={dark} setDark={setDark} />
        <main>
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