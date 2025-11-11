import React from 'react';

interface FramedStatProps {
  label: string;
  value: string | number;
  frameType?: 'gold-circle' | 'silver-circle' | 'gold-square' | 'silver-square' | 'heart' | 'shield' | 'rectangle-gold' | 'rectangle-silver';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  tooltip?: string;
}

/**
 * FramedStat - A stat display with an ornate frame overlay
 * Used for HP, PD, MD, AD, and other stats on the character sheet
 */
function FramedStat({
  label,
  value,
  frameType = 'gold-square',
  size = 'medium',
  className = '',
  tooltip
}: FramedStatProps) {

  const sizeClasses = {
    small: 'w-16 h-16 text-lg',
    medium: 'w-24 h-24 text-2xl',
    large: 'w-32 h-32 text-3xl',
  };

  const framePaths = {
    'gold-circle': '/frame/frame-circle-gold-double-ring-rubies.png',
    'silver-circle': '/frame/frame-circle-silver-double-ring-sapphires.png',
    'gold-square': '/frame/frame-square-gold-1.png',
    'silver-square': '/frame/frame-square-silver-1.png',
    'rectangle-gold': '/frame/frame-rectangle-gold.png',
    'rectangle-silver': '/frame/frame-rectangle-silver.png',
    'heart': '/frame/frame-circle-gold-double-ring-rubies.png', // Heart shaped stat (HP)
    'shield': '/frame/frame-circle-silver-double-ring-sapphires.png', // Shield shaped stat (PD/AD)
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}
      title={tooltip}
    >
      {/* Ornate frame overlay */}
      <img
        src={framePaths[frameType]}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        <div className="font-title text-current font-bold leading-none mb-1 text-brown-text">
          {value}
        </div>
        <div className="font-sans text-xs font-semibold uppercase tracking-wide text-brown-text text-center px-2">
          {label}
        </div>
      </div>
    </div>
  );
}

export default FramedStat;
