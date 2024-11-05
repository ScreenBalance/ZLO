// src/components/TextDisplay.tsx

import React from 'react';
import './TextDisplay.css';

interface TextDisplayProps {
  text: string;
  className?: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text, className }) => {
  return (
    <h2 className={`display-text ${className || ''}`}>
      {text}
    </h2>
  );
};

export default TextDisplay;
