import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './LanguageSelection.css';

interface LanguageSelectionProps {
  isDarkMode: boolean;
  onSelectLanguage: (language: 'en' | 'no') => void; // Add onSelectLanguage prop here
}

const LanguageSelection = ({ isDarkMode, onSelectLanguage }: LanguageSelectionProps) => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language: 'en' | 'no') => {
    onSelectLanguage(language); // Use the prop function to handle language selection
    navigate('/grid', { state: { language } }); // Pass the selected language when navigating
  };

  return (
    <div className={`language-selection ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header isDarkMode={isDarkMode} />
      <div className="main-content">
        <h2 className="heading">Choose Language</h2>
        <div className="button-container">
          <button className="language-button" onClick={() => handleLanguageSelect('en')}>
            English
          </button>
          <button className="language-button" onClick={() => handleLanguageSelect('no')}>
            Norsk
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
