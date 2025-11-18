import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import { recalculateStats } from '../utils/calculateStats';
import ancestriesData from '../data/ancestries.json';
import otherData from '../data/other.json';
import type { Attributes } from '../types';

function Level0AncestryPage() {
  const navigate = useNavigate();
  const character = useCharacterStore((state) => state.character);
  const setAncestryLevel0Choices = useCharacterStore((state) => state.setAncestryLevel0Choices);
  const setAncestryFeatureChoice = useCharacterStore((state) => state.setAncestryFeatureChoice);
  const setAttributes = useCharacterStore((state) => state.setAttributes);
  const setSkills = useCharacterStore((state) => state.setSkills);
  const updateCalculatedStats = useCharacterStore((state) => state.updateCalculatedStats);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [attributeIncreaseChoice, setAttributeIncreaseChoice] = useState<string>('');
  const [skillExpertiseChoice, setSkillExpertiseChoice] = useState<string>('');

  // Initialize state from existing character data when component mounts
  useEffect(() => {
    if (character.ancestry.level0Choices.length > 0) {
      setSelectedChoices(character.ancestry.level0Choices);
    }
    if (character.ancestry.level0ChoiceDetails.attributeIncrease) {
      setAttributeIncreaseChoice(character.ancestry.level0ChoiceDetails.attributeIncrease);
    }
    if (character.ancestry.level0ChoiceDetails.skillExpertise) {
      setSkillExpertiseChoice(character.ancestry.level0ChoiceDetails.skillExpertise);
    }
  }, []);

  const ancestry = ancestriesData[character.ancestry.id as keyof typeof ancestriesData];
  const features = ancestry?.level0Features || [];

  // Calculate if all required features are selected
  const allFeaturesSelected = () => {
    // Count total features
    const totalFeatures = features.length;
    // Count selected features (including dropdowns)
    return selectedChoices.length === totalFeatures;
  };

  const handleFeatureToggle = (featureId: string) => {
    if (selectedChoices.includes(featureId)) {
      setSelectedChoices(selectedChoices.filter(id => id !== featureId));
    } else {
      setSelectedChoices([...selectedChoices, featureId]);
    }
  };

  const handleAttributeIncrease = (attribute: string) => {
    // Start with current attributes
    let newAttributes = { ...character.attributes };

    // If there was a previous selection, remove that bonus first
    if (attributeIncreaseChoice && attributeIncreaseChoice !== attribute) {
      newAttributes[attributeIncreaseChoice as keyof Attributes] =
        newAttributes[attributeIncreaseChoice as keyof Attributes] - 1;
    }

    // Apply the new bonus
    newAttributes[attribute as keyof Attributes] =
      newAttributes[attribute as keyof Attributes] + 1;

    setAttributes(newAttributes);
    setAttributeIncreaseChoice(attribute);

    // Store the choice for display
    setAncestryFeatureChoice('attributeIncrease', attribute);

    // Add to selected choices if not already there
    if (!selectedChoices.includes('attributeIncrease')) {
      setSelectedChoices([...selectedChoices, 'attributeIncrease']);
    }
  };

  const handleSkillExpertise = (skill: string) => {
    // Start with current skills
    let newSkills = { ...character.skills };

    // If there was a previous selection, remove that bonus first
    if (skillExpertiseChoice && skillExpertiseChoice !== skill) {
      newSkills[skillExpertiseChoice] = (newSkills[skillExpertiseChoice] || 1) - 1;
    }

    // Apply the new bonus
    newSkills[skill] = (newSkills[skill] || 0) + 1;

    setSkills(newSkills);
    setSkillExpertiseChoice(skill);

    // Store the choice for display
    setAncestryFeatureChoice('skillExpertise', skill);

    // Add to selected choices if not already there
    if (!selectedChoices.includes('skillExpertise')) {
      setSelectedChoices([...selectedChoices, 'skillExpertise']);
    }
  };

  const getAvailableAttributes = () => {
    return Object.keys(character.attributes).filter(attr =>
      character.attributes[attr as keyof Attributes] < 3
    );
  };

  const handleSubmit = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Replace the entire level0Choices array instead of appending
    setAncestryLevel0Choices(selectedChoices);

    // Recalculate stats with Level 0 bonuses
    const newCharacter = {
      ...character,
      ancestry: {
        ...character.ancestry,
        level0Choices: selectedChoices
      }
    };

    const stats = recalculateStats(newCharacter);
    updateCalculatedStats(stats);

    setLastStep('/create/level0/ancestry');
    navigate('/character/sheet');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="font-title text-4xl md:text-5xl font-bold text-brown-accent mb-2">
          {ancestry?.name} Features
        </h1>
        <p className="font-body text-base md:text-lg text-brown-text mb-1">Level 0</p>
        <p className="font-body text-lg md:text-xl text-brown-medium">
          Choose features from your ancestry to enhance your character
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {features.map((feature) => {
          // Display-only features (click to select)
          if (feature.displayOnly) {
            return (
              <div
                key={feature.id}
                className={`bg-parchment-default rounded-lg border-2 p-6 cursor-pointer transition-all duration-200
                  ${selectedChoices.includes(feature.id)
                    ? 'border-gold shadow-gold bg-parchment-light'
                    : 'border-brown-medium hover:border-brown-accent hover:shadow-parchment'
                  }`}
                onClick={() => handleFeatureToggle(feature.id)}
              >
                <h3 className="font-title text-2xl font-semibold text-brown-accent mb-2">
                  {feature.name}
                </h3>
                <p className="font-body text-brown-text">{feature.desc}</p>
              </div>
            );
          }

          // Attribute Increase dropdown
          if (feature.id === 'attributeIncrease') {
            return (
              <div key={feature.id} className="bg-parchment-default rounded-lg border-2 border-brown-medium p-6">
                <h3 className="font-title text-2xl font-semibold text-brown-accent mb-2">
                  {feature.name}
                </h3>
                <p className="font-body text-brown-text mb-4">{feature.desc}</p>
                <select
                  value={attributeIncreaseChoice}
                  onChange={(e) => handleAttributeIncrease(e.target.value)}
                  className="w-full px-4 py-2 bg-parchment-light border-2 border-brown-medium rounded-lg
                             font-body text-brown-text
                             focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select attribute...</option>
                  {getAvailableAttributes().map(attr => (
                    <option key={attr} value={attr}>
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </option>
                  ))}
                  {/* Show disabled options for attributes at max */}
                  {Object.keys(character.attributes)
                    .filter(attr => character.attributes[attr as keyof Attributes] >= 3)
                    .map(attr => (
                      <option key={attr} value={attr} disabled>
                        {attr.charAt(0).toUpperCase() + attr.slice(1)} [AT MAXIMUM]
                      </option>
                    ))
                  }
                </select>
              </div>
            );
          }

          // Skill Expertise dropdown
          if (feature.id === 'skillExpertise') {
            return (
              <div key={feature.id} className="bg-parchment-default rounded-lg border-2 border-brown-medium p-6">
                <h3 className="font-title text-2xl font-semibold text-brown-accent mb-2">
                  {feature.name}
                </h3>
                <p className="font-body text-brown-text mb-4">{feature.desc}</p>
                <select
                  value={skillExpertiseChoice}
                  onChange={(e) => handleSkillExpertise(e.target.value)}
                  className="w-full px-4 py-2 bg-parchment-light border-2 border-brown-medium rounded-lg
                             font-body text-brown-text
                             focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select skill...</option>
                  {otherData.skills.map(skill => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleSubmit}
          disabled={!allFeaturesSelected()}
          className="px-8 py-3 bg-brown-accent text-parchment-light font-title text-xl rounded-lg
                     border-2 border-brown-medium shadow-parchment
                     hover:bg-brown-medium hover:shadow-elevated
                     active:shadow-inset-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Complete Character
        </button>
      </div>
    </div>
  );
}

export default Level0AncestryPage;
