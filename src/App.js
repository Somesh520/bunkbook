import { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { authService } from './services/api';

function App() {
  const [dark, setDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state and handle refresh persistence
    const token = authService.getToken();
    if (token && !authService.isTokenExpired()) {
      setIsAuthenticated(true);
    } else if (token) {
      // Token exists but is expired
      authService.logout();
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-x-hidden min-h-screen ${dark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="fixed top-4 right-4 z-50">
         <ThemeToggle isDark={dark} onToggle={() => setDark(!dark)} className="w-12 h-12 p-2" />
      </div>

      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} dark={dark} setDark={setDark} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} dark={dark} />
      )}
    </div>
  );
}

export default App;