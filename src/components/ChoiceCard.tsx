import React, { useState } from 'react';

interface ChoiceCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

function ChoiceCard({
  title,
  description,
  imageUrl,
  onClick,
  selected = false,
  disabled = false
}: ChoiceCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback image if none provided
  const displayImage = imageUrl || '/ancestry/ancestry-human-portrait-1.png';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`
        group relative bg-parchment rounded-lg overflow-hidden shadow-parchment cursor-pointer transition-all duration-300 border-2
        ${selected ? 'border-gold shadow-gold ring-2 ring-gold/30 scale-[1.02]' : 'border-brown-medium'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-parchment-lg hover:border-gold-light'}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Image Section with Gradient Overlay */}
      <div className="relative w-full aspect-square overflow-hidden bg-parchment-dark">
        {imageError ? (
          // Fallback colored background if image fails
          <div className="w-full h-full bg-gradient-to-br from-brown-accent to-brown-medium flex items-center justify-center">
            <span className="font-title text-3xl text-parchment-light opacity-50">{title[0]}</span>
          </div>
        ) : (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-4 bg-parchment">
        <h3 className="font-title text-lg md:text-xl font-semibold mb-1 text-brown-text m-0">
          {title}
        </h3>
        {description && (
          <p className="font-body text-xs md:text-sm text-brown-medium leading-snug m-0">
            {description}
          </p>
        )}
      </div>

      {/* Hover glow effect */}
      {!disabled && (
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_20px_rgba(212,175,55,0.3)]" />
        </div>
      )}
    </div>
  );
}

export default ChoiceCard;
