import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import spellsData from '../data/spells.json';
import './ModePage.css';

function Level0CasterPage() {
  const navigate = useNavigate();
  const setSpellList = useCharacterStore((state) => state.setSpellList);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const spellLists = Object.values(spellsData);

  const handleSpellListSelect = (spellListId) => {
    setSpellList(spellListId);
    setLastStep('/create/level0/caster');
    navigate('/create/level0/ancestry');
  };

  return (
    <div className="level0-caster-page">
      <div className="page-header">
        <h1>Choose Your Spell List</h1>
        <p className="level-badge">Level 0 - Caster</p>
        <p>Select the type of magic you want to wield.</p>
      </div>

      <div className="choice-grid">
        {spellLists.map((spellList) => (
          <ChoiceCard
            key={spellList.id}
            title={spellList.name}
            description={`${spellList.desc} Includes spells like: ${spellList.spells.map(s => s.name).join(', ')}`}
            onClick={() => handleSpellListSelect(spellList.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Level0CasterPage;
