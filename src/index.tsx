import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Function to set the theme-color meta tag
const setThemeColorMetaTag = (color: string) => {
  let themeColorMetaTag = document.querySelector("meta[name='theme-color']") as HTMLMetaElement;

  if (!themeColorMetaTag) {
    themeColorMetaTag = document.createElement('meta') as HTMLMetaElement;
    themeColorMetaTag.name = 'theme-color';
    document.head.appendChild(themeColorMetaTag);
  }

  themeColorMetaTag.setAttribute('content', color);
};

// Function to dynamically load the theme based on OS preference
const loadTheme = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = isDarkMode ? 'dark' : 'light';
  const themeColor = isDarkMode ? '#202020' : '#ffffff'; // Set theme color for meta tag
  setThemeColorMetaTag(themeColor);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${process.env.PUBLIC_URL}/themes/${theme}.css`;
  link.id = 'theme-stylesheet';

  const existingLink = document.getElementById('theme-stylesheet');
  if (existingLink) {
    document.head.removeChild(existingLink);
  }

  document.head.appendChild(link);
};

// Initial theme load and OS theme change listener
loadTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', loadTheme);

// Get the root element
const rootElement = document.getElementById('root') as HTMLElement;

// Create the root
const root = ReactDOM.createRoot(rootElement);

// Render the React app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Service worker registration
serviceWorkerRegistration.unregister();

// Web vitals for performance measurement
reportWebVitals();
