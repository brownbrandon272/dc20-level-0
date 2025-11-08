import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import otherData from '../data/other.json';
import { applyArchetype, recalculateStats } from '../utils/calculateStats';

function PreAdventurerPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setLevel = useCharacterStore((state) => state.setLevel);
  const setAttributes = useCharacterStore((state) => state.setAttributes);
  const setArchetype = useCharacterStore((state) => state.setArchetype);
  const setSkills = useCharacterStore((state) => state.setSkills);
  const setLanguages = useCharacterStore((state) => state.setLanguages);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const archetypes = Object.values(otherData.archetypes);

  const handleArchetypeSelect = (archetypeId) => {
    // Set level
    setLevel('PreAdventurer');

    if (character.creationMode === 'streamlined') {
      // Apply archetype
      const archetypeData = applyArchetype(archetypeId, otherData);
      setArchetype(archetypeId);
      setAttributes(archetypeData.attributes);

      // Auto-set skills (assign suggested skills with 1 point each)
      const skills = {};
      archetypeData.suggestedSkills.forEach(skill => {
        skills[skill] = 1;
      });
      setSkills(skills);

      // Auto-set languages (assign suggested languages as fluent)
      const languages = { 'Common': 2 }; // Common is fluent
      archetypeData.suggestedLanguages.slice(0, 1).forEach(lang => {
        languages[lang] = 2; // Fluent
      });
      setLanguages(languages);

      // Recalculate stats
      const newCharacter = {
        ...character,
        level: 'PreAdventurer',
        attributes: archetypeData.attributes,
        skills,
        languages
      };
      const stats = recalculateStats(newCharacter);
      updateCalculatedStats(stats);

      setLastStep('/create/pre-adventurer');
      navigate('/character/sheet');
    } else {
      // Customizable mode - go to attribute allocation
      setLastStep('/create/pre-adventurer');
      navigate('/create/pre-adventurer/skills');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">Pre-Adventurer Setup</h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Pre-Adventurer <span className="level-number">(Level -1)</span></p>
        <p className="font-body text-lg md:text-xl text-brown-medium">
          {character.creationMode === 'streamlined'
            ? 'Choose an archetype that fits your character concept.'
            : 'Set up your attributes, skills, and languages.'}
        </p>
      </div>

      {character.creationMode === 'streamlined' ? (
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-8 mb-8">
          {archetypes.map((archetype) => (
            <ChoiceCard
              key={archetype.id}
              title={archetype.name}
              description={archetype.desc}
              onClick={() => handleArchetypeSelect(archetype.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            className="bg-brown-accent text-parchment-light px-8 py-4 rounded-ornate font-body font-semibold text-lg min-w-[300px] hover:bg-brown-medium transition-all duration-200 hover:-translate-y-0.5 shadow-parchment"
            onClick={() => handleArchetypeSelect(null)}
          >
            Continue to Attribute & Skill Setup
          </button>
        </div>
      )}
    </div>
  );
}

export default PreAdventurerPage;
