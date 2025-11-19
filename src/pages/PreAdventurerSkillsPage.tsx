import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import { recalculateStats } from '../utils/calculateStats';
import otherData from '../data/other.json';

// Skill to attribute mapping
const skillAttributes: Record<string, string> = {
  'Athletics': 'might',
  'Intimidation': 'might',
  'Acrobatics': 'agility',
  'Stealth': 'agility',
  'Trickery': 'agility',
  'Animal Handling': 'charisma',
  'Influence': 'charisma',
  'Insight': 'intelligence',
  'Investigation': 'intelligence',
  'Medicine': 'intelligence',
  'Awareness': 'prime',  // Awareness uses Prime (highest attribute)
  'Survival': 'intelligence'
};

// Skill descriptions
const skillDescriptions: Record<string, string> = {
  'Athletics': 'Your skill with physical activities',
  'Intimidation': 'Your ability to assert your will',
  'Acrobatics': 'Your skill with balance and agility',
  'Stealth': 'Your ability to move unseen',
  'Trickery': 'Your skill with sleight of hand',
  'Animal Handling': 'Your skill with animals',
  'Influence': 'Your ability to persuade',
  'Insight': 'Your ability to read people',
  'Investigation': 'Your skill at finding clues',
  'Medicine': 'Your knowledge of healing',
  'Awareness': 'Your ability to see, notice, and not be surprised',
  'Survival': 'Your skill in the wilderness'
};

const attributeNames = {
  might: 'Might',
  agility: 'Agility',
  charisma: 'Charisma',
  intelligence: 'Intelligence'
};

function PreAdventurerSkillsPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setLevel = useCharacterStore((state) => state.setLevel);
  const setAttributes = useCharacterStore((state) => state.setAttributes);
  const setSkills = useCharacterStore((state) => state.setSkills);
  const setLanguages = useCharacterStore((state) => state.setLanguages);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  // Standard Array: 3, 1, 0, -2, then +2 bonus points to allocate
  const [attributes, setAttributesLocal] = useState({
    might: '',
    agility: '',
    charisma: '',
    intelligence: ''
  });

  const [availablePoints] = useState([3, 1, 0, -2]);
  const [usedPoints, setUsedPoints] = useState<number[]>([]);
  const [bonusPoints, setBonusPoints] = useState({
    might: 0,
    agility: 0,
    charisma: 0,
    intelligence: 0
  });
  const bonusPointsAvailable = 2;
  const bonusPointsUsed = Object.values(bonusPoints).reduce((sum, val) => sum + val, 0);

  // Skills now use checkboxes - each checked skill = adopted (adds +2 to modifier)
  const [skills, setSkillsLocal] = useState<Record<string, boolean>>({});
  const [languages, setLanguagesLocal] = useState<Record<string, number>>({});

  // Calculate final attributes
  const finalAttributes = {
    might: (parseInt(attributes.might as any) || 0) + bonusPoints.might,
    agility: (parseInt(attributes.agility as any) || 0) + bonusPoints.agility,
    charisma: (parseInt(attributes.charisma as any) || 0) + bonusPoints.charisma,
    intelligence: (parseInt(attributes.intelligence as any) || 0) + bonusPoints.intelligence
  };

  // Calculate Prime (highest attribute)
  const primeValue = Math.max(finalAttributes.might, finalAttributes.agility, finalAttributes.charisma, finalAttributes.intelligence);
  const primeAttributeName = Object.entries(finalAttributes).find(([_, val]) => val === primeValue)?.[0] || 'might';

  // Calculate skill points based on base attributes + bonus points
  const skillPointsAvailable = 5 + finalAttributes.intelligence;
  const skillPointsUsed = Object.values(skills).filter(adopted => adopted).length;

  // Language points: 2 total (Fluent=2pts, Limited=1pt)
  const languagePointsAvailable = 2;
  const languagePointsUsed = Object.values(languages).reduce((sum, val) => sum + val, 0);

  // Group skills by attribute
  const skillsByAttribute: Record<string, string[]> = {
    might: [],
    agility: [],
    charisma: [],
    intelligence: [],
    prime: []  // Special group for Prime-based skills
  };

  otherData.skills.forEach(skill => {
    const attr = skillAttributes[skill];
    if (attr && skillsByAttribute[attr]) {
      skillsByAttribute[attr].push(skill);
    }
  });

  const handleAttributeChange = (attr: string, value: string) => {
    const oldValue = attributes[attr as keyof typeof attributes];
    const attrKey = attr as keyof typeof attributes;

    // If value is empty string (Select...), reset to empty and clear bonus points
    if (value === '') {
      setAttributesLocal({
        ...attributes,
        [attr]: ''
      });
      // Clear bonus points for this attribute
      setBonusPoints({
        ...bonusPoints,
        [attrKey]: 0
      });
      // Remove old value from used points only if it was a valid number
      if (oldValue !== '') {
        setUsedPoints(usedPoints.filter(p => p !== oldValue));
      }
      return;
    }

    const numValue = parseInt(value);

    // Remove old value from used points only if it was a valid number
    let newUsedPoints = usedPoints;
    if (oldValue !== '') {
      newUsedPoints = usedPoints.filter(p => p !== oldValue);
    }

    // Add new value if it's available
    if (availablePoints.includes(numValue) && !newUsedPoints.includes(numValue)) {
      // Check if new value + existing bonus exceeds +3
      const currentBonus = bonusPoints[attrKey];
      const newFinalValue = numValue + currentBonus;

      // If exceeds +3, reset bonus to 0
      if (newFinalValue > 3) {
        setBonusPoints({
          ...bonusPoints,
          [attrKey]: 0
        });
      }

      setAttributesLocal({
        ...attributes,
        [attr]: numValue as any
      });
      setUsedPoints([...newUsedPoints, numValue]);
    }
  };

  const handleBonusPointChange = (attr: string, checkboxIndex: number) => {
    const currentBonus = bonusPoints[attr as keyof typeof bonusPoints];
    const baseValue = parseInt(attributes[attr as keyof typeof attributes] as any) || 0;

    // Toggle checkbox logic
    let newValue: number;
    if (checkboxIndex === 0) {
      // First checkbox
      newValue = currentBonus === 0 ? 1 : 0;
    } else {
      // Second checkbox
      newValue = currentBonus === 2 ? 1 : (currentBonus === 1 ? 2 : 1);
    }

    const newTotal = bonusPointsUsed - currentBonus + newValue;
    const finalValue = baseValue + newValue;

    // Prevent going over +3 total or exceeding bonus point limits
    if (newValue >= 0 && newValue <= 2 && newTotal <= bonusPointsAvailable && finalValue <= 3) {
      setBonusPoints({
        ...bonusPoints,
        [attr]: newValue
      });
    }
  };

  const handleSkillToggle = (skill: string) => {
    const isCurrentlyAdopted = skills[skill] || false;
    const newAdoptedCount = skillPointsUsed + (isCurrentlyAdopted ? -1 : 1);

    // Only allow toggle if we have points available or we're unchecking
    if (isCurrentlyAdopted || newAdoptedCount <= skillPointsAvailable) {
      setSkillsLocal({
        ...skills,
        [skill]: !isCurrentlyAdopted
      });
    }
  };

  const handleLanguageChange = (lang: string, level: string) => {
    setLanguagesLocal({
      ...languages,
      [lang]: parseInt(level)
    });
  };

  const canSubmit = () => {
    return usedPoints.length === 4 &&
           bonusPointsUsed === bonusPointsAvailable &&
           skillPointsUsed === skillPointsAvailable &&
           languagePointsUsed === languagePointsAvailable;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Convert boolean skills to numeric (adopted skill = 2 points)
    const numericSkills: Record<string, number> = {};
    Object.entries(skills).forEach(([skill, adopted]) => {
      if (adopted) {
        numericSkills[skill] = 2;
      }
    });

    setLevel('PreAdventurer');
    setAttributes(finalAttributes);
    setSkills(numericSkills);
    setLanguages(languages);

    const newCharacter = {
      ...character,
      level: 'PreAdventurer' as const,
      attributes: finalAttributes,
      skills: numericSkills,
      languages
    };

    const stats = recalculateStats(newCharacter);
    updateCalculatedStats(stats);

    setLastStep('/create/pre-adventurer/skills');
    navigate('/character/sheet');
  };

  // Render skill group by attribute
  const renderSkillGroup = (attr: string) => {
    const skillList = skillsByAttribute[attr];
    if (!skillList || skillList.length === 0) return null;

    // Special handling for Prime attribute
    const attrModifier = attr === 'prime'
      ? primeValue
      : finalAttributes[attr as keyof typeof finalAttributes];

    const displayName = attr === 'prime'
      ? 'Prime'
      : attributeNames[attr as keyof typeof attributeNames];

    return (
      <div>
        <h3 className="font-title text-lg font-bold text-brown-accent mb-3 uppercase">
          {displayName} <span className="italic">({attrModifier >= 0 ? '+' : ''}{attrModifier})</span>
        </h3>
        <div className="space-y-3">
          {skillList.map(skill => {
            const isAdopted = skills[skill] || false;
            const totalModifier = attrModifier + (isAdopted ? 2 : 0);

            return (
              <div
                key={skill}
                className="border-2 border-brown-medium rounded-lg p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="font-body font-bold text-brown-accent">
                      {skill}
                    </h4>
                    <p className="font-body text-xs text-brown-medium italic">
                      {skillDescriptions[skill]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-body text-sm text-brown-medium whitespace-nowrap">
                      Learn
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      disabled={!isAdopted && skillPointsUsed >= skillPointsAvailable}
                      className={`w-6 h-6 border-2 border-gray-600 rounded flex items-center justify-center ${
                        isAdopted ? 'bg-gold-accent' : 'bg-white'
                      } ${!isAdopted && skillPointsUsed >= skillPointsAvailable ? 'bg-gray-300' : ''} disabled:cursor-not-allowed hover:border-gold-accent`}
                    >
                      {isAdopted ? <span className="text-brown-accent font-bold">✓</span> : (
                        (!isAdopted && skillPointsUsed >= skillPointsAvailable) && <span className="text-gray-500 font-bold">✕</span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="border-2 border-brown-medium rounded py-1 px-3 bg-parchment-light/30 text-center">
                  <span className="font-title text-2xl font-bold text-gold-accent">
                    {totalModifier >= 0 ? '+' : ''}{totalModifier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="font-title text-3xl md:text-4xl font-bold text-brown-accent mb-2">
          Customize Your Character
        </h1>
        <p className="font-body text-sm md:text-base text-brown-text">
          Pre-Adventurer <span className="text-gold-accent font-semibold">(Level -1)</span>
        </p>
      </div>

      {/* Attributes Section */}
      <div className="bg-parchment-light border-4 border-brown-medium rounded-lg p-6 shadow-parchment mb-8">
        <h2 className="font-title text-2xl font-bold text-brown-accent mb-4 text-center">
          Attributes
        </h2>

        <p className="font-body text-sm text-brown-medium mb-4 text-center">
          Step 1: Assign standard array (3, 1, 0, -2)<br />
          Step 2: Add 2 bonus points • Bonus used: <span className="font-bold text-gold-accent">{bonusPointsUsed}/2</span>
        </p>

        {/* Attributes Grid - 4 cards horizontally */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.keys(attributes).map(attr => {
            const attrKey = attr as keyof typeof attributes;
            const finalValue = finalAttributes[attrKey];
            const baseValue = parseInt(attributes[attrKey] as any) || 0;
            const bonus = bonusPoints[attrKey];

            // Determine impact text
            const impactText = {
              might: 'Impacts AD and HP',
              agility: 'Impacts PD and Initiative',
              intelligence: 'Impacts PD and Skills',
              charisma: 'Impacts AD and Grit'
            }[attrKey] || '';

            return (
              <div
                key={attr}
                className="border-3 border-brown-medium rounded-2xl p-4 bg-parchment-light/50"
              >
                <h3 className="font-title text-xl font-bold text-brown-accent mb-1 text-center uppercase">
                  {attributeNames[attrKey]}
                </h3>
                <p className="font-body text-xs text-brown-medium mb-3 text-center italic">
                  {impactText}
                </p>

                {/* Base Value Selector with X button */}
                <div className="flex items-center gap-1 mb-3">
                  <select
                    value={attributes[attrKey]}
                    onChange={(e) => handleAttributeChange(attr, e.target.value)}
                    className="flex-1 px-2 py-1.5 border-2 border-gray-600 rounded font-body text-center bg-white focus:outline-none focus:border-gold-accent"
                  >
                    <option value="">Select...</option>
                    {availablePoints.map(point => (
                      <option
                        key={point}
                        value={point}
                        disabled={usedPoints.includes(point) && attributes[attrKey] !== point}
                      >
                        {point >= 0 ? '+' : ''}{point}
                      </option>
                    ))}
                  </select>
                  {attributes[attrKey] !== '' && (
                    <button
                      type="button"
                      onClick={() => handleAttributeChange(attr, '')}
                      className="w-6 h-6 flex items-center justify-center border-2 border-gray-600 rounded bg-white hover:bg-red-100 font-bold text-brown-accent"
                      title="Clear selection"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Bonus Point Checkboxes */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <label className="font-body text-sm text-brown-medium">Bonus:</label>
                  <button
                    type="button"
                    onClick={() => handleBonusPointChange(attr, 0)}
                    disabled={
                      (bonus === 0 && bonusPointsUsed >= bonusPointsAvailable) ||
                      (bonus === 0 && baseValue + 1 > 3)
                    }
                    className={`w-5 h-5 border-2 border-gray-600 rounded flex items-center justify-center ${
                      bonus >= 1 ? 'bg-gold-accent' : 'bg-white'
                    } ${(bonus === 0 && bonusPointsUsed >= bonusPointsAvailable) || (bonus === 0 && baseValue + 1 > 3) ? 'bg-gray-300' : ''} disabled:cursor-not-allowed hover:border-gold-accent`}
                  >
                    {bonus >= 1 ? <span className="text-brown-accent font-bold text-sm">✓</span> : (
                      ((bonus === 0 && bonusPointsUsed >= bonusPointsAvailable) || (bonus === 0 && baseValue + 1 > 3)) && <span className="text-gray-500 font-bold text-sm">✕</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBonusPointChange(attr, 1)}
                    disabled={
                      (bonus < 1 && bonusPointsUsed >= bonusPointsAvailable) ||
                      (bonus === 1 && bonusPointsUsed >= bonusPointsAvailable) ||
                      (baseValue + 2 > 3)
                    }
                    className={`w-5 h-5 border-2 border-gray-600 rounded flex items-center justify-center ${
                      bonus === 2 ? 'bg-gold-accent' : 'bg-white'
                    } ${((bonus < 1 && bonusPointsUsed >= bonusPointsAvailable) || (bonus === 1 && bonusPointsUsed >= bonusPointsAvailable) || (baseValue + 2 > 3)) ? 'bg-gray-300' : ''} disabled:cursor-not-allowed hover:border-gold-accent`}
                  >
                    {bonus === 2 ? <span className="text-brown-accent font-bold text-sm">✓</span> : (
                      (((bonus < 1 && bonusPointsUsed >= bonusPointsAvailable) || (bonus === 1 && bonusPointsUsed >= bonusPointsAvailable) || (baseValue + 2 > 3))) && <span className="text-gray-500 font-bold text-sm">✕</span>
                    )}
                  </button>
                  <span className="font-body text-xs text-brown-medium">= +{bonus}</span>
                </div>

                {/* Final Value */}
                <div className="text-center border-2 border-brown-medium rounded-lg py-2 bg-white">
                  <span className="font-title text-4xl font-bold text-gold-accent">
                    {attributes[attrKey] !== '' ? `${finalValue >= 0 ? '+' : ''}${finalValue}` : '?'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prime Display */}
        <div className="border-3 border-brown-medium rounded-2xl p-4 bg-parchment-light/50 max-w-sm mx-auto">
          <h3 className="font-title text-xl font-bold text-brown-accent mb-1 text-center uppercase">
            Prime
          </h3>
          <p className="font-body text-xs text-brown-medium mb-2 text-center italic">
            Impacts Attack, Spells, and Save DC
          </p>
          <p className="font-body text-sm text-brown-medium mb-2 text-center">
            Based on {attributeNames[primeAttributeName as keyof typeof attributeNames]}
          </p>
          <div className="text-center border-2 border-brown-medium rounded-lg py-2 bg-white">
            <span className="font-title text-4xl font-bold text-gold-accent">
              {primeValue >= 0 ? '+' : ''}{primeValue}
            </span>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-parchment-light border-4 border-brown-medium rounded-lg p-6 shadow-parchment mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-title text-2xl font-bold text-brown-accent">
            Skills
          </h2>
          <p className="font-body text-lg text-brown-medium">
            Skills Remaining: <span className="font-bold text-gold-accent">{skillPointsAvailable - skillPointsUsed}/{skillPointsAvailable}</span>
          </p>
        </div>

        {/* Prime at top-left above first skill group */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1: Prime + Might Skills */}
          <div className="space-y-4">
            {/* Prime Display with Awareness skill */}
            <div className="border-3 border-brown-medium rounded-2xl p-4 bg-parchment-light/50">
              <h3 className="font-title text-lg font-bold text-brown-accent mb-1 uppercase">
                Prime <span className="italic">({primeValue >= 0 ? '+' : ''}{primeValue})</span>
              </h3>
              <p className="font-body text-xs text-brown-medium italic mb-3">
                {attributeNames[primeAttributeName as keyof typeof attributeNames]}
              </p>

              {/* Awareness skill display */}
              {(skillsByAttribute.prime || []).map(skill => {
                const isAdopted = skills[skill] || false;
                const totalModifier = primeValue + (isAdopted ? 2 : 0);

                return (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-body font-bold text-brown-accent text-sm">
                          {skill}
                        </h4>
                        <p className="font-body text-xs text-brown-medium italic">
                          {skillDescriptions[skill]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="font-body text-xs text-brown-medium whitespace-nowrap">
                          Learn
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          disabled={!isAdopted && skillPointsUsed >= skillPointsAvailable}
                          className={`w-5 h-5 border-2 border-gray-600 rounded flex items-center justify-center ${
                            isAdopted ? 'bg-gold-accent' : 'bg-white'
                          } ${!isAdopted && skillPointsUsed >= skillPointsAvailable ? 'bg-gray-300' : ''} disabled:cursor-not-allowed hover:border-gold-accent`}
                        >
                          {isAdopted ? <span className="text-brown-accent font-bold text-xs">✓</span> : (
                            (!isAdopted && skillPointsUsed >= skillPointsAvailable) && <span className="text-gray-500 font-bold text-xs">✕</span>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="border-2 border-brown-medium rounded py-1 px-2 bg-parchment-light/30 text-center">
                      <span className="font-title text-xl font-bold text-gold-accent">
                        {totalModifier >= 0 ? '+' : ''}{totalModifier}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Might Skills */}
            {renderSkillGroup('might')}
          </div>

          {/* Column 2: Agility Skills */}
          <div className="space-y-4">
            {renderSkillGroup('agility')}
          </div>

          {/* Column 3: Charisma Skills */}
          <div className="space-y-4">
            {renderSkillGroup('charisma')}
          </div>

          {/* Column 4: Intelligence Skills */}
          <div className="space-y-4">
            {renderSkillGroup('intelligence')}
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-parchment-light border-4 border-brown-medium rounded-lg p-6 shadow-parchment mb-6">
        <h2 className="font-title text-2xl font-bold text-brown-accent mb-4 text-center">
          Languages
        </h2>

        <p className="font-body text-sm text-brown-medium mb-4 text-center">
          Allocate 2 language points (Fluent = 2 pts, Limited = 1 pt) • Used: <span className="font-bold text-gold-accent">{languagePointsUsed}/2</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherData.languages.map(lang => (
            <div
              key={lang}
              className="border-2 border-brown-medium rounded-lg p-4 bg-white"
            >
              <div className="flex items-center justify-between">
                <label className="font-body text-brown-accent font-semibold flex-1">
                  {lang}
                </label>
                <select
                  value={languages[lang] || 0}
                  onChange={(e) => handleLanguageChange(lang, e.target.value)}
                  className="px-3 py-1.5 border-2 border-gray-600 rounded font-body bg-white focus:outline-none focus:border-gold-accent"
                >
                  <option value="0">None</option>
                  <option value="1">Limited (1)</option>
                  <option value="2">Fluent (2)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="bg-brown-accent text-parchment-light px-12 py-4 rounded-ornate font-body font-semibold text-xl min-w-[300px] hover:bg-gold-accent hover:text-brown-accent transition-all duration-200 hover:scale-105 shadow-parchment disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default PreAdventurerSkillsPage;
