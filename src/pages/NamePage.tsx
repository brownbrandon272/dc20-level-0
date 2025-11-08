import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import './NamePage.css';

function NamePage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setName = useCharacterStore((state) => state.setName);
  const setLastStep = useCharacterStore((state) => state.setLastStep);
  const [inputName, setInputName] = useState(character.name || '');

  const handleNext = () => {
    if (inputName.trim()) {
      setName(inputName.trim());
      setLastStep('/create/name');
      navigate('/create/novice/ancestry');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="name-page">
      <div className="page-header">
        <h1>What is your character's name?</h1>
        <p>Choose a name that fits your character's personality and background.</p>
      </div>

      <div className="name-input-container">
        <input
          type="text"
          className="name-input"
          placeholder="Enter character name..."
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <button
          className="btn btn-primary btn-large"
          onClick={handleNext}
          disabled={!inputName.trim()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default NamePage;
