import React from 'react';

interface CharacterHeaderProps {
  playerName?: string;
  characterName: string;
  ancestry: string;
  level: string;
  combatMastery?: number;
  classType?: string;
}

/**
 * CharacterHeader - Top section of character sheet with ornate frames
 * Matches the DC20 official character sheet header layout
 */
function CharacterHeader({
  playerName,
  characterName,
  ancestry,
  level,
  combatMastery,
  classType
}: CharacterHeaderProps) {

  const getLevelDisplay = () => {
    switch (level) {
      case 'Novice':
        return 'Level -2';
      case 'PreAdventurer':
        return 'Level -1';
      case 'Level0':
        return 'Level 0';
      default:
        return level;
    }
  };

  const getLevelName = () => {
    switch (level) {
      case 'Novice':
        return 'Novice';
      case 'PreAdventurer':
        return 'Pre-Adventurer';
      case 'Level0':
        return 'Adventurer';
      default:
        return level;
    }
  };

  return (
    <div className="relative w-full mb-6 max-w-5xl mx-auto">
      {/* Ornate frame with reduced padding */}
      <div className="relative bg-parchment border-4 border-brown-accent rounded-lg shadow-parchment-lg py-6 px-8">
        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold rounded-br-lg"></div>

        {/* Three column layout with no wrapping */}
        <div className="flex flex-nowrap gap-8 items-center justify-between">
          {/* Left Column: Character Name & Ancestry */}
          <div className="space-y-3 min-w-0">
            <div>
              <div className="text-xs font-sans uppercase tracking-wide text-brown-medium mb-2">
                Character Name
              </div>
              <div className="font-title text-2xl font-bold text-brown-text">
                {characterName}
              </div>
            </div>
            <div>
              <div className="text-xs font-sans uppercase tracking-wide text-brown-medium mb-2">
                Ancestry
              </div>
              <div className="font-body text-lg text-brown-text">
                {ancestry}
              </div>
            </div>
            {classType && (
              <div>
                <div className="text-xs font-sans uppercase tracking-wide text-brown-medium mb-2">
                  Class
                </div>
                <div className="font-body text-lg text-brown-text">
                  {classType}
                </div>
              </div>
            )}
          </div>

          {/* Center: DC20 Logo */}
          <div className="flex items-center justify-center">
            <img
              src="/DC20_Logo.png"
              alt="DC20"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Right Column: Level & Combat Mastery */}
          <div className="space-y-3 text-right min-w-0">
            <div>
              <div className="text-xs font-sans uppercase tracking-wide text-brown-medium mb-2">
                Level
              </div>
              <div className="font-title text-xl font-bold text-brown-text">
                {getLevelDisplay()}
              </div>
              <div className="text-xs font-sans text-brown-medium">
                {getLevelName()}
              </div>
            </div>
            {combatMastery !== undefined && (
              <div>
                <div className="text-xs font-sans uppercase tracking-wide text-brown-medium mb-2">
                  Combat Mastery
                </div>
                <div className="font-title text-xl font-bold text-brown-text">
                  {combatMastery}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterHeader;
