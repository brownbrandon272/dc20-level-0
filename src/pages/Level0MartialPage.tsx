import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import maneuversData from '../data/maneuvers.json';

function Level0MartialPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setManeuvers = useCharacterStore((state) => state.setManeuvers);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const [selectedManeuvers, setSelectedManeuvers] = useState<string[]>([]);

  // Auto-selected maneuvers are always included
  const autoSelectedManeuvers = maneuversData.filter(m => m.autoSelected);
  const availableManeuvers = maneuversData.filter(m => !m.autoSelected);
  const requiredManeuvers = 3; // User selects 3, plus auto-selected ones

  const handleManeuverToggle = (maneuverId: string) => {
    if (selectedManeuvers.includes(maneuverId)) {
      setSelectedManeuvers(selectedManeuvers.filter(id => id !== maneuverId));
    } else if (selectedManeuvers.length < requiredManeuvers) {
      setSelectedManeuvers([...selectedManeuvers, maneuverId]);
    }
  };

  // Group maneuvers by category
  const maneuversByCategory = availableManeuvers.reduce((acc, maneuver) => {
    const category = (maneuver as any).maneuverCategory || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(maneuver);
    return acc;
  }, {} as Record<string, typeof availableManeuvers>);

  const categoryOrder = ['Save Maneuver', 'Defense Maneuver', 'Grapple Maneuver', 'Attack Maneuver', 'Other'];

  const canSubmit = () => {
    return selectedManeuvers.length === requiredManeuvers;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Combine auto-selected and user-selected maneuvers
    const allManeuverIds = [
      ...autoSelectedManeuvers.map(m => m.id),
      ...selectedManeuvers
    ];
    setManeuvers(allManeuverIds);

    setLastStep('/create/level0/martial');
    navigate('/create/level0/ancestry');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">
          Martial Customization
        </h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Level 0 - Martial</p>
        <p className="font-body text-lg md:text-xl text-brown-medium">
          Choose your combat maneuvers
        </p>
      </div>

      {/* Maneuver Selection */}
      <section className="mb-8">
        <h2 className="font-title text-2xl md:text-3xl font-bold text-brown-accent mb-4">
          Choose {requiredManeuvers} Maneuvers
        </h2>
        <p className="font-body text-lg text-brown-medium mb-6">
          Selected: {selectedManeuvers.length}/{requiredManeuvers}
        </p>

        {/* Grouped Maneuvers */}
        {categoryOrder.map(category => {
          const maneuvers = maneuversByCategory[category];
          if (!maneuvers || maneuvers.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h3 className="font-title text-xl font-bold text-brown-medium mb-4 border-b-2 border-brown-medium pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {maneuvers.map(maneuver => {
                  const isSelected = selectedManeuvers.includes(maneuver.id);
                  const isAction = (maneuver as any).type === 'action';

                  return (
                    <div
                      key={maneuver.id}
                      className={`bg-parchment-default rounded-lg border-2 p-5 cursor-pointer transition-all duration-200
                        ${isSelected
                          ? 'border-gold shadow-gold bg-parchment-light'
                          : 'border-brown-medium hover:border-brown-accent hover:shadow-parchment'
                        }
                        ${selectedManeuvers.length >= requiredManeuvers && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleManeuverToggle(maneuver.id)}
                    >
                      {/* Maneuver Image */}
                      {maneuver.image && (
                        <div className="flex justify-center mb-3">
                          <img
                            src={maneuver.image}
                            alt={maneuver.name}
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                      )}

                      {/* Maneuver Name and Badges */}
                      <div className="mb-2">
                        <h3 className="font-title text-lg font-semibold text-brown-text mb-2">
                          {maneuver.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-semibold ${
                            isAction
                              ? 'bg-blue-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {isAction ? 'Action' : 'Reaction'}
                          </span>
                          <span className="bg-brown-accent text-parchment-light px-2 py-1 rounded-full text-xs font-sans font-semibold whitespace-nowrap">
                            {maneuver.cost}
                          </span>
                        </div>
                      </div>

                      {/* Maneuver Description */}
                      <p className="font-body text-sm text-brown-text leading-snug">
                        {maneuver.descSummary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Continue Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="px-8 py-3 bg-brown-accent text-parchment-light font-title text-xl rounded-lg
                     border-2 border-brown-medium shadow-parchment
                     hover:bg-brown-medium hover:shadow-elevated
                     active:shadow-inset-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Continue to Ancestry
        </button>
      </div>
    </div>
  );
}

export default Level0MartialPage;
