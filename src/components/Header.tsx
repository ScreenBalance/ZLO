// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import backArrowDark from '../assets/back-arrow-dark.svg';
import backArrowLight from '../assets/back-arrow-light.svg';

interface HeaderProps {
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <header className="header">
      <button className="back-button" onClick={handleBack}>
        <img
          src={isDarkMode ? backArrowDark : backArrowLight}
          alt="Back"
          className="back-icon"
        />
      </button>
      <h1 className="logo-text">ZLO</h1>
    </header>
  );
};

export default Header;
