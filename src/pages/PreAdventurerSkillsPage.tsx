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
  'Awareness': 'intelligence',
  'Survival': 'intelligence'
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

  const [skills, setSkillsLocal] = useState<Record<string, number>>({});
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

  // Calculate skill points based on base attributes + bonus points
  const skillPointsAvailable = 5 + finalAttributes.intelligence;
  const skillPointsUsed = Object.values(skills).reduce((sum, val) => sum + val, 0);

  // Language points: 2 total (Fluent=2pts, Limited=1pt)
  const languagePointsAvailable = 2;
  const languagePointsUsed = Object.values(languages).reduce((sum, val) => sum + val, 0);

  // Group skills by attribute
  const skillsByAttribute: Record<string, string[]> = {
    might: [],
    agility: [],
    charisma: [],
    intelligence: []
  };

  otherData.skills.forEach(skill => {
    const attr = skillAttributes[skill];
    if (attr && skillsByAttribute[attr]) {
      skillsByAttribute[attr].push(skill);
    }
  });

  const handleAttributeChange = (attr: string, value: string) => {
    const oldValue = attributes[attr as keyof typeof attributes];

    // If value is empty string (Select...), reset to empty
    if (value === '') {
      setAttributesLocal({
        ...attributes,
        [attr]: ''
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
      setAttributesLocal({
        ...attributes,
        [attr]: numValue as any
      });
      setUsedPoints([...newUsedPoints, numValue]);
    }
  };

  const handleBonusPointChange = (attr: string, change: number) => {
    const newValue = bonusPoints[attr as keyof typeof bonusPoints] + change;
    const newTotal = bonusPointsUsed - bonusPoints[attr as keyof typeof bonusPoints] + newValue;
    const baseValue = parseInt(attributes[attr as keyof typeof attributes] as any) || 0;
    const finalValue = baseValue + newValue;

    // Prevent going over +3 total or exceeding bonus point limits
    if (newValue >= 0 && newValue <= 2 && newTotal <= bonusPointsAvailable && finalValue <= 3) {
      setBonusPoints({
        ...bonusPoints,
        [attr]: newValue
      });
    }
  };

  const handleSkillChange = (skill: string, value: string) => {
    setSkillsLocal({
      ...skills,
      [skill]: parseInt(value) || 0
    });
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

    setLevel('PreAdventurer');
    setAttributes(finalAttributes);
    setSkills(skills);
    setLanguages(languages);

    const newCharacter = {
      ...character,
      level: 'PreAdventurer' as const,
      attributes: finalAttributes,
      skills,
      languages
    };

    const stats = recalculateStats(newCharacter);
    updateCalculatedStats(stats);

    setLastStep('/create/pre-adventurer/skills');
    navigate('/character/sheet');
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

      {/* Responsive Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Attributes Section - Left Column */}
        <div className="flex-1">
          <div className="bg-parchment-light border-4 border-brown-medium rounded-lg p-6 shadow-parchment">
            <h2 className="font-title text-2xl font-bold text-brown-accent mb-4 text-center">
              Attributes
            </h2>

            <p className="font-body text-sm text-brown-medium mb-4 text-center">
              Step 1: Assign standard array (3, 1, 0, -2)<br />
              Step 2: Add 2 bonus points • Bonus used: <span className="font-bold text-gold-accent">{bonusPointsUsed}/2</span>
            </p>

            {/* Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {Object.keys(attributes).map(attr => {
                const attrKey = attr as keyof typeof attributes;
                const finalValue = finalAttributes[attrKey];
                return (
                  <div
                    key={attr}
                    className="relative bg-cover bg-center p-6 rounded-lg transition-transform hover:scale-105"
                    style={{
                      backgroundImage: 'url(/frame/frame-rectangle-gold.png)',
                      backgroundSize: '100% 100%',
                      minHeight: '120px'
                    }}
                  >
                    <div className="absolute inset-0 bg-parchment-light/90 rounded-lg" />
                    <div className="relative z-10">
                      <label className="block font-title text-lg font-bold text-brown-accent mb-2 text-center">
                        {attributeNames[attrKey]}
                      </label>

                      {/* Base Value Selector */}
                      <select
                        value={attributes[attrKey]}
                        onChange={(e) => handleAttributeChange(attr, e.target.value)}
                        className="w-full px-3 py-2 mb-2 border-2 border-brown-medium rounded font-body text-center bg-parchment-light focus:outline-none focus:border-gold-accent"
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

                      {/* Bonus Points Controls */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => handleBonusPointChange(attr, -1)}
                          disabled={bonusPoints[attrKey] === 0}
                          className="px-3 py-1 bg-brown-medium text-parchment-light rounded hover:bg-brown-accent disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                        >
                          −
                        </button>
                        <span className="font-body text-sm text-brown-medium px-2">
                          Bonus: <span className="font-bold">+{bonusPoints[attrKey]}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBonusPointChange(attr, 1)}
                          disabled={bonusPoints[attrKey] >= 2 || bonusPointsUsed >= bonusPointsAvailable || finalValue >= 3}
                          className="px-3 py-1 bg-brown-medium text-parchment-light rounded hover:bg-brown-accent disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Final Value */}
                      <div className="text-center">
                        <span className="font-title text-3xl font-bold text-gold-accent">
                          {finalValue >= 0 ? '+' : ''}{finalValue || '?'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prime Display */}
            <div
              className="relative bg-cover bg-center p-4 rounded-lg"
              style={{
                backgroundImage: 'url(/frame/frame-rectangle-gold.png)',
                backgroundSize: '100% 100%'
              }}
            >
              <div className="absolute inset-0 bg-parchment-light/90 rounded-lg" />
              <div className="relative z-10 text-center">
                <span className="font-title text-lg font-bold text-brown-accent">Prime</span>
                <span className="font-body text-sm text-brown-medium block">
                  (Equal to your highest attribute)
                </span>
                <span className="font-title text-2xl font-bold text-gold-accent">
                  {primeValue >= 0 ? '+' : ''}{primeValue}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section - Right Column */}
        <div className="flex-1">
          <div className="bg-parchment-light border-4 border-brown-medium rounded-lg p-6 shadow-parchment">
            <h2 className="font-title text-2xl font-bold text-brown-accent mb-4 text-center">
              Skills
            </h2>

            <p className="font-body text-sm text-brown-medium mb-4 text-center">
              Allocate {skillPointsAvailable} skill points • Used: <span className="font-bold text-gold-accent">{skillPointsUsed}/{skillPointsAvailable}</span>
            </p>

            {/* Skills by Attribute */}
            <div className="space-y-4">
              {Object.entries(skillsByAttribute).map(([attr, skillList]) => {
                if (skillList.length === 0) return null;
                const attrModifier = finalAttributes[attr as keyof typeof finalAttributes];

                return (
                  <div key={attr}>
                    <h3 className="font-title text-lg font-bold text-brown-accent mb-2">
                      {attributeNames[attr as keyof typeof attributeNames]} Skills
                      <span className="text-sm font-body text-brown-medium ml-2">
                        (Base: {attrModifier >= 0 ? '+' : ''}{attrModifier})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {skillList.map(skill => {
                        const skillPoints = skills[skill] || 0;
                        const totalModifier = attrModifier + skillPoints;

                        return (
                          <div
                            key={skill}
                            className="relative bg-cover bg-center p-3 rounded"
                            style={{
                              backgroundImage: 'url(/frame/frame-rectangle-silver.png)',
                              backgroundSize: '100% 100%'
                            }}
                          >
                            <div className="absolute inset-0 bg-parchment-light/80 rounded" />
                            <div className="relative z-10 flex items-center justify-between">
                              <label className="font-body text-brown-text flex-1">
                                {skill}
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  min="0"
                                  max="3"
                                  value={skills[skill] || 0}
                                  onChange={(e) => handleSkillChange(skill, e.target.value)}
                                  className="w-16 px-2 py-1 border-2 border-brown-medium rounded text-center bg-parchment-light focus:outline-none focus:border-gold-accent"
                                />
                                <span className="font-title text-lg font-bold text-gold-accent min-w-[50px] text-right">
                                  {totalModifier >= 0 ? '+' : ''}{totalModifier}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Languages Section - Full Width */}
      <div className="mb-6">
        <div className="bg-parchment-light border-4 border-brown-medium rounded-lg p-6 shadow-parchment">
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
                className="relative bg-cover bg-center p-3 rounded"
                style={{
                  backgroundImage: 'url(/frame/frame-rectangle-silver.png)',
                  backgroundSize: '100% 100%'
                }}
              >
                <div className="absolute inset-0 bg-parchment-light/80 rounded" />
                <div className="relative z-10 flex items-center justify-between">
                  <label className="font-body text-brown-text flex-1">
                    {lang}
                  </label>
                  <select
                    value={languages[lang] || 0}
                    onChange={(e) => handleLanguageChange(lang, e.target.value)}
                    className="px-3 py-1 border-2 border-brown-medium rounded font-body bg-parchment-light focus:outline-none focus:border-gold-accent"
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
