// src/components/ScreenTimeInput.tsx

import React, { useState } from 'react';
import './ScreenTimeInput.css';
import ActionButton from './ActionButton';

interface ScreenTimeInputProps {
  screenTime: number | null;
  setScreenTime: React.Dispatch<React.SetStateAction<number | null>>;
  handleNext: () => void;
  isDarkMode: boolean;
  language: 'en' | 'no';
}

const ScreenTimeInput: React.FC<ScreenTimeInputProps> = ({
  screenTime,
  setScreenTime,
  handleNext,
  isDarkMode,
  language,
}) => {
  console.log('ScreenTimeInput rendered. screenTime:', screenTime);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= 24) {
      setScreenTime(value);
      setError('');
    } else {
      setError(
        language === 'no'
          ? 'Vennligst velg en verdi mellom 0 og 24.'
          : 'Please select a value between 0 and 24.'
      );
    }
  };

  return (
    <div className="screen-time-input-step">
      <span className="thin-text">
        {language === 'no' ? 'Jeg bruker' : 'I spend'}
      </span>
      <select
        className={`screen-time-select ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
        value={screenTime !== null ? screenTime : ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          {language === 'no' ? '--' : 'Select hours'}
        </option>
        {Array.from({ length: 25 }, (_, index) => (
          <option key={index} value={index}>
            {index}
          </option>
        ))}
      </select>
      <span className="thin-text">
        {language === 'no' ? 'timer på skjerm hver dag' : 'hours on screen per day'}
      </span>
      {error && <div className="error">{error}</div>}
      <ActionButton
        onClick={handleNext}
        isDarkMode={isDarkMode}
       
      />
    </div>
  );
};

export default ScreenTimeInput;
