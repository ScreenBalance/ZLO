// src/pages/Grid.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TextDisplay from '../components/TextDisplay';
import CircleGrid from '../components/CircleGrid';
import ActionButton from '../components/ActionButton';
import AgeInput from '../components/AgeInput';
import Tooltip from '../components/Tooltip';
import ReflectionPage from '../components/ReflectionPage';
import ScreenTimeInput from '../components/ScreenTimeInput';
import './Grid.css';

interface GridProps {
  isDarkMode: boolean;
  language: 'en' | 'no';
}

interface Circle {
  index: number;
  visible: boolean;
  phase: string; // 'remaining', 'sleep', etc.
  aboutToRemove?: boolean;
  aboutToColor?: boolean;
  newPhase?: string;
}

const Grid: React.FC<GridProps> = ({ isDarkMode, language }) => {
  // Existing states
  const [currentStep, setCurrentStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [monthsLeft, setMonthsLeft] = useState(0); // New state for months left after age
  const [remainingMonths, setRemainingMonths] = useState(1080);
  const [monthsArray, setMonthsArray] = useState<Circle[]>(
    Array.from({ length: 1080 }, (_, index) => ({
      index,
      visible: true,
      phase: 'remaining', // 'remaining', 'sleep', etc.
    }))
  );
  const [gridColumns, setGridColumns] = useState(24);

  // New states
  const [currentPhase, setCurrentPhase] = useState('');
  const [sleepMonths, setSleepMonths] = useState(0);
  const [careerMonths, setCareerMonths] = useState(0);
  const [cookingMonths, setCookingMonths] = useState(0);
  const [choresMonths, setChoresMonths] = useState(0);
  const [transportMonths, setTransportMonths] = useState(0);
  const [hygieneMonths, setHygieneMonths] = useState(0);
  const [displayedCounter, setDisplayedCounter] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipPhaseName, setTooltipPhaseName] = useState('');
  const [tooltipMonths, setTooltipMonths] = useState(0);
  const [tooltipDescription, setTooltipDescription] = useState('');
  const [tooltipColorClass, setTooltipColorClass] = useState('');

  // New states for reflection page and screen time
  const [showReflectionPage, setShowReflectionPage] = useState(false);
  const [screenTime, setScreenTime] = useState<number | null>(null);
  const [screenTimeMonths, setScreenTimeMonths] = useState(0);

  useEffect(() => {
    const updateGridColumns = () => {
      const screenWidth = window.innerWidth;
      setGridColumns(screenWidth >= 768 ? 36 : 24);
    };
    updateGridColumns();
    window.addEventListener('resize', updateGridColumns);
    return () => window.removeEventListener('resize', updateGridColumns);
  }, []);

  // Constants for total months and fractions
  const totalMonths = 1080; // Total months in a 90-year lifespan

  // Total assumed months for each activity
  const sleepMonthsTotal = Math.round(totalMonths * (7.5 / 24)); // Already implemented
  const careerMonthsTotal = 125; // Based on 90,000 hours
  const cookingMonthsTotal = 80;
  const choresMonthsTotal = 68;
  const transportMonthsTotal = 32;
  const hygieneMonthsTotal = 34;

  // Fractions of total months for activities
  const cookingFraction = cookingMonthsTotal / totalMonths;
  const choresFraction = choresMonthsTotal / totalMonths;
  const transportFraction = transportMonthsTotal / totalMonths;
  const hygieneFraction = hygieneMonthsTotal / totalMonths;

  // Existing useEffect for initial steps
  useEffect(() => {
    console.log('useEffect triggered. Current Step:', currentStep);
    if (currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 2500);
    } else if (currentStep === 2) {
      setTimeout(() => setCurrentStep(3), 3000);
    } else if (currentStep === 3) {
      setTimeout(() => setCurrentStep(4), 3000);
    } else if (currentStep === 9) {
      setDisplayedCounter(remainingMonths);
      setTimeout(() => {
        startSleepPhase();
      }, 2000);
    } else if (currentStep === 11) {
      setDisplayedCounter(remainingMonths);
      setTimeout(() => {
        startCareerPhase();
      }, 2000);
    } else if (currentStep === 14) {
      setDisplayedCounter(remainingMonths);
      setTimeout(() => {
        startCookingPhase();
      }, 2000);
    } else if (currentStep === 17) {
      setDisplayedCounter(remainingMonths);
      setTimeout(() => {
        startChoresPhase();
      }, 2000);
    } else if (currentStep === 20) {
      setDisplayedCounter(remainingMonths);
      setTimeout(() => {
        startTransportPhase();
      }, 2000);
    } else if (currentStep === 23) {
      // Start hygiene phase after delay
      setDisplayedCounter(remainingMonths);
      setTimeout(() => {
        startHygienePhase();
      }, 2000);
    } else if (currentStep === 26) {
      console.log('Handling Step 25: Showing reflection page.');
      setShowReflectionPage(true);
    } else if (currentStep === 28) {
      console.log('Handling Step 28: Proceeding to ScreenTimeInput.');
      setShowReflectionPage(false);
      setCurrentStep(29);
    } else if (currentStep === 30) {
      console.log('Handling Step 30: Starting screen time phase.');
      startScreenTimePhase();
    }
  }, [currentStep]);
  
  

  // Function to start the sleep phase
  const startSleepPhase = () => {
    // Calculate sleep months
    const sleepHoursPerDay = 7.5;
    const sleepFraction = sleepHoursPerDay / 24; // Proportion of day spent sleeping
    const sleepMonthsCalculated = Math.round(monthsLeft * sleepFraction);
    setSleepMonths(sleepMonthsCalculated);

    // Set currentPhase to 'sleep'
    setCurrentPhase('sleep');

    // Update monthsArray to mark the months to be colored
    setMonthsArray((prevMonthsArray) =>
      prevMonthsArray.map((month) => {
        if (month.index < sleepMonthsCalculated) {
          return { ...month, aboutToColor: true, newPhase: 'sleep' };
        }
        return month;
      })
    );

    // Initialize the counter
    setDisplayedCounter(remainingMonths);

    // Start the counter decrementing
    const totalAnimationTime = sleepMonthsCalculated * 1.3 + 500; // in ms
    const intervalTime = totalAnimationTime / sleepMonthsCalculated;

    let monthsColored = 0;
    const counterInterval = setInterval(() => {
      monthsColored += 1;
      setDisplayedCounter((prev) => prev - 1);

      if (monthsColored >= sleepMonthsCalculated) {
        clearInterval(counterInterval);
      }
    }, intervalTime);

    // After animation completes, update monthsArray and steps
    setTimeout(() => {
      setMonthsArray((prevMonthsArray) =>
        prevMonthsArray.map((month) => {
          if (month.aboutToColor) {
            return { ...month, aboutToColor: false, phase: 'sleep' };
          }
          return month;
        })
      );

      // Update remainingMonths for display purposes
      setRemainingMonths((prev) => prev - sleepMonthsCalculated);

      // After a short delay, display top text and proceed to next step
      setTimeout(() => {
        setCurrentStep(10);
      }, 2000); // 2-second delay after animation
    }, totalAnimationTime);
  };

  // Function to start the career phase
  const startCareerPhase = () => {
    // Career months are calculated based on the proportion of career left
    const retirementAge = 70;
    const totalCareerSpanMonths = (retirementAge - 16) * 12;
    const careerMonthsRemaining = (retirementAge - age!) * 12;
    const proportionOfCareerLeft = careerMonthsRemaining / totalCareerSpanMonths;
    const calculatedCareerMonths = Math.round(careerMonthsTotal * proportionOfCareerLeft);
    setCareerMonths(calculatedCareerMonths);

    setCurrentPhase('career');

    const startIndex = sleepMonths;
    setMonthsArray((prevMonthsArray) =>
      prevMonthsArray.map((month) => {
        if (
          month.index >= startIndex &&
          month.index < startIndex + calculatedCareerMonths
        ) {
          return { ...month, aboutToColor: true, newPhase: 'career' };
        }
        return month;
      })
    );

    // Counter and animation logic
    startPhaseAnimation(calculatedCareerMonths, 'career', startIndex);
  };

  // Function to start the cooking phase
  const startCookingPhase = () => {
    const calculatedCookingMonths = Math.round(monthsLeft * cookingFraction);
    setCookingMonths(calculatedCookingMonths);

    setCurrentPhase('cooking');

    const startIndex = sleepMonths + careerMonths;
    setMonthsArray((prevMonthsArray) =>
      prevMonthsArray.map((month) => {
        if (
          month.index >= startIndex &&
          month.index < startIndex + calculatedCookingMonths
        ) {
          return { ...month, aboutToColor: true, newPhase: 'cooking' };
        }
        return month;
      })
    );

    startPhaseAnimation(calculatedCookingMonths, 'cooking', startIndex);
  };

  // Function to start the chores phase
  const startChoresPhase = () => {
    const calculatedChoresMonths = Math.round(monthsLeft * choresFraction);
    setChoresMonths(calculatedChoresMonths);

    setCurrentPhase('chores');

    const startIndex = sleepMonths + careerMonths + cookingMonths;
    setMonthsArray((prevMonthsArray) =>
      prevMonthsArray.map((month) => {
        if (
          month.index >= startIndex &&
          month.index < startIndex + calculatedChoresMonths
        ) {
          return { ...month, aboutToColor: true, newPhase: 'chores' };
        }
        return month;
      })
    );

    startPhaseAnimation(calculatedChoresMonths, 'chores', startIndex);
  };

  // Function to start the transport phase
  const startTransportPhase = () => {
    const calculatedTransportMonths = Math.round(monthsLeft * transportFraction);
    setTransportMonths(calculatedTransportMonths);

    setCurrentPhase('transport');

    const startIndex = sleepMonths + careerMonths + cookingMonths + choresMonths;
    setMonthsArray((prevMonthsArray) =>
      prevMonthsArray.map((month) => {
        if (
          month.index >= startIndex &&
          month.index < startIndex + calculatedTransportMonths
        ) {
          return { ...month, aboutToColor: true, newPhase: 'transport' };
        }
        return month;
      })
    );

    startPhaseAnimation(calculatedTransportMonths, 'transport', startIndex);
  };

  // Function to start the hygiene phase
  const startHygienePhase = () => {
    const calculatedHygieneMonths = Math.round(monthsLeft * hygieneFraction);
    setHygieneMonths(calculatedHygieneMonths);

    setCurrentPhase('hygiene');

    const startIndex =
      sleepMonths + careerMonths + cookingMonths + choresMonths + transportMonths;
    setMonthsArray((prevMonthsArray) =>
      prevMonthsArray.map((month) => {
        if (
          month.index >= startIndex &&
          month.index < startIndex + calculatedHygieneMonths
        ) {
          return { ...month, aboutToColor: true, newPhase: 'hygiene' };
        }
        return month;
      })
    );

    startPhaseAnimation(calculatedHygieneMonths, 'hygiene', startIndex);
  };

 // Function to start the screen time phase
