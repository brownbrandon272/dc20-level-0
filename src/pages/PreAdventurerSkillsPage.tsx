import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import { recalculateStats } from '../utils/calculateStats';
import otherData from '../data/other.json';

function PreAdventurerSkillsPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setLevel = useCharacterStore((state) => state.setLevel);
  const setAttributes = useCharacterStore((state) => state.setAttributes);
  const setSkills = useCharacterStore((state) => state.setSkills);
  const setLanguages = useCharacterStore((state) => state.setLanguages);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  // Standard Array: 3, 1, 0, -2
  const [attributes, setAttributesLocal] = useState({
    might: 0,
    agility: 0,
    charisma: 0,
    intelligence: 0
  });

  const [availablePoints] = useState([3, 1, 0, -2]);
  const [usedPoints, setUsedPoints] = useState([]);

  const [skills, setSkillsLocal] = useState({});
  const [languages, setLanguagesLocal] = useState({ Common: 2 }); // Common starts fluent

  const skillPointsAvailable = 5 + attributes.intelligence;
  const skillPointsUsed = Object.values(skills).reduce((sum, val) => sum + val, 0);

  const languagePointsAvailable = 2;
  const languagePointsUsed = Object.values(languages).filter(v => v > 0).length - 1; // Exclude Common

  const handleAttributeChange = (attr, value) => {
    const numValue = parseInt(value);
    const oldValue = attributes[attr];

    // Remove old value from used points
    const newUsedPoints = usedPoints.filter(p => p !== oldValue);

    // Add new value
    if (availablePoints.includes(numValue) && !newUsedPoints.includes(numValue)) {
      setAttributesLocal({
        ...attributes,
        [attr]: numValue
      });
      setUsedPoints([...newUsedPoints, numValue]);
    }
  };

  const handleSkillChange = (skill, value) => {
    setSkillsLocal({
      ...skills,
      [skill]: parseInt(value) || 0
    });
  };

  const handleLanguageChange = (lang, level) => {
    setLanguagesLocal({
      ...languages,
      [lang]: parseInt(level)
    });
  };

  const canSubmit = () => {
    return usedPoints.length === 4 &&
           skillPointsUsed === skillPointsAvailable &&
           languagePointsUsed === languagePointsAvailable;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    setLevel('PreAdventurer');
    setAttributes(attributes);
    setSkills(skills);
    setLanguages(languages);

    const newCharacter = {
      ...character,
      level: 'PreAdventurer',
      attributes,
      skills,
      languages
    };

    const stats = recalculateStats(newCharacter);
    updateCalculatedStats(stats);

    setLastStep('/create/pre-adventurer/skills');
    navigate('/character/sheet');
  };

  return (
    <div className="pre-adventurer-skills-page">
      <div className="page-header">
        <h1>Customize Your Character</h1>
        <p className="level-badge">Pre-Adventurer <span className="level-number">(Level -1)</span></p>
      </div>

      <div className="customization-content">
        <div className="section-card">
          <h2>Attributes</h2>
          <p className="section-desc">Assign the standard array (3, 1, 0, -2) to your attributes.</p>
          <div className="attributes-form">
            {Object.keys(attributes).map(attr => (
              <div key={attr} className="form-group">
                <label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</label>
                <select value={attributes[attr]} onChange={(e) => handleAttributeChange(attr, e.target.value)}>
                  <option value="0">Select...</option>
                  {availablePoints.map(point => (
                    <option
                      key={point}
                      value={point}
                      disabled={usedPoints.includes(point) && attributes[attr] !== point}
                    >
                      {point >= 0 ? '+' : ''}{point}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2>Skills</h2>
          <p className="section-desc">
            Allocate {skillPointsAvailable} skill points. Points used: {skillPointsUsed}/{skillPointsAvailable}
          </p>
          <div className="skills-form">
            {otherData.skills.map(skill => (
              <div key={skill} className="form-group-inline">
                <label>{skill}</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={skills[skill] || 0}
                  onChange={(e) => handleSkillChange(skill, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2>Languages</h2>
          <p className="section-desc">
            Choose {languagePointsAvailable} additional languages. Points used: {languagePointsUsed}/{languagePointsAvailable}
          </p>
          <div className="languages-form">
            {otherData.languages.map(lang => (
              <div key={lang} className="form-group-inline">
                <label>{lang}</label>
                <select
                  value={languages[lang] || 0}
                  onChange={(e) => handleLanguageChange(lang, e.target.value)}
                  disabled={lang === 'Common'}
                >
                  <option value="0">None</option>
                  <option value="1">Limited</option>
                  <option value="2">Fluent</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={!canSubmit()}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default PreAdventurerSkillsPage;
