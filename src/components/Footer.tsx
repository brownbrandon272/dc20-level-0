import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const character = useCharacterStore((state) => state.character);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const handleBack = () => {
    // Save current location before going back
    setLastStep(location.pathname);
    navigate(-1);
  };

  const handleReturn = () => {
    if (character.lastStep && character.lastStep !== location.pathname) {
      const destination = character.lastStep;
      // Clear lastStep when returning forward
      setLastStep('');
      navigate(destination);
    }
  };

  // Show "Return to..." button only when:
  // 1. lastStep exists and is different from current page
  // 2. Current page is NOT the landing page
  // 3. User has navigated backwards (lastStep was set by Back button)
  const showReturn = character.lastStep &&
                     character.lastStep !== location.pathname &&
                     location.pathname !== '/';

  const showBack = location.pathname !== '/';

  if (!showBack && !showReturn) {
    return null;
  }

  return (
    <footer className="bg-parchment border-t-2 border-brown-medium py-4 px-4 mt-auto shadow-parchment">
      <div className="max-w-6xl mx-auto flex gap-3 justify-center">
        {showBack && (
          <button
            className="bg-brown-medium text-parchment-light px-8 py-3 rounded-ornate font-body font-semibold hover:bg-brown-accent transition-all duration-200 hover:-translate-y-0.5 shadow-parchment"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        {showReturn && (
          <button
            className="bg-gold text-brown-text px-8 py-3 rounded-ornate font-body font-semibold hover:bg-gold-light transition-all duration-200 hover:-translate-y-0.5 shadow-parchment-lg"
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
