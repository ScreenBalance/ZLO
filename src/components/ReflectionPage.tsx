// src/components/ReflectionPage.tsx

import React, { useEffect, useState } from 'react';
import TextDisplay from './TextDisplay';
import ActionButton from './ActionButton';
import './ReflectionPage.css';

interface ReflectionPageProps {
  isDarkMode: boolean;
  language: 'en' | 'no';
  remainingMonths: number;
  onNext: () => void;
}



interface Circle {
  index: number;
  visible: boolean;
  phase: string; // 'remaining', 'sleep', etc.
}

const ReflectionPage: React.FC<ReflectionPageProps> = ({
  isDarkMode,
  language,
  remainingMonths,
  onNext,
}) => {
  const [showTopText, setShowTopText] = useState(false);
  const [showBottomText, setShowBottomText] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [monthsArray, setMonthsArray] = useState<Circle[]>([]);
  const [gridColumns, setGridColumns] = useState(24);

  useEffect(() => {
    // Initialize monthsArray with circles
    const initialMonthsArray = Array.from({ length: remainingMonths }, (_, index) => ({
      index,
      visible: true,
      phase: 'remaining',
    }));
    setMonthsArray(initialMonthsArray);

    // Animation and text timing
    setTimeout(() => {
      setShowTopText(true);
    }, 2000);

    setTimeout(() => {
      setShowBottomText(true);
    }, 4000);

    setTimeout(() => {
      setShowNextButton(true);
    }, 6000);
  }, [remainingMonths]);

  // Add gridColumns logic
  useEffect(() => {
    const updateGridColumns = () => {
      const screenWidth = window.innerWidth;
      setGridColumns(screenWidth >= 768 ? 36 : 24);
    };
    updateGridColumns();
    window.addEventListener('resize', updateGridColumns);
    return () => window.removeEventListener('resize', updateGridColumns);
  }, []);

  return (
    <div className={`grid-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="content">
        {/* Top Text */}
        <div className="text-container">
          {showTopText && (
            <TextDisplay
              text={
                language === 'no'
                  ? `Vi estimerer at du har ${remainingMonths} måneder fri tid til 90`
                  : `We estimate you have ${remainingMonths} months of free time till 90`
              }
            />
          )}
        </div>

        {/* Circle Grid */}
        <div
          className="circle-grid initial-wave"
          style={{ gridTemplateColumns: `repeat(${gridColumns}, auto)` }}
        >
          {monthsArray.map((month) => (
            <div
              key={month.index}
              className={`circle ${month.phase}`}
              style={{ '--i': month.index } as React.CSSProperties}
            ></div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="footer-container">
          {showBottomText && (
            <span className="thin-text">
              {language === 'no'
                ? 'Tenk på 3 ting du ønsker å bruke denne tiden på..'
                : 'Think of three things you would like to spend this time on..'}
            </span>
          )}
        </div>

        {/* Next Button */}
        <div className="footer-container">
          {showNextButton && (
            <ActionButton onClick={onNext} isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionPage;
