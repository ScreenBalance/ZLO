// src/components/CircleGrid.tsx

import React from 'react';
import './CircleGrid.css';

interface Circle {
  index: number;
  visible: boolean;
  aboutToRemove?: boolean;
  aboutToColor?: boolean;
  phase: string; // 'remaining', 'sleep', etc.
  newPhase?: string;
}

interface CircleGridProps {
  monthsArray: Circle[];
  gridColumns: number;
  currentStep: number;
  className?: string;
  handleCircleClick?: (month: Circle, event: React.MouseEvent) => void;
}

const CircleGrid: React.FC<CircleGridProps> = ({
  monthsArray,
  gridColumns,
  currentStep,
  className,
  handleCircleClick,
}) => {
  return (
    <div
      className={`circle-grid ${className || ''} ${
        currentStep === 1 ? 'initial-wave' : ''
      } ${currentStep === 2 ? 'second-wave' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, 10px)`,
      }}
    >
      {monthsArray.map((month) => (
        <div
          key={month.index}
          className={`circle ${!month.visible ? 'hidden-circle' : ''} ${
            month.aboutToRemove ? 'about-to-remove' : ''
          } ${month.aboutToColor ? 'about-to-color' : ''} ${month.phase}`}
          style={{ '--i': month.index } as React.CSSProperties}
          onClick={(event) => handleCircleClick && handleCircleClick(month, event)}
        ></div>
      ))}
    </div>
  );
};

export default CircleGrid;
