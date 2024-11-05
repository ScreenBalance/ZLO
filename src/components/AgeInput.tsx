// src/components/AgeInput.tsx

import React from 'react';
import './AgeInput.css';
import ActionButton from './ActionButton';

interface AgeInputProps {
  age: number | null;
  setAge: (age: number) => void;
  handleNext: () => void;
  isDarkMode: boolean;
  language: 'en' | 'no';
}

const AgeInput: React.FC<AgeInputProps> = ({ age, setAge, handleNext, isDarkMode, language }) => {
  const handleAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAge(Number(event.target.value));
  };

  return (
    <div className="age-input-step">
      <span className="thin-text">
        {language === 'no' ? 'Jeg er' : 'I am'}
      </span>
      <select
        className={`age-select ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
        value={age !== null ? age : ''}
        onChange={handleAgeChange}
      >
        <option value="" disabled>
          {language === 'no' ? 'Velg alder' : 'Select age'}
        </option>
        {Array.from({ length: 100 }, (_, index) => (
          <option key={index} value={index}>
            {index}
          </option>
        ))}
      </select>
      <span className="thin-text">
        {language === 'no' ? 'år' : 'years'}
      </span>
      <ActionButton onClick={handleNext} isDarkMode={isDarkMode} />
    </div>
  );
};

export default AgeInput;
