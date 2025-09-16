import React, { useEffect, useState } from 'react';
import './App.css';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Home from './screens/Home';

// PUBLIC_INTERFACE
function App() {
  /** Root app that provides a minimal navigation for previewing Figma screens. */
  const [theme, setTheme] = useState('light');
  const [route, setRoute] = useState('signup'); // 'signup' | 'signin' | 'home'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const renderScreen = () => {
    if (route === 'signin') return <SignIn onNavigate={setRoute} />;
    if (route === 'home') return <Home />;
    return <SignUp onNavigate={setRoute} />;
  };

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'auto', padding: 12, gap: 12 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ position: 'static' }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <nav aria-label="Preview screens" style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setRoute('signup')} className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            Sign Up
          </button>
          <button onClick={() => setRoute('signin')} className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            Sign In
          </button>
          <button onClick={() => setRoute('home')} className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            Home
          </button>
        </nav>
      </header>

      <div style={{ padding: '20px 0' }}>
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
