import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import maneuversData from '../data/maneuvers.json';

function Level0MartialPage() {
  const navigate = useNavigate();
  const setManeuvers = useCharacterStore((state) => state.setManeuvers);
  const setShield = useCharacterStore((state) => state.setShield);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const [choice, setChoice] = useState(null); // 'shield' or 'weapon'
  const [selectedManeuvers, setSelectedManeuvers] = useState(['attack']);

  const availableManeuvers = maneuversData.filter(m => !m.autoSelected);
  const requiredManeuvers = 3;

  const handleManeuverToggle = (maneuverId) => {
    if (selectedManeuvers.includes(maneuverId)) {
      setSelectedManeuvers(selectedManeuvers.filter(id => id !== maneuverId));
    } else if (selectedManeuvers.length < requiredManeuvers) {
      setSelectedManeuvers([...selectedManeuvers, maneuverId]);
    }
  };

  const canSubmit = () => {
    return choice && selectedManeuvers.length === requiredManeuvers;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    if (choice === 'shield') {
      setShield({ name: 'Shield', pdBonus: 1 });
    }
    // Note: Additional weapon would be set here if choice === 'weapon'

    setManeuvers(selectedManeuvers);
    setLastStep('/create/level0/martial');
    navigate('/create/level0/ancestry');
  };

  return (
    <div className="level0-martial-page">
      <div className="page-header">
        <h1>Martial Customization</h1>
        <p className="level-badge">Level 0 - Martial</p>
      </div>

      <div className="martial-content">
        <div className="section-card">
          <h2>Choose Your Style</h2>
          <div className="choice-buttons">
            <button
              className={`choice-button ${choice === 'shield' ? 'selected' : ''}`}
              onClick={() => setChoice('shield')}
            >
              Shield (+1 PD)
            </button>
            <button
              className={`choice-button ${choice === 'weapon' ? 'selected' : ''}`}
              onClick={() => setChoice('weapon')}
            >
              Additional Weapon
            </button>
          </div>
        </div>

        <div className="section-card">
          <h2>Choose {requiredManeuvers} Maneuvers</h2>
          <p className="section-desc">
            Selected: {selectedManeuvers.length}/{requiredManeuvers}
          </p>
          <div className="maneuvers-grid">
            {availableManeuvers.map(maneuver => (
              <div
                key={maneuver.id}
                className={`maneuver-card ${selectedManeuvers.includes(maneuver.id) ? 'selected' : ''}`}
                onClick={() => handleManeuverToggle(maneuver.id)}
              >
                <h3>{maneuver.name}</h3>
                <span className="maneuver-cost">{maneuver.cost}</span>
                <p>{maneuver.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={!canSubmit()}
        >
          Continue to Ancestry
        </button>
      </div>
    </div>
  );
}

export default Level0MartialPage;
