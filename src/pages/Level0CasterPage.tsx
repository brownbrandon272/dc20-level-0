import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import spellsData from '../data/spells.json';

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
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">Choose Your Spell List</h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Level 0 - Caster</p>
        <p className="font-body text-lg md:text-xl text-brown-medium">Select the type of magic you want to wield.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-8 mb-8">
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
