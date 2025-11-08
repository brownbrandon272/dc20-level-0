import React from 'react';
import './ChoiceCard.css';

function ChoiceCard({ title, description, imageUrl, onClick, selected = false, disabled = false }) {
  const placeholderImage = imageUrl || `https://via.placeholder.com/300x200/8b5cf6/ffffff?text=${encodeURIComponent(title)}`;

  return (
    <div
      className={`choice-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="choice-card-image">
        <img src={placeholderImage} alt={title} />
      </div>
      <div className="choice-card-content">
        <h3 className="choice-card-title">{title}</h3>
        {description && (
          <p className="choice-card-description">{description}</p>
        )}
      </div>
    </div>
  );
}

export default ChoiceCard;
