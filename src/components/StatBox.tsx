import React, { useState } from 'react';

function StatBox({ label, value, tooltip, shape = 'square', color = 'primary' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const shapeClasses = {
    square: '',
    heart: '[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] min-w-[140px] min-h-[140px] md:min-w-[120px] md:min-h-[120px]',
    shield: '[clip-path:polygon(50%_0%,100%_20%,100%_70%,50%_100%,0%_70%,0%_20%)] min-w-[140px] min-h-[140px] md:min-w-[120px] md:min-h-[120px]',
  };

  const colorClasses = {
    primary: 'border-2 border-brown-accent',
    success: 'border-2 border-green-600',
    secondary: 'border-2 border-blue-500',
    heart: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-0',
    shield: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0',
  };

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center p-4 md:p-6 bg-parchment rounded-lg shadow-parchment
        cursor-help transition-all duration-200 min-w-[100px] md:min-w-[120px]
        hover:-translate-y-0.5 hover:shadow-parchment-lg
        ${shapeClasses[shape] || ''}
        ${colorClasses[color] || colorClasses.primary}
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="font-body text-4xl md:text-5xl font-bold leading-none mb-2">{value}</div>
      <div className="font-sans text-xs md:text-sm font-semibold uppercase tracking-wide text-center">{label}</div>
      {tooltip && showTooltip && (
        <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-brown-text text-white px-4 py-3 rounded-md text-sm whitespace-normal md:whitespace-nowrap max-w-[200px] md:max-w-none z-[100] shadow-parchment-lg pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-brown-text">
          {tooltip}
        </div>
      )}
    </div>
  );
}

export default StatBox;
