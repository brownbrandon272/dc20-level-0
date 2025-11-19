import React, { useState } from 'react';
import { useCharacterStore } from '../context/characterStore';
import { useNavigate, useLocation } from 'react-router-dom';
import ChoiceCard from '../components/ChoiceCard';
import martialPathsData from '../data/martialPaths.json';
import weaponsData from '../data/weapons.json';
import shieldsData from '../data/shields.json';

export default function Level0MartialPathPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const character = useCharacterStore((state) => state.character);
  const setManeuvers = useCharacterStore((state) => state.setManeuvers);
  const setAdditionalWeapon = useCharacterStore((state) => state.setAdditionalWeapon);
  const setShield = useCharacterStore((state) => state.setShield);
  const setMartialPath = useCharacterStore((state) => state.setMartialPath);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const applyMartialPath = (pathId: string) => {
    const path = martialPathsData[pathId as keyof typeof martialPathsData];

    if (!path) return;

    // Set the martial path in character
    setMartialPath(pathId);

    // Handle Knight's conditional logic
    if (pathId === 'knight') {
      const hasLongsword = character.inventory.weapon?.id === 'longsword';

      if (hasLongsword) {
        // Already has longsword, give shield from shields.json
        const buckler = shieldsData[0];
        if (buckler) {
          setShield({
            id: buckler.id,
            name: buckler.name,
            weight: buckler.weight,
            pdBonus: buckler.pdBonus,
            notes: buckler.notes
          });
        }
      } else {
        // Doesn't have longsword, give longsword
        const longsword = weaponsData.find(w => w.id === 'longsword');
        if (longsword) setAdditionalWeapon(longsword);
      }
    }
    // Handle Rogue's conditional logic
    else if (pathId === 'rogue') {
      const hasShortbow = character.inventory.weapon?.id === 'shortbow';

      if (hasShortbow) {
        // Already has shortbow, give throwing dagger
        const throwingDagger = weaponsData.find(w => w.id === 'throwingDagger');
        if (throwingDagger) setAdditionalWeapon(throwingDagger);
      } else {
        // Doesn't have shortbow, give shortbow
        const shortbow = weaponsData.find(w => w.id === 'shortbow');
        if (shortbow) setAdditionalWeapon(shortbow);
      }
    }
    // Handle Brawler - give battleaxe
    else if (pathId === 'brawler' && 'weapon' in path && path.weapon) {
      const battleaxe = weaponsData.find(w => w.id === path.weapon);
      if (battleaxe) setAdditionalWeapon(battleaxe);
    }

    // Set maneuvers (all paths have maneuvers)
    if (path.maneuvers) {
      setManeuvers(path.maneuvers);
    }
  };

  const handleContinue = () => {
    if (!selectedPath) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    applyMartialPath(selectedPath);
    navigate('/create/level0/ancestry');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">
          Choose Your Martial Path
        </h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Level 0</p>
        <p className="font-body text-lg md:text-xl text-brown-medium">
          Select a combat style that defines your approach to battle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
        {Object.values(martialPathsData).map(path => (
          <ChoiceCard
            key={path.id}
            title={path.name}
            description={path.desc}
            imageUrl={path.image}
            selected={selectedPath === path.id}
            onClick={() => setSelectedPath(path.id)}
          />
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleContinue}
          disabled={!selectedPath}
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
