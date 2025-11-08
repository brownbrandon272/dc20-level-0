import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import { recalculateStats } from '../utils/calculateStats';
import ancestriesData from '../data/ancestries.json';

function Level0AncestryPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const addAncestryLevel0Choice = useCharacterStore((state) => state.addAncestryLevel0Choice);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const [selectedChoices, setSelectedChoices] = useState([]);

  const ancestry = ancestriesData[character.ancestry.id];
  const features = ancestry?.level0Features || [];

  const handleFeatureToggle = (featureId) => {
    if (selectedChoices.includes(featureId)) {
      setSelectedChoices(selectedChoices.filter(id => id !== featureId));
    } else {
      setSelectedChoices([...selectedChoices, featureId]);
    }
  };

  const handleSubmit = () => {
    selectedChoices.forEach(choiceId => {
      addAncestryLevel0Choice(choiceId);
    });

    // Recalculate stats with Level 0 bonuses
    const newCharacter = {
      ...character,
      ancestry: {
        ...character.ancestry,
        level0Choices: selectedChoices
      }
    };

    const stats = recalculateStats(newCharacter);
    updateCalculatedStats(stats);

    setLastStep('/create/level0/ancestry');
    navigate('/character/sheet');
  };

  return (
    <div className="level0-ancestry-page">
      <div className="page-header">
        <h1>{ancestry?.name} Features</h1>
        <p className="level-badge">Level 0</p>
        <p>Choose features from your ancestry to enhance your character.</p>
      </div>

      <div className="features-content">
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${selectedChoices.includes(feature.id) ? 'selected' : ''}`}
              onClick={() => handleFeatureToggle(feature.id)}
            >
              <h3>{feature.name}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={selectedChoices.length === 0}
        >
          Complete Character
        </button>
      </div>
    </div>
  );
}

export default Level0AncestryPage;
