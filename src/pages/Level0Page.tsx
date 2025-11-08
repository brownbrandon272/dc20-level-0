import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import './ModePage.css';

function Level0Page() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setLevel = useCharacterStore((state) => state.setLevel);
  const setClassType = useCharacterStore((state) => state.setClassType);
  const setArmor = useCharacterStore((state) => state.setArmor);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const handleClassSelect = (classType) => {
    setLevel('Level0');
    setClassType(classType);
    setArmor({ name: 'Light Armor', pdBonus: 1 });
    setLastStep('/create/level0');

    if (character.creationMode === 'streamlined') {
      // For streamlined, go directly to ancestry choices
      // We'll auto-select options for martial/caster
      navigate('/create/level0/ancestry');
    } else {
      // For customizable, go to class-specific page
      if (classType === 'Martial') {
        navigate('/create/level0/martial');
      } else {
        navigate('/create/level0/caster');
      }
    }
  };

  return (
    <div className="level0-page">
      <div className="page-header">
        <h1>Choose Your Path</h1>
        <p className="level-badge">Level 0</p>
        <p>Will you be a martial warrior or a spell caster?</p>
      </div>

      <div className="choice-grid">
        <ChoiceCard
          title="Martial"
          description="Master weapons and physical combat. Use maneuvers and stamina to dominate the battlefield."
          onClick={() => handleClassSelect('Martial')}
        />
        <ChoiceCard
          title="Caster"
          description="Wield magical powers and spells. Use mana to cast spells and manipulate reality."
          onClick={() => handleClassSelect('Caster')}
        />
      </div>
    </div>
  );
}

export default Level0Page;
