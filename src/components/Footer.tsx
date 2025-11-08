import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const character = useCharacterStore((state) => state.character);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReturn = () => {
    if (character.lastStep && character.lastStep !== location.pathname) {
      navigate(character.lastStep);
    }
  };

  const showReturn = character.lastStep &&
                     character.lastStep !== location.pathname &&
                     location.pathname !== '/' &&
                     location.pathname !== '/character/sheet';

  const showBack = location.pathname !== '/';

  if (!showBack && !showReturn) {
    return null;
  }

  return (
    <footer className="bg-parchment border-t-2 border-brown-medium py-4 px-4 mt-auto shadow-parchment">
      <div className="max-w-6xl mx-auto flex gap-3 justify-center">
        {showBack && (
          <button
            className="bg-brown-medium text-parchment-light px-6 py-2.5 rounded-ornate font-body font-semibold hover:bg-brown-accent transition-all duration-200 hover:-translate-y-0.5 shadow-parchment"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        {showReturn && (
          <button
            className="bg-gold text-brown-text px-6 py-2.5 rounded-ornate font-body font-semibold hover:bg-gold-light transition-all duration-200 hover:-translate-y-0.5 shadow-parchment-lg"
            onClick={handleReturn}
          >
            Return to {character.name || 'Character'}
          </button>
        )}
      </div>
    </footer>
  );
}

export default Footer;
