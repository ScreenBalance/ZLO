// src/components/Tooltip.tsx

import React from 'react';
import './Tooltip.css';

interface TooltipProps {
  position: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ position, onClose, children }) => {
  return (
    <div className="tooltip-overlay" onClick={onClose}>
      <div
        className="tooltip-box"
        style={{ top: position.y, left: position.x }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
