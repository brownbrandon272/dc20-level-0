import React, { useState, useEffect } from 'react';
import { useCharacterStore } from '../context/characterStore';
import { useNavigate, useLocation } from 'react-router-dom';
import ChoiceCard from '../components/ChoiceCard';
import weaponsData from '../data/weapons.json';

export default function Level0EquipmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const character = useCharacterStore((state) => state.character);
  const classType = character.classType;
  const creationMode = character.creationMode;
  const setArmor = useCharacterStore((state) => state.setArmor);
  const setShield = useCharacterStore((state) => state.setShield);
  const setAdditionalWeapon = useCharacterStore((state) => state.setAdditionalWeapon);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const [hasLightArmor, setHasLightArmor] = useState(false);
  const [equipmentChoice, setEquipmentChoice] = useState<'shield' | 'weapon' | null>(null);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);

  // For streamlined mode, auto-apply light armor and skip to next page
  useEffect(() => {
    if (creationMode === 'streamlined') {
      // Auto-apply light armor for everyone
      setArmor({ name: 'Light Armor', pdBonus: 1 });
      setLastStep(location.pathname);

      // Navigate based on class
      if (classType === 'Martial') {
        // Martial path will handle shield/weapon
        navigate('/create/level0/martial-path');
      } else {
        // Casters select spells first
        navigate('/create/level0/caster');
      }
    }
  }, [creationMode, classType, setArmor, setLastStep, location.pathname, navigate]);

  const handleContinue = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Apply light armor if selected
    if (hasLightArmor) {
      setArmor({ name: 'Light Armor', pdBonus: 1 });
    }

    // Apply shield or weapon (Martial only)
    if (classType === 'Martial') {
      if (equipmentChoice === 'shield') {
        setShield({ name: 'Shield', pdBonus: 2 });
      } else if (equipmentChoice === 'weapon' && selectedWeaponId) {
        const weapon = weaponsData.find(w => w.id === selectedWeaponId);
        if (weapon) {
          setAdditionalWeapon(weapon);
        }
      }
    }

    setLastStep(location.pathname);

    // Customizable mode navigation
    if (classType === 'Martial') {
      navigate('/create/level0/martial');
    } else {
      navigate('/create/level0/caster');
    }
  };

  // For customizable mode, require light armor to be selected
  const canContinue = () => {
    if (creationMode === 'customizable') {
      // Must select light armor
      if (!hasLightArmor) return false;
      // Martial must also choose shield or weapon
      if (classType === 'Martial') {
        if (!equipmentChoice) return false;
        // If weapon is chosen, must also select a specific weapon
        if (equipmentChoice === 'weapon' && !selectedWeaponId) return false;
      }
    }
    return true;
  };

  // Don't render anything for streamlined mode (will auto-redirect)
  if (creationMode === 'streamlined') {
    return null;
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">
          Equipment Selection
        </h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Level 0</p>
        <p className="font-body text-lg md:text-xl text-brown-medium">
          Choose your starting equipment
        </p>
      </div>

      {/* Armor Section */}
      <section className="mb-8">
        <h2 className="font-title text-2xl md:text-3xl font-bold text-brown-accent mb-4">
          Armor
        </h2>
        <div className="bg-parchment-default rounded-lg border-2 border-brown-medium p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="lightArmor"
              checked={hasLightArmor}
              onChange={(e) => setHasLightArmor(e.target.checked)}
              className="w-5 h-5 rounded border-brown-medium text-brown-accent focus:ring-gold focus:ring-2"
            />
            <div>
              <span className="font-body text-lg font-semibold text-brown-text">
                Light Armor
              </span>
              <span className="font-body text-brown-medium ml-2">
                (+1 PD)
              </span>
              <p className="font-body text-sm text-brown-medium mt-1">
                Basic protection that doesn't hinder movement
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Shield/Additional Weapon Section (Martial Only) */}
      {classType === 'Martial' && (
        <section className="mb-8">
          <h2 className="font-title text-2xl md:text-3xl font-bold text-brown-accent mb-4">
            Choose One
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ChoiceCard
              title="Shield"
              description="+2 PD, enables shield maneuvers like Raise Shield"
              imageUrl="/maneuver/maneuver-raise-shield.png"
              selected={equipmentChoice === 'shield'}
              onClick={() => {
                setEquipmentChoice('shield');
                setSelectedWeaponId(null); // Clear weapon selection when switching
              }}
            />
            <ChoiceCard
              title="Additional Weapon"
              description="Dual wield or have a backup weapon for different situations"
              imageUrl="/weapon/weapon-longsword.png"
              selected={equipmentChoice === 'weapon'}
              onClick={() => setEquipmentChoice('weapon')}
            />
          </div>

          {/* Weapon Selection (shown when weapon is chosen) */}
          {equipmentChoice === 'weapon' && (
            <div className="mt-8">
              <h3 className="font-title text-xl md:text-2xl font-bold text-brown-accent mb-4">
                Select Your Additional Weapon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weaponsData.map((weapon) => (
                  <div
                    key={weapon.id}
                    className={`bg-parchment-default rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
                      ${selectedWeaponId === weapon.id
                        ? 'border-gold shadow-gold bg-parchment-light'
                        : 'border-brown-medium hover:border-brown-accent hover:shadow-parchment'
                      }`}
                    onClick={() => setSelectedWeaponId(weapon.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-title text-lg font-semibold text-brown-text mb-1">
                          {weapon.name}
                        </h4>
                        <p className="font-body text-sm text-brown-medium mb-2">
                          {weapon.damage} • {weapon.hands}
                        </p>
                        {weapon.properties && weapon.properties.length > 0 && (
                          <p className="font-body text-xs text-brown-medium">
                            {weapon.properties.join(', ')}
                          </p>
                        )}
                      </div>
                      {weapon.icon && (
                        <img
                          src={weapon.icon}
                          alt={weapon.name}
                          className="w-12 h-12 object-contain flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Continue Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleContinue}
          disabled={!canContinue()}
          className="px-8 py-3 bg-brown-accent text-parchment-light font-title text-xl rounded-lg
                     border-2 border-brown-medium shadow-parchment
                     hover:bg-brown-medium hover:shadow-elevated
                     active:shadow-inset-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
