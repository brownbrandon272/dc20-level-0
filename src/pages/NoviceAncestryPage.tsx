import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import ancestriesData from '../data/ancestries.json';

function NoviceAncestryPage() {
  const navigate = useNavigate();
  const setAncestry = useCharacterStore((state) => state.setAncestry);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const ancestries = Object.values(ancestriesData);

  const handleAncestrySelect = (ancestryId) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setAncestry(ancestryId);
    setLastStep('/create/novice/ancestry');
    navigate('/create/novice/weapon');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <h1 className="font-title text-3xl md:text-4xl font-bold text-brown-accent mb-2">Choose Your Ancestry</h1>
        <p className="font-body text-sm md:text-base text-brown-text mb-1">Novice <span className="level-number">(Level -2)</span></p>
        <p className="font-body text-base md:text-lg text-brown-medium">Your ancestry determines your heritage and grants you special abilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {ancestries.map((ancestry) => (
          <ChoiceCard
            key={ancestry.id}
            title={ancestry.name}
            description={`${ancestry.noviceFeature.name}: ${ancestry.noviceFeature.desc}`}
            imageUrl={ancestry.image}
            onClick={() => handleAncestrySelect(ancestry.id)}
          />
        ))}
      </div>    </div>
  );
}

export default NoviceAncestryPage;
