// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/zello-logo.svg';
import whiteLogo from '../assets/zello-logo-white.svg';
import './LandingPage.css';

interface LandingPageProps {
  isDarkMode: boolean;
}

const LandingPage = ({ isDarkMode }: LandingPageProps) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/language-selection');
  };

  return (
    <div className="app-container">
      <img src={isDarkMode ? whiteLogo : logo} alt="Zello Logo" className="logo" />
      <button className="responsive-button" onClick={handleButtonClick}>
        Let’s zlo down
      </button>
    </div>
  );
};

export default LandingPage;
