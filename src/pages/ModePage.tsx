import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import './ModePage.css';

function ModePage() {
  const navigate = useNavigate();
  const setCreationMode = useCharacterStore((state) => state.setCreationMode);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const handleModeSelect = (mode) => {
    setCreationMode(mode);
    setLastStep('/create/mode');
    navigate('/create/name');
  };

  return (
    <div className="mode-page">
      <div className="page-header">
        <h1>Choose Your Creation Mode</h1>
        <p>How would you like to build your character?</p>
      </div>

      <div className="choice-grid">
        <ChoiceCard
          title="Streamlined"
          description="Get playing fast with simplified options. Perfect for new players or quick sessions."
          onClick={() => handleModeSelect('streamlined')}
        />
        <ChoiceCard
          title="Customizable"
          description="Build your character from the ground up with the full suite of options. For experienced players who want complete control."
          onClick={() => handleModeSelect('customizable')}
        />
      </div>
    </div>
  );
}

export default ModePage;
