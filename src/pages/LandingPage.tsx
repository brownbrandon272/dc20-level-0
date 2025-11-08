import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import LocalStorageModal from '../components/LocalStorageModal';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const hasExistingCharacter = useCharacterStore((state) => state.hasExistingCharacter);
  const character = useCharacterStore((state) => state.character);
  const resetCharacter = useCharacterStore((state) => state.resetCharacter);

  const handleCreateCharacter = () => {
    if (hasExistingCharacter()) {
      setShowModal(true);
    } else {
      navigate('/create/mode');
    }
  };

  const handleReturn = () => {
    setShowModal(false);
    if (character.lastStep) {
      navigate(character.lastStep);
    } else {
      navigate('/character/sheet');
    }
  };

  const handleNewCharacter = () => {
    setShowModal(false);
    resetCharacter();
    navigate('/create/mode');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to the DC20 Character Creator</h1>
        <p className="landing-tagline">
          Create your Novice character and level them up to Level 0 for your next one-shot adventure!
        </p>

        <div className="landing-buttons">
          <button className="btn btn-primary btn-large" onClick={handleCreateCharacter}>
            Create a Character
          </button>
          <button className="btn btn-outline btn-large" disabled>
            DMing a Session (Coming Soon)
          </button>
        </div>

        <div className="landing-info">
          <div className="info-card">
            <h3>Quick Start</h3>
            <p>Use the Streamlined mode to create a character in minutes with pre-selected options.</p>
          </div>
          <div className="info-card">
            <h3>Customizable</h3>
            <p>Dive deep with the Customizable mode to build your character exactly how you want.</p>
          </div>
          <div className="info-card">
            <h3>Progressive Leveling</h3>
            <p>Experience your character's growth from Novice to Level 0, step by step.</p>
          </div>
        </div>
      </div>

      {showModal && (
        <LocalStorageModal
          characterName={character.name}
          onReturn={handleReturn}
          onNewCharacter={handleNewCharacter}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default LandingPage;
