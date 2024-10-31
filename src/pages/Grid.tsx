// src/pages/Grid.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Grid.css';

import backArrowLight from '../assets/back-arrow-light.svg';
import backArrowDark from '../assets/back-arrow-dark.svg';

interface LocationState {
  language: 'en' | 'no';
}

interface GridProps {
  isDarkMode: boolean;
}

const Grid: React.FC<GridProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Assert the type of location.state
  const state = location.state as LocationState | undefined;

  // Ensure language is of type 'en' | 'no'
  const language: 'en' | 'no' = state?.language || 'en'; // Default to English if not provided

  // If language is not provided, redirect back to language selection
  useEffect(() => {
    if (!state?.language) {
      navigate('/language-selection');
    }
  }, [state, navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [remainingMonths, setRemainingMonths] = useState(1080);
  const totalMonths = 1080;

  // Initialize months array for circles
  const [monthsArray, setMonthsArray] = useState<
    { index: number; visible: boolean; aboutToRemove?: boolean; reverseColor?: boolean }[]
  >(
    Array.from({ length: totalMonths }, (_, index) => ({
      index,
      visible: true,
    }))
  );

  // Language-specific texts
  const texts = {
    en: {
      yearsText: '90 years..',
      monthsText: 'This is 1080 months',
      enterAge: 'Enter your age',
      monthsLeft: (months: number) => `${months} months until you are 90`,
      next: 'Next',
    },
    no: {
      yearsText: '90 år..',
      monthsText: 'Dette er 1080 måneder',
      enterAge: 'Din alder',
      monthsLeft: (months: number) => `${months} måneder til du er 90`,
      next: 'Neste',
    },
  };

  // Handle steps progression
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep === 1) {
      // Proceed to step 2 after the initial animation completes
      timer = setTimeout(() => setCurrentStep(2), 2300);
    } else if (currentStep === 2) {
      // Proceed to step 3 after displaying the text
      timer = setTimeout(() => setCurrentStep(3), 3000);
    } else if (currentStep === 3) {
      // Proceed to step 4 after the second animation completes
      timer = setTimeout(() => setCurrentStep(4), 2400);
    }

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle Next button
  const handleNext = () => {
    if (currentStep === 4) {
      // Proceed to age input
      setCurrentStep(5);
    } else if (currentStep === 5 && age !== null) {
      // Proceed to step 6: hide age input and start circle removal process
      setCurrentStep(6);

      // Remove circles corresponding to months already lived
      const monthsLived = age * 12;
      const monthsLeft = totalMonths - monthsLived;
      setRemainingMonths(monthsLeft);

      // Fade out age input and text
      setTimeout(() => {
        // Mark circles as about to be removed and set reverseColor to true
        setMonthsArray((prevMonthsArray) => {
          const updatedArray = [...prevMonthsArray];
          for (let i = totalMonths - monthsLived; i < totalMonths; i++) {
            updatedArray[i].aboutToRemove = true;
            updatedArray[i].reverseColor = true;
          }
          return updatedArray;
        });

        // Wait 1 second before starting removal animation
        setTimeout(() => {
          // Update the monthsArray to set visible to false for months already lived
          setMonthsArray((prevMonthsArray) => {
            const updatedArray = [...prevMonthsArray];
            for (let i = totalMonths - monthsLived; i < totalMonths; i++) {
              updatedArray[i].visible = false;
              // Do not reset aboutToRemove here
            }
            return updatedArray;
          });

          // Calculate the total duration of the removal animation
          const totalRemovalTime = monthsLived * 0.0033 * 1000 + 670;

          // Proceed to step 7 after the removal animation completes
          setTimeout(() => {
            // Reset aboutToRemove flags after circles have been removed
            setMonthsArray((prevMonthsArray) => {
              const updatedArray = [...prevMonthsArray];
              for (let i = totalMonths - monthsLived; i < totalMonths; i++) {
                updatedArray[i].aboutToRemove = false;
                updatedArray[i].reverseColor = false;
              }
              return updatedArray;
            });
            setCurrentStep(7);
          }, totalRemovalTime);
        }, 1000); // Wait 1 second before starting removal
      }, 1000); // Wait 1 second for fade-out of age input
    } else if (currentStep === 7) {
      // Keep the text and button on screen
    } else {
      // For other steps, just increment currentStep
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Calculate grid columns based on screen size and remaining months
  const [gridColumns, setGridColumns] = useState(24); // default mobile columns

  useEffect(() => {
    const updateGridColumns = () => {
      const screenWidth = window.innerWidth;
      let columns = screenWidth >= 768 ? 36 : 24;
      if (remainingMonths < columns) {
        columns = remainingMonths > 0 ? remainingMonths : 1;
      }
      setGridColumns(columns);
    };

    updateGridColumns();
    window.addEventListener('resize', updateGridColumns);
    return () => window.removeEventListener('resize', updateGridColumns);
  }, [remainingMonths]);

  // Add classes for fade-in and fade-out animations
  const getTextContainerClass = () => {
    if (currentStep === 2 || currentStep === 4 || currentStep === 5 /*|| currentStep === 7*/) {
      return 'fade-in';
    } else if (currentStep === 6) {
      return 'fade-out';
    }
    return '';
  };

  return (
    <div className={`grid-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header isDarkMode={isDarkMode} />
      <div className="content">
        {/* Text Container */}
        <div
          className={`text-container ${getTextContainerClass()}`}
          key={currentStep} // Force re-mount to re-trigger animations
        >
          {currentStep === 2 && (
            <h2 className="display-text">{texts[language].monthsText}</h2>
          )}

          {currentStep === 4 && (
            <h2 className="display-text">{texts[language].yearsText}</h2>
          )}

          {currentStep === 5 && (
            <div className="age-input-step">
              <label htmlFor="age-input" className="age-label">
                {texts[language].enterAge}
              </label>
              {/* Custom age input to avoid mobile keyboard */}
              <select
                id="age-input"
                className="age-select"
                value={age !== null ? age : ''}
                onChange={(e) => setAge(Number(e.target.value))}
              >
                <option value="" disabled>
                  --
                </option>
                {Array.from({ length: 91 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {age !== null && (
                <button className="next-button" onClick={handleNext}>
                  <img
                    src={isDarkMode ? backArrowDark : backArrowLight}
                    alt="Next"
                    className="next-button-image"
                  />
                </button>
              )}
            </div>
          )}

          {/* Temporarily remove the text for currentStep === 7 */}
          {/* {currentStep === 7 && (
            <h2 className="display-text">
              {texts[language].monthsLeft(remainingMonths)}
            </h2>
          )} */}
        </div>

        {/* Circle Grid */}
        <div
          className={`circle-grid ${
            currentStep === 1 ? 'initial-wave' : ''
          } ${currentStep === 3 ? 'second-animation' : ''} ${
            currentStep >= 4 ? 'post-animation' : ''
          }`}
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, 10px)`,
          }}
        >
          {monthsArray.map(({ index, visible, aboutToRemove, reverseColor }) => (
            <div
              key={index}
              className={`circle ${visible ? '' : 'hidden-circle'} ${
                aboutToRemove ? 'about-to-remove' : ''
              } ${reverseColor ? 'reverse-color-animation' : ''}`}
              style={{ '--i': index } as React.CSSProperties}
            ></div>
          ))}
        </div>

        {/* Button Container */}
        <div className="button-container">
          {/* Temporarily remove the button for currentStep === 7 */}
          {currentStep === 4 && (
            <button className="next-button" onClick={handleNext}>
              <img
                src={isDarkMode ? backArrowDark : backArrowLight}
                alt="Next"
                className="next-button-image"
              />
            </button>
          )}
        </div>

        {/* Counter at the bottom (hidden for now) */}
        <div className="counter" style={{ visibility: 'hidden' }}>
          {remainingMonths} {language === 'en' ? 'months' : 'måneder'}
        </div>
      </div>
    </div>
  );
};

export default Grid;
