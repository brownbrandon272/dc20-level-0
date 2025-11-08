import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';

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
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">Choose Your Creation Mode</h1>
        <p className="font-body text-lg md:text-xl text-brown-medium">How would you like to build your character?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
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