const startScreenTimePhase = () => {
  if (screenTime !== null) {
    const screenTimeFraction = screenTime / 24;
    let calculatedScreenTimeMonths = Math.round(monthsLeft * screenTimeFraction);
    
    // Adjust calculatedScreenTimeMonths to not exceed remainingMonths
    calculatedScreenTimeMonths = Math.min(calculatedScreenTimeMonths, remainingMonths);
    
    // Ensure calculatedScreenTimeMonths is not negative
    calculatedScreenTimeMonths = Math.max(calculatedScreenTimeMonths, 0);
    setScreenTimeMonths(calculatedScreenTimeMonths);

      const startIndex =
        sleepMonths +
        careerMonths +
        cookingMonths +
        choresMonths +
        transportMonths +
        hygieneMonths;

      setCurrentPhase('screenTime');

      setMonthsArray((prevMonthsArray) =>
        prevMonthsArray.map((month) => {
          if (
            month.index >= startIndex &&
            month.index < startIndex + calculatedScreenTimeMonths
          ) {
            return { ...month, aboutToColor: true, newPhase: 'screenTime' };
          }
          return month;
        })
      );

      // Counter and animation logic
      startPhaseAnimation(calculatedScreenTimeMonths, 'screenTime', startIndex);
    }
  };

  // Generic function to handle phase animations
  const startPhaseAnimation = (
    calculatedMonths: number,
    phaseName: string,
    startIndex: number
  ) => {
    // Initialize the counter
    setDisplayedCounter(remainingMonths);

    // Start the counter decrementing
    const totalAnimationTime = calculatedMonths * 1.3 + 500; // in ms
    const intervalTime = totalAnimationTime / calculatedMonths;

    let monthsColored = 0;
    const counterInterval = setInterval(() => {
      monthsColored += 1;
      setDisplayedCounter((prev) => prev - 1);

      if (monthsColored >= calculatedMonths) {
        clearInterval(counterInterval);
      }
    }, intervalTime);

    // After animation completes, update monthsArray and steps
    setTimeout(() => {
      setMonthsArray((prevMonthsArray) =>
        prevMonthsArray.map((month) => {
          if (month.aboutToColor) {
            return { ...month, aboutToColor: false, phase: phaseName };
          }
          return month;
        })
      );

      // Update remainingMonths for display purposes
      setRemainingMonths((prev) => prev - calculatedMonths);

      // After a short delay, display top text and proceed to next step
      setTimeout(() => {
        // Increment currentStep to show top text and button
        if (phaseName === 'career') setCurrentStep(13);
        else if (phaseName === 'cooking') setCurrentStep(16);
        else if (phaseName === 'chores') setCurrentStep(19);
        else if (phaseName === 'transport') setCurrentStep(22);
        else if (phaseName === 'hygiene') setCurrentStep(25);
        else if (phaseName === 'screenTime') setCurrentStep(31);
      }, 2000); // 2-second delay after animation
    }, totalAnimationTime);
  };

  // Modify handleNext function
  const handleNext = () => {
    console.log('handleNext called. Current Step:', currentStep);
    if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5 && age !== null) {
      // Existing age confirmation logic
      const monthsLived = age * 12;
      const monthsLeftCalculated = totalMonths - monthsLived;
      setMonthsLeft(monthsLeftCalculated);
      setRemainingMonths(monthsLeftCalculated);

      // Mark circles to be removed
      setMonthsArray((prevMonthsArray) =>
        prevMonthsArray.map((month, index) => ({
          ...month,
          aboutToRemove: index >= monthsLeftCalculated,
        }))
      );

      // Immediately increment currentStep to hide age input
      setCurrentStep(6);

      // Calculate total duration of the removal animation
      const totalCirclesToRemove = 1080 - monthsLeftCalculated;
      const delayPerCircle = 1.3; // Delay per circle in ms
      const animationDuration = 500; // Duration of each circle's animation in ms

      // The circle with the maximum delay is at index = monthsLeftCalculated
      const maxDelay = totalCirclesToRemove * delayPerCircle;
      const totalAnimationTime = maxDelay + animationDuration;

      // Total wait time until we display the top text
      const totalWaitTime = totalAnimationTime + 1000; // 1 second after last circle removed

      // After animation completes and delay, update visibility and display top text
      setTimeout(() => {
        // Update circle visibility
        setMonthsArray((prevMonthsArray) =>
          prevMonthsArray.map((month) => ({
            ...month,
            visible: month.index < monthsLeftCalculated,
            aboutToRemove: false,
          }))
        );

        // Update to the next step to display the top text
        setCurrentStep(7);

        /// Adjusted code to fix the hygiene phase initiation

// Now, bring in the "a forecast of your time" text and button
setTimeout(() => {
  setCurrentStep(8);
}, 2000); // Delay after top text appears
}, totalWaitTime);
} else if (currentStep === 7) {
  // Waiting for "a forecast of your time" text to appear
} else if (currentStep === 8) {
  // Start sleep phase after delay, grid remains visible, top text disappears
  setCurrentStep(9);
} else if (currentStep === 10) {
  // Show next button after sleep phase
  setCurrentStep(11);
} else if (currentStep === 11) {
  // Proceed to career phase
  setCurrentStep(12);
} else if (currentStep === 13) {
  // Show next button after career phase
  setCurrentStep(14);
} else if (currentStep === 14) {
  // Proceed to cooking phase
  setCurrentStep(15);
} else if (currentStep === 16) {
  // Show next button after cooking phase
  setCurrentStep(17);
} else if (currentStep === 17) {
  // Proceed to chores phase
  setCurrentStep(18);
} else if (currentStep === 19) {
  // Show next button after chores phase
  setCurrentStep(20);
} else if (currentStep === 20) {
  // Proceed to transport phase
  setCurrentStep(21);
} else if (currentStep === 22) {
  // Show next button after transport phase
  setCurrentStep(23);
} else if (currentStep === 23) {
  // Proceed to hygiene phase
  setCurrentStep(24);
} else if (currentStep === 25) {
  // Show next button after hygiene phase
  setCurrentStep(26);
  console.log('Transitioning from Step 25 to 26');
} else if (currentStep === 26) {
  // Show reflection page
  setCurrentStep(27);
  console.log('Transitioning from Step 26 to 27 (Reflection Page)');
} else if (currentStep === 27) {
  // Waiting for reflection page animations, handled in useEffect
  console.log('Current Step 27: Reflection animations ongoing.');
} else if (currentStep === 28) {
  // Proceed to screen time input
  setCurrentStep(29);
  console.log('Transitioning from Step 28 to 29 (ScreenTimeInput)');
} else if (currentStep === 29 && screenTime !== null) {
  // Proceed to screen time phase
  setCurrentStep(30);
  console.log('Transitioning from Step 29 to 30 (Screen Time Phase)');
} else if (currentStep === 30) {
  // Start screen time phase
  startScreenTimePhase();
  console.log('Starting Screen Time Phase at Step 30');
} else if (currentStep === 31) {
  // Waiting for screen time phase to finish
  console.log('Current Step 31: Screen time phase ongoing.');
} else if (currentStep === 32) {
  // Show next button after screen time phase
  setCurrentStep(33);
  console.log('Transitioning from Step 32 to 33');
} else {
  setCurrentStep((prevStep) => {
    console.log(`Incrementing currentStep from ${prevStep} to ${prevStep + 1}`);
    return prevStep + 1;
  });
}

