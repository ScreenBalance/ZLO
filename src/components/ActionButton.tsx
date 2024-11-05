// src/components/ActionButton.tsx

import React from 'react';
import './ActionButton.css';
import backArrowDark from '../assets/back-arrow-dark.svg';
import backArrowLight from '../assets/back-arrow-light.svg';

interface ActionButtonProps {
  onClick: () => void;
  isDarkMode: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isDarkMode }) => {
  const arrowIcon = isDarkMode ? backArrowDark : backArrowLight;

  return (
    <button className="action-button next-button" onClick={onClick}>
      <img src={arrowIcon} alt="Next" className="next-button-image" />
    </button>
  );
};

export default ActionButton;
