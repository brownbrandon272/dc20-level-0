import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import ancestriesData from '../data/ancestries.json';
import './ModePage.css';

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
    <div className="ancestry-page">
      <div className="page-header">
        <h1>Choose Your Ancestry</h1>
        <p className="level-badge">Novice (Level -1)</p>
        <p>Your ancestry determines your heritage and grants you special abilities.</p>
      </div>

      <div className="choice-grid">
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
