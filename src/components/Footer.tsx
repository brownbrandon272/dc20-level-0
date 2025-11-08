import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import './Footer.css';

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
                     location.pathname !== '/';

  const showBack = location.pathname !== '/';

  if (!showBack && !showReturn) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        {showBack && (
          <button className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
        )}
        {showReturn && (
          <button className="btn btn-primary" onClick={handleReturn}>
            Return to {character.name || 'Character'}
          </button>
        )}
      </div>
    </footer>
  );
}

export default Footer;
