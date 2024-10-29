import React, { useEffect, useState } from 'react';
import logo from './assets/zello-logo.svg';
import whiteLogo from './assets/zello-logo-white.svg';
import './App.css';

const App = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Set initial theme based on OS preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    // Listener for changes in OS theme preference
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleThemeChange);

    // Clean up the event listener on component unmount
    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="app-container" style={{ height: viewportHeight }}>
      {/* Conditionally render logo based on theme */}
      <img src={isDarkMode ? whiteLogo : logo} alt="Zello Logo" className="logo" />

      {/* Responsive Button */}
      <button className="responsive-button">
        Let’s zlo down
      </button>
    </div>
  );
};

export default App;
