import React from 'react';

function ChoiceCard({ title, description, imageUrl, onClick, selected = false, disabled = false }) {
  const placeholderImage = imageUrl || `https://via.placeholder.com/300x200/8b5cf6/ffffff?text=${encodeURIComponent(title)}`;

  return (
    <div
      className={`
        bg-parchment rounded-lg overflow-hidden shadow-parchment cursor-pointer transition-all duration-300 border-2
        ${selected ? 'border-green-600 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]' : 'border-transparent'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-parchment-lg hover:border-brown-accent'}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="w-full h-48 md:h-52 overflow-hidden bg-parchment-dark">
        <img src={placeholderImage} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 md:p-6">
        <h3 className="font-title text-xl md:text-2xl font-semibold mb-2 text-brown-text m-0">{title}</h3>
        {description && (
          <p className="font-body text-sm md:text-base text-brown-medium leading-relaxed m-0">{description}</p>
        )}
      </div>
    </div>
  );
}

export default ChoiceCard;
