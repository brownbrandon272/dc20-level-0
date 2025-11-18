import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';

function NamePage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setName = useCharacterStore((state) => state.setName);
  const setLastStep = useCharacterStore((state) => state.setLastStep);
  const [inputName, setInputName] = useState(character.name || '');

  const handleNext = () => {
    if (inputName.trim()) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">What is your character's name?</h1>
        <p className="font-body text-lg md:text-xl text-brown-medium">Choose a name that fits your character's personality and background.</p>
      </div>

      <div className="max-w-[600px] mx-auto flex flex-col gap-6 p-6 md:p-8 bg-parchment rounded-lg shadow-parchment">
        <input
          type="text"
          className="w-full p-4 text-lg md:text-xl font-body border-2 border-brown-medium rounded-md transition-all duration-200 focus:border-brown-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(139,69,19,0.1)] bg-parchment-light text-brown-text"
          placeholder="Enter character name..."
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <button
          className="w-full bg-brown-accent text-parchment-light px-8 py-4 rounded-ornate font-body font-semibold text-lg hover:bg-brown-medium transition-all duration-200 hover:-translate-y-0.5 shadow-parchment disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
