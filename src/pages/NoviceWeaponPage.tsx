import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import WeaponPropertyTooltip from '../components/WeaponPropertyTooltip';
import weaponsData from '../data/weapons.json';
import { calculateNoviceStats } from '../utils/calculateStats';

function NoviceWeaponPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setWeapon = useCharacterStore((state) => state.setWeapon);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);

  // Filter weapons based on creation mode
  const weapons = character.creationMode === 'streamlined'
    ? weaponsData.filter(w => w.streamlined)
    : weaponsData;

  const handleWeaponSelect = (weapon) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setWeapon(weapon);

    // Calculate Novice stats
    const stats = calculateNoviceStats(character);
    updateCalculatedStats(stats);

    navigate('/character/sheet');
  };

  const renderPropertiesWithTooltips = (properties: string[]) => {
    if (properties.length === 0) {
      return <span className="font-body text-brown-medium">None</span>;
    }

    return (
      <span>
        {properties.map((prop, index) => (
          <React.Fragment key={prop}>
            <WeaponPropertyTooltip propertyName={prop}>
              {prop}
            </WeaponPropertyTooltip>
            {index < properties.length - 1 && ', '}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <h1 className="font-title text-3xl md:text-4xl font-bold text-brown-accent mb-2">Choose Your Weapon</h1>
        <p className="font-body text-sm md:text-base text-brown-text mb-1">Novice <span className="level-number">(Level -2)</span></p>
        <p className="font-body text-base md:text-lg text-brown-medium">Select the weapon you'll use to defend yourself in combat.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {weapons.map((weapon) => (
          <div key={weapon.id} className="flex flex-col">
            <ChoiceCard
              title={weapon.name}
              description={`${weapon.hands} ${weapon.category} weapon. Damage: ${weapon.damage}.`}
              imageUrl={weapon.icon}
              onClick={() => handleWeaponSelect(weapon)}
            />
            <div className="mt-2 px-2 text-sm">
              <span className="font-title text-brown-accent">Properties: </span>
              {renderPropertiesWithTooltips(weapon.properties)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoviceWeaponPage;