console.log('New Current Step:', currentStep + 1);

};



// Function to handle circle click
const handleCircleClick = (month: Circle, event: React.MouseEvent) => {
  const phase = month.phase;

  // Determine the phase name and relevant information
  let phaseName = '';
  let months = 0;
  let description = '';
  let colorClass = '';

  if (phase === 'sleep') {
    phaseName = language === 'no' ? 'Søvn' : 'Sleep';
    months = sleepMonths;
    description = language === 'no' ? 'Basert på 7.5 timer per dag.' : 'Based on 7.5 hours per day.';
    colorClass = 'sleep-circle';
  } else if (phase === 'career') {
    phaseName = language === 'no' ? 'Karriere' : 'Career';
    months = careerMonths;
    description = language === 'no' ? 'Basert på arbeid til alder 70. Inklusiv utdanning.' : 'Based on working until age 70. Including Education.';
    colorClass = 'career-circle';
  } else if (phase === 'cooking') {
    phaseName = language === 'no' ? 'Mat' : 'Food';
    months = cookingMonths;
    description = language === 'no' ? 'Tid brukt på matlaging og spising daglig.' : 'Based on time spent on cooking and eating daily.';
    colorClass = 'cooking-circle';
  } else if (phase === 'chores') {
    phaseName = language === 'no' ? 'Husarbeid' : 'Chores';
    months = choresMonths;
    description = language === 'no' ? 'Tid brukt på husarbeid og gjøreoppgaver.' : 'Time spent on cleaning and household tasks.';
    colorClass = 'chores-circle';
  } else if (phase === 'transport') {
    phaseName = language === 'no' ? 'Transport' : 'Transport';
    months = transportMonths;
    description = language === 'no' ? 'Basert på gjennomsnittlig pendletid over en levetid.' : 'Based on average commute time over a lifetime.';
    colorClass = 'transport-circle';
  } else if (phase === 'hygiene') {
    phaseName = language === 'no' ? 'Hygiene' : 'Hygiene';
    months = hygieneMonths;
    description = language === 'no' ? 'Tid for hygiene daglig.' : 'Time for hygiene daily.';
    colorClass = 'hygiene-circle';
  } else if (phase === 'screenTime') {
    phaseName = language === 'no' ? 'Skjermtid' : 'Screen time';
    months = screenTimeMonths;
    description = language === 'no' ? 'Basert på din daglige skjermbruk.' : 'Based on your daily screen usage.';
    colorClass = 'screenTime-circle';
  } else if (phase === 'remaining') {
    phaseName = language === 'no' ? 'Fritid' : 'Free time';
    months = remainingMonths;
    description = language === 'no' ? 'Tilgjengelig tid etter andre aktiviteter.' : 'Available time after other activities.';
    colorClass = 'remaining-circle';
  }

  // Set the tooltip content
  setTooltipPhaseName(phaseName);
  setTooltipMonths(months);
  setTooltipDescription(description);
  setTooltipColorClass(colorClass);

  // Show tooltip at mouse position
  setTooltipPosition({ x: event.clientX, y: event.clientY });
  setShowTooltip(true);
};

