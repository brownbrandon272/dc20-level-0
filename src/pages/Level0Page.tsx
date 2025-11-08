import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';

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
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">Choose Your Path</h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Level 0</p>
        <p className="font-body text-lg md:text-xl text-brown-medium">Will you be a martial warrior or a spell caster?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
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
