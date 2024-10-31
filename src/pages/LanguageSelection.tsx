// src/pages/LanguageSelection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './LanguageSelection.css';

interface LanguageSelectionProps {
  isDarkMode: boolean;
}

const LanguageSelection = ({ isDarkMode }: LanguageSelectionProps) => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language: 'en' | 'no') => {
    // Navigate to the Grid page and pass the selected language
    navigate('/grid', { state: { language } });
  };

  return (
    <div className="language-selection">
      <Header isDarkMode={isDarkMode} />
      {/* New container for main content */}
      <div className="main-content">
        <h2 className="heading">Choose Language</h2>
        <div className="button-container">
          <button
            className="language-button"
            onClick={() => handleLanguageSelect('en')}
          >
            English
          </button>
          <button
            className="language-button"
            onClick={() => handleLanguageSelect('no')}
          >
            Norsk
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
