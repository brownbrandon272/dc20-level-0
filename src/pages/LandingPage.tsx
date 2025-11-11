import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import LocalStorageModal from '../components/LocalStorageModal';

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
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-[900px] w-full">
        {/* DC20 Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/DC20_Logo.png"
            alt="DC20"
            className="h-32 md:h-40 w-auto object-contain"
          />
        </div>

        <h1 className="font-title text-5xl md:text-6xl font-bold text-gold mb-4">
          Welcome to DC20 Level 0
        </h1>
        <p className="font-body text-xl md:text-2xl text-brown-text mb-12 leading-relaxed">
          Create your character from Novice (Level -2) to Level 0 for your next one-shot adventure!
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          <button
            className="bg-brown-accent text-parchment-light px-8 py-4 rounded-ornate font-body font-semibold text-lg min-w-[200px] hover:bg-brown-medium transition-all duration-200 hover:-translate-y-0.5 shadow-parchment-lg"
            onClick={handleCreateCharacter}
          >
            Create a Character
          </button>
          <button
            className="bg-transparent border-2 border-brown-accent text-brown-accent px-8 py-4 rounded-ornate font-body font-semibold text-lg min-w-[200px] opacity-50 cursor-not-allowed"
            disabled
          >
            DMing a Session (Coming Soon)
          </button>
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
