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
    setAncestry(ancestryId);
    setLastStep('/create/novice/ancestry');
    navigate('/create/novice/weapon');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">Choose Your Ancestry</h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Novice <span className="level-number">(Level -2)</span></p>
        <p className="font-body text-lg md:text-xl text-brown-medium">Your ancestry determines your heritage and grants you special abilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-8 mb-8">
        {ancestries.map((ancestry) => (
          <ChoiceCard
            key={ancestry.id}
            title={ancestry.name}
            description={`${ancestry.noviceFeature.name}: ${ancestry.noviceFeature.desc}`}
            onClick={() => handleAncestrySelect(ancestry.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default NoviceAncestryPage;
