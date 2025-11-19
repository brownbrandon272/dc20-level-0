import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import spellsData from '../data/spells.json';

function Level0CasterPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setSpellList = useCharacterStore((state) => state.setSpellList);

  const creationMode = character.creationMode;
  const isStreamlined = creationMode === 'streamlined';
  const spellLists = Object.values(spellsData);

  const handleSpellListSelect = (spellListId) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setSpellList(spellListId);
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
          <div key={spellList.id} className="flex flex-col gap-4">
            <ChoiceCard
              title={spellList.name}
              description={spellList.desc}
              imageUrl={spellList.image}
              onClick={() => handleSpellListSelect(spellList.id)}
            />

            {/* Show spell details based on mode */}
            <div className="bg-parchment-default rounded-lg border-2 border-brown-medium p-4">
              <h3 className="font-title text-lg font-semibold text-brown-accent mb-3">
                Spells Included:
              </h3>
              <div className="space-y-2">
                {spellList.spells.map((spell) => (
                  <div key={spell.id} className="font-body text-sm">
                    <span className="font-semibold text-brown-text">{spell.name}</span>
                    {isStreamlined ? (
                      // Extreme summary for streamlined
                      <span className="text-brown-medium"> - {spell.descExtremeSummary}</span>
                    ) : (
                      // Full summary for customizable
                      <p className="text-brown-medium mt-1">{spell.descSummary}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Level0CasterPage;
