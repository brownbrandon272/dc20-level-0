import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import weaponsData from '../data/weapons.json';
import { calculateNoviceStats } from '../utils/calculateStats';

function NoviceWeaponPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setWeapon = useCharacterStore((state) => state.setWeapon);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  // Filter weapons based on creation mode
  const weapons = character.creationMode === 'streamlined'
    ? weaponsData.filter(w => w.streamlined)
    : weaponsData;

  const handleWeaponSelect = (weapon) => {
    setWeapon(weapon);

    // Calculate Novice stats
    const stats = calculateNoviceStats(character);
    updateCalculatedStats(stats);

    setLastStep('/create/novice/weapon');
    navigate('/character/sheet');
  };

  const formatProperties = (properties) => {
    return properties.length > 0 ? properties.join(', ') : 'None';
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">Choose Your Weapon</h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Novice <span className="level-number">(Level -2)</span></p>
        <p className="font-body text-lg md:text-xl text-brown-medium">Select the weapon you'll use to defend yourself in combat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-8 mb-8">
        {weapons.map((weapon) => (
          <ChoiceCard
            key={weapon.id}
            title={weapon.name}
            description={`${weapon.hands} ${weapon.category} weapon. Damage: ${weapon.damage}. Properties: ${formatProperties(weapon.properties)}`}
            onClick={() => handleWeaponSelect(weapon)}
          />
        ))}
      </div>
    </div>
  );
}

export default NoviceWeaponPage;
