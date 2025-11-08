import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import ChoiceCard from '../components/ChoiceCard';
import weaponsData from '../data/weapons.json';
import { calculateNoviceStats } from '../utils/calculateStats';
import './ModePage.css';

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
    <div className="weapon-page">
      <div className="page-header">
        <h1>Choose Your Weapon</h1>
        <p className="level-badge">Novice (Level -1)</p>
        <p>Select the weapon you'll use to defend yourself in combat.</p>
      </div>

      <div className="choice-grid">
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