// Return statement
return (
  <div className={`grid-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
    <Header isDarkMode={isDarkMode} />
    {showReflectionPage ? (
      <ReflectionPage
        isDarkMode={isDarkMode}
        language={language}
        remainingMonths={remainingMonths}
        onNext={() => setCurrentStep(28)}
      />
    ) : (
      <div className="content">
        {/* Top Text */}
        <div className="text-container">
          {currentStep >= 2 && currentStep <= 4 && (
            <TextDisplay
              text={
                language === 'no'
                  ? 'Dette er 1080 måneder'
                  : 'This is 1080 months'
              }
            />
          )}
          {currentStep >= 7 && currentStep <= 8 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${remainingMonths} måneder igjen til 90`
                  : `${remainingMonths} months till 90`
              }
            />
          )}
          {currentStep === 10 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${sleepMonths} måneder går til søvn`
                  : `${sleepMonths} months go to sleep`
              }
            />
          )}
          {currentStep === 13 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${careerMonths} måneder går til karriere`
                  : `${careerMonths} months go to career`
              }
            />
          )}
          {currentStep === 16 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${cookingMonths} måneder går til mat og spising`
                  : `${cookingMonths} months go to food and eating`
              }
            />
          )}
          {currentStep === 19 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${choresMonths} måneder går til husarbeid`
                  : `${choresMonths} months go to chores`
              }
            />
          )}
          {currentStep === 22 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${transportMonths} måneder går til transport`
                  : `${transportMonths} months go to transport`
              }
            />
          )}
          {currentStep === 25 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${hygieneMonths} måneder går til hygiene`
                  : `${hygieneMonths} months go to hygiene`
              }
            />
          )}
          {currentStep === 32 && (
            <TextDisplay
              text={
                language === 'no'
                  ? `${screenTimeMonths} måneder går til skjermtid`
                  : `${screenTimeMonths} months go to screen time`
              }
            />
          )}
        </div>

        {/* Circle Grid */}
        <CircleGrid
          monthsArray={monthsArray}
          gridColumns={gridColumns}
          currentStep={currentStep}
          className={`${currentStep >= 2 ? 'persistent-color' : ''}`}
          handleCircleClick={handleCircleClick}
        />

        {/* Counter at the Bottom */}
        {(currentPhase !== '' || [9, 11, 14, 17, 20, 23, 31].includes(currentStep)) && (
          <div className="counter">
            {displayedCounter}
          </div>
        )}

        {/* Bottom Controls */}
        <div className="footer-container">
          {currentStep === 4 ? (
            <>
              <TextDisplay
                text={language === 'no' ? '90 år..' : '90 years..'}
              />
              <ActionButton onClick={handleNext} isDarkMode={isDarkMode} />
            </>
          ) : currentStep === 5 ? (
            <>
              <AgeInput
                age={age}
                setAge={setAge}
                handleNext={handleNext}
                isDarkMode={isDarkMode}
                language={language}
              />
            </>
          ) : currentStep === 8 ? (
            <div className="footer-flex-container">
              <span className="thin-text">
                {language === 'no' ? 'se vår prognose av din tid' : 'a forecast of your time'}
              </span>
              <ActionButton onClick={handleNext} isDarkMode={isDarkMode} />
            </div>
          ) : [10, 13, 16, 19, 22, 25, 32].includes(currentStep) ? (
            <ActionButton onClick={handleNext} isDarkMode={isDarkMode} />
          ) : currentStep === 29 ? (
            <ScreenTimeInput
              screenTime={screenTime}
              setScreenTime={setScreenTime}
              handleNext={handleNext}
              isDarkMode={isDarkMode}
              language={language}
            />
          ) : (
            <div style={{ height: '2rem' }}></div>
          )}
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <Tooltip position={tooltipPosition} onClose={() => setShowTooltip(false)}>
            <div className="tooltip-content">
              <strong>
                {tooltipPhaseName}
                <span className={`tooltip-dot ${tooltipColorClass}`}></span>
              </strong>
              <div>
                {tooltipMonths} {language === 'no' ? 'måneder' : 'months'}
              </div>
              <small>{tooltipDescription}</small>
            </div>
          </Tooltip>
        )}
      </div>
    )}
  </div>
);
};

export default Grid;
