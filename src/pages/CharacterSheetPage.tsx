import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import CharacterHeader from '../components/CharacterHeader';
import FramedStat from '../components/FramedStat';
import AttributeBlock from '../components/AttributeBlock';
import ancestriesData from '../data/ancestries.json';
import maneuversData from '../data/maneuvers.json';
import spellsData from '../data/spells.json';
import otherData from '../data/other.json';

function CharacterSheetPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sheet');
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);
  const [expandedManeuverId, setExpandedManeuverId] = useState<string | null>(null);
  const character = useCharacterStore((state) => state.character);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const ancestry = ancestriesData[character.ancestry.id];
  const stats = character.calculatedStats;

  // Combat Mastery = Character Modifier (CM)
  const combatMastery = character.level === 'Novice' ? 0 : 1;

  const handleLevelUp = () => {
    if (character.level === 'Novice') {
      setLastStep('/character/sheet');
      navigate('/create/pre-adventurer');
    } else if (character.level === 'PreAdventurer') {
      setLastStep('/character/sheet');
      navigate('/create/level0');
    }
  };

  const showLevelUpButton = character.level !== 'Level0';

  // Helper to get Prime attribute (highest attribute)
  const getPrimeAttribute = () => {
    const attrs = character.attributes;
    const attrEntries = Object.entries(attrs);
    const highest = attrEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
    return highest[0];
  };

  const primeAttribute = character.level !== 'Novice' ? getPrimeAttribute() : null;

  // Skill mappings based on DC20 system (from official character sheet)
  const skillsByAttribute = {
    prime: ['Awareness'],
    might: ['Athletics', 'Intimidation'],
    agility: ['Acrobatics', 'Trickery', 'Stealth'],
    charisma: ['Animal Handling', 'Influence', 'Insight'],
    intelligence: ['Investigation', 'Medicine', 'Survival']
  };

  // Get skill proficiency from character.skills
  // Pre-Adventurer skills are stored as 2 when learned, but should display as proficiency 1
  // Level 0 can have proficiency 2 (expert) only if skill value > 2
  const getSkillProficiency = (skillName: string): 0 | 1 | 2 => {
    const prof = character.skills[skillName] || 0;

    // At Pre-Adventurer level, all learned skills are proficiency 1 (trained)
    if (character.level === 'PreAdventurer') {
      return (prof > 0 ? 1 : 0) as 0 | 1 | 2;
    }

    // At Level 0:
    // - Skills with value 2 (learned at Pre-Adventurer) display as proficiency 1 (trained)
    // - Skills with value > 2 (upgraded by ancestry features) display as proficiency 2 (expert)
    // - Skills with value 1 display as proficiency 1
    if (character.level === 'Level0') {
      return (prof > 2 ? 2 : prof >= 1 ? 1 : 0) as 0 | 1 | 2;
    }

    // Fallback for any other level
    return (prof > 2 ? 2 : prof >= 1 ? 1 : 0) as 0 | 1 | 2;
  };

  // Get available actions based on level (base actions only - no spells/maneuvers)
  const getAvailableActions = () => {
    return [...otherData.baseActions];
  };

  // Get available reactions (base reactions only - no maneuvers)
  const getAvailableReactions = () => {
    return [...otherData.baseReactions];
  };

  // Get character's selected maneuvers
  const getSelectedManeuvers = () => {
    if (character.level !== 'Level0' || character.classType !== 'Martial') {
      return [];
    }
    return maneuversData.filter(m =>
      m.autoSelected || character.chosenManeuvers.includes(m.id)
    );
  };

  // Get character's selected spells
  const getSelectedSpells = () => {
    if (character.level !== 'Level0' || character.classType !== 'Caster' || !character.chosenSpellList) {
      return [];
    }
    const spellList = spellsData[character.chosenSpellList];
    return spellList ? spellList.spells : [];
  };

  return (
    <div className="min-h-screen bg-parchment-light py-8">
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        {/* Character Header */}
        <CharacterHeader
          characterName={character.name}
          ancestry={ancestry?.name || 'Unknown'}
          level={character.level}
          combatMastery={combatMastery}
          classType={character.classType || undefined}
        />

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            className={`font-title text-lg rounded-lg transition-all ${
              activeTab === 'sheet'
                ? 'bg-brown-accent text-parchment-light border-brown-accent shadow-parchment-lg'
                : 'bg-parchment border-brown-medium text-brown-text hover:border-brown-accent'
            }`}
            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', paddingTop: '1.25rem', paddingBottom: '1.25rem', borderWidth: '3px', borderStyle: 'solid' }}
            onClick={() => setActiveTab('sheet')}
          >
            Character Sheet
          </button>
          <button
            className={`font-title text-lg rounded-lg transition-all ${
              activeTab === 'actions'
                ? 'bg-brown-accent text-parchment-light border-brown-accent shadow-parchment-lg'
                : 'bg-parchment border-brown-medium text-brown-text hover:border-brown-accent'
            }`}
            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', paddingTop: '1.25rem', paddingBottom: '1.25rem', borderWidth: '3px', borderStyle: 'solid' }}
            onClick={() => setActiveTab('actions')}
          >
            Actions & Reactions
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'sheet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Attributes (Only shown for Pre-Adventurer and Level 0) */}
            {character.level !== 'Novice' && (
              <div className="lg:col-span-4 space-y-4">
                <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                  Attributes
                </h2>

                {primeAttribute && (
                  <AttributeBlock
                    name="Prime"
                    abbreviation="PRM"
                    value={character.attributes[primeAttribute as keyof typeof character.attributes]}
                    skills={skillsByAttribute.prime.map(skill => ({
                      name: skill,
                      proficiency: getSkillProficiency(skill)
                    }))}
                    isPrime={true}
                  />
                )}

                <AttributeBlock
                  name="Might"
                  abbreviation="MIG"
                  value={character.attributes.might}
                  save={character.attributes.might + combatMastery}
                  skills={skillsByAttribute.might.map(skill => ({
                    name: skill,
                    proficiency: getSkillProficiency(skill)
                  }))}
                />

                <AttributeBlock
                  name="Agility"
                  abbreviation="AGI"
                  value={character.attributes.agility}
                  save={character.attributes.agility + combatMastery}
                  skills={skillsByAttribute.agility.map(skill => ({
                    name: skill,
                    proficiency: getSkillProficiency(skill)
                  }))}
                />

                <AttributeBlock
                  name="Charisma"
                  abbreviation="CHA"
                  value={character.attributes.charisma}
                  save={character.attributes.charisma + combatMastery}
                  skills={skillsByAttribute.charisma.map(skill => ({
                    name: skill,
                    proficiency: getSkillProficiency(skill)
                  }))}
                />

                <AttributeBlock
                  name="Intelligence"
                  abbreviation="INT"
                  value={character.attributes.intelligence}
                  save={character.attributes.intelligence + combatMastery}
                  skills={skillsByAttribute.intelligence.map(skill => ({
                    name: skill,
                    proficiency: getSkillProficiency(skill)
                  }))}
                />
              </div>
            )}

            {/* Center/Right Column: Stats, Combat, Equipment, Resources */}
            <div className={character.level !== 'Novice' ? 'lg:col-span-8' : 'lg:col-span-12'}>
              {/* Health & Defense Stats */}
              <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                <div className="px-2">
                  <h2 className="font-title text-2xl text-brown-text mb-6 border-b-2 border-brown-accent pb-3">
                    Health & Defense
                  </h2>
                </div>

                <div className="flex flex-wrap gap-8 justify-center items-start py-4">
                  {/* Health Points */}
                  <div className="flex flex-col items-center gap-2 px-4">
                    <div className="text-xs font-sans uppercase tracking-wide text-brown-text font-semibold mb-1">
                      Health Points
                    </div>
                    <FramedStat
                      label=""
                      value={`${stats.hp}/${stats.hpMax}`}
                      frameType="silver-circle"
                      size="large"
                      tooltip="Hit Points: Your health"
                    />
                  </div>

                  {/* Precision Defense */}
                  <div className="flex flex-col items-center gap-2 px-4">
                    <div className="text-xs font-sans uppercase tracking-wide text-brown-text font-semibold mb-1">
                      Precision Defense
                    </div>
                    <FramedStat
                      label=""
                      value={stats.pd}
                      frameType="silver-square"
                      size="large"
                      tooltip="Precision Defense: Defense against targeted attacks"
                    />
                    {/* Heavy and Brutal limits for PD */}
                    <div className="mt-1 bg-parchment-light border border-brown-medium rounded px-4 py-2 text-center">
                      <span className="text-xs font-sans text-brown-text">
                        <span className="font-semibold">{stats.pd + 5}</span> Heavy{' '}
                        <span className="font-semibold">{stats.pd + 10}</span> Brutal
                      </span>
                    </div>
                  </div>

                  {/* Area Defense */}
                  <div className="flex flex-col items-center gap-2 px-4">
                    <div className="text-xs font-sans uppercase tracking-wide text-brown-text font-semibold mb-1">
                      Area Defense
                    </div>
                    <FramedStat
                      label=""
                      value={stats.ad}
                      frameType="silver-square"
                      size="large"
                      tooltip="Area Defense: Defense against area effects"
                    />
                    {/* Heavy and Brutal limits for AD */}
                    <div className="mt-1 bg-parchment-light border border-brown-medium rounded px-4 py-2 text-center">
                      <span className="text-xs font-sans text-brown-text">
                        <span className="font-semibold">{stats.ad + 5}</span> Heavy{' '}
                        <span className="font-semibold">{stats.ad + 10}</span> Brutal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Combat Stats */}
              <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                  Combat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-parchment-light border border-brown-medium rounded-lg p-4 text-center">
                    <div className="text-sm font-sans uppercase tracking-wide text-brown-medium mb-2">
                      Attack Check
                    </div>
                    <div className="font-title text-3xl font-bold text-brown-text">
                      +{stats.attackCheck}
                    </div>
                    <div className="text-xs text-brown-medium mt-1">
                      CM + Prime
                    </div>
                  </div>
                  {character.level === 'Level0' && (
                    <div className="bg-parchment-light border border-brown-medium rounded-lg p-4 text-center">
                      <div className="text-sm font-sans uppercase tracking-wide text-brown-medium mb-2">
                        Save DC
                      </div>
                      <div className="font-title text-3xl font-bold text-brown-text">
                        {stats.saveDC}
                      </div>
                      <div className="text-xs text-brown-medium mt-1">
                        10 + CM + Prime
                      </div>
                    </div>
                  )}
                  <div className="bg-parchment-light border border-brown-medium rounded-lg p-4 text-center">
                    <div className="text-sm font-sans uppercase tracking-wide text-brown-medium mb-2">
                      Initiative
                    </div>
                    <div className="font-title text-3xl font-bold text-brown-text">
                      +{combatMastery + character.attributes.agility}
                    </div>
                    <div className="text-xs text-brown-medium mt-1">
                      CM + AGI
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Stats */}
              <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                  Physical
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-parchment-light border border-brown-medium rounded-lg p-4 text-center">
                    <div className="text-sm font-sans uppercase tracking-wide text-brown-medium mb-2">
                      Move Speed
                    </div>
                    <div className="font-title text-3xl font-bold text-brown-text">
                      {stats.speed}
                    </div>
                  </div>
                  <div className="bg-parchment-light border border-brown-medium rounded-lg p-4 text-center">
                    <div className="text-sm font-sans uppercase tracking-wide text-brown-medium mb-2">
                      Hold Breath
                    </div>
                    <div className="font-title text-3xl font-bold text-brown-text">
                      {character.attributes.might + combatMastery} min
                    </div>
                  </div>
                  <div className="bg-parchment-light border border-brown-medium rounded-lg p-4 text-center">
                    <div className="text-sm font-sans uppercase tracking-wide text-brown-medium mb-2">
                      Jump Distance
                    </div>
                    <div className="font-title text-3xl font-bold text-brown-text">
                      {stats.speed / 2}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attacks & Equipment */}
              <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                  Attacks & Equipment
                </h2>
                {character.inventory.weapon || character.inventory.additionalWeapon ? (
                  <div className="bg-parchment-light border border-brown-medium rounded-lg p-4">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-2 mb-3 pb-2 border-b border-brown-medium">
                      <div className="col-span-6 text-xs font-sans uppercase tracking-wide text-brown-medium font-semibold">
                        Name
                      </div>
                      <div className="col-span-3 text-xs font-sans uppercase tracking-wide text-brown-medium font-semibold text-center">
                        Bonus
                      </div>
                      <div className="col-span-3 text-xs font-sans uppercase tracking-wide text-brown-medium font-semibold text-center">
                        Damage
                      </div>
                    </div>

                    {/* Main weapon row */}
                    {character.inventory.weapon && (
                      <div className="grid grid-cols-12 gap-2 items-center mb-3">
                        <div className="col-span-6 flex items-center gap-2">
                          <img
                            src={`/weapon/weapon-${character.inventory.weapon.id}.png`}
                            alt={character.inventory.weapon.name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div>
                            <div className="font-title text-base font-semibold text-brown-text">
                              {character.inventory.weapon.name}
                            </div>
                            <div className="text-xs text-brown-medium">
                              {character.inventory.weapon.hands}
                              {character.inventory.weapon.properties.length > 0 &&
                                ` • ${character.inventory.weapon.properties.join(', ')}`
                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3 text-center">
                          <div className="font-title text-xl font-bold text-brown-text">
                            +{stats.attackCheck}
                          </div>
                        </div>
                        <div className="col-span-3 text-center">
                          <div className="font-title text-xl font-bold text-brown-text">
                            {character.inventory.weapon.damage}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional weapon row */}
                    {character.inventory.additionalWeapon && (
                      <div className="grid grid-cols-12 gap-2 items-center mb-3">
                        <div className="col-span-6 flex items-center gap-2">
                          <img
                            src={`/weapon/weapon-${character.inventory.additionalWeapon.id}.png`}
                            alt={character.inventory.additionalWeapon.name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div>
                            <div className="font-title text-base font-semibold text-brown-text">
                              {character.inventory.additionalWeapon.name}
                            </div>
                            <div className="text-xs text-brown-medium">
                              {character.inventory.additionalWeapon.hands}
                              {character.inventory.additionalWeapon.properties.length > 0 &&
                                ` • ${character.inventory.additionalWeapon.properties.join(', ')}`
                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3 text-center">
                          <div className="font-title text-xl font-bold text-brown-text">
                            +{stats.attackCheck}
                          </div>
                        </div>
                        <div className="col-span-3 text-center">
                          <div className="font-title text-xl font-bold text-brown-text">
                            {character.inventory.additionalWeapon.damage}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shield row */}
                    {character.inventory.shield && (
                      <div className="grid grid-cols-12 gap-2 items-center border-t border-brown-medium pt-3">
                        <div className="col-span-6 flex items-center gap-2">
                          <div className="w-10 h-10 flex items-center justify-center text-2xl">
                            🛡️
                          </div>
                          <div>
                            <div className="font-title text-base font-semibold text-brown-text">
                              {character.inventory.shield.name}
                            </div>
                            <div className="text-xs text-brown-medium">
                              +{character.inventory.shield.pdBonus} PD
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 text-sm text-brown-medium italic">
                          Defensive equipment
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-brown-medium py-4 bg-parchment-light border border-brown-medium rounded-lg">
                    No weapons equipped
                  </div>
                )}
              </div>

              {/* Languages (Pre-Adventurer and Level 0 only) */}
              {character.level !== 'Novice' && (
                <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                  <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                    Languages
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(character.languages).map(([lang, fluency]) => {
                      if (fluency === 0) return null;
                      return (
                        <div key={lang} className="flex items-center gap-3 bg-parchment-light border border-brown-medium rounded-lg p-3">
                          <div className="flex gap-1">
                            {/* Fluency circles */}
                            <div className={`w-4 h-4 rounded-full border-2 ${fluency >= 1 ? 'bg-brown-accent border-brown-accent' : 'bg-transparent border-brown-medium'}`}></div>
                            <div className={`w-4 h-4 rounded-full border-2 ${fluency >= 2 ? 'bg-brown-accent border-brown-accent' : 'bg-transparent border-brown-medium'}`}></div>
                          </div>
                          <div className="flex-1 font-body text-brown-text">
                            {lang}
                          </div>
                          <div className="text-xs font-sans uppercase tracking-wide text-brown-medium">
                            {fluency === 1 ? 'Limited' : fluency === 2 ? 'Fluent' : ''}
                          </div>
                        </div>
                      );
                    })}
                    {Object.values(character.languages).every(f => f === 0) && (
                      <div className="text-center text-brown-medium py-4">
                        No languages learned yet
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resources (Level 0 only) */}
              {character.level === 'Level0' && (
                <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                  <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                    Resources
                  </h2>
                  <div className="flex flex-wrap gap-6 justify-center">
                    {character.classType === 'Martial' && (
                      <FramedStat
                        label="Stamina"
                        value={stats.stamina}
                        frameType="silver-circle"
                        size="medium"
                        tooltip="Stamina Points: Used for martial maneuvers"
                      />
                    )}
                    {character.classType === 'Caster' && (
                      <FramedStat
                        label="Mana"
                        value={stats.mana}
                        frameType="gold-circle"
                        size="medium"
                        tooltip="Mana Points: Used for casting spells"
                      />
                    )}
                    <FramedStat
                      label="Grit"
                      value={character.attributes.charisma + 2}
                      frameType="silver-square"
                      size="medium"
                      tooltip="Grit Points: CHA + 2"
                    />
                    <FramedStat
                      label="Rest"
                      value={stats.hpMax}
                      frameType="gold-square"
                      size="medium"
                      tooltip="Rest Points: Max HP"
                    />
                  </div>
                </div>
              )}

              {/* Maneuvers (Level 0 Martial only) */}
              {character.level === 'Level0' && character.classType === 'Martial' && getSelectedManeuvers().length > 0 && (
                <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                  <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                    Maneuvers
                  </h2>
                  <div className="space-y-3">
                    {getSelectedManeuvers().map((maneuver) => {
                      const isAction = (maneuver as any).type === 'action';

                      return (
                        <div
                          key={maneuver.id}
                          className="bg-parchment-light border border-brown-medium rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            {/* Maneuver Image */}
                            {maneuver.image && (
                              <img
                                src={maneuver.image}
                                alt={maneuver.name}
                                className="w-16 h-16 object-contain flex-shrink-0"
                              />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-title text-lg font-semibold text-brown-text">
                                  {maneuver.name}
                                </h3>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-semibold ${
                                    isAction
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-purple-600 text-white'
                                  }`}>
                                    {isAction ? 'Action' : 'Reaction'}
                                  </span>
                                  <span className="bg-brown-accent text-parchment-light px-3 py-1 rounded-full text-sm font-sans font-semibold whitespace-nowrap">
                                    {maneuver.cost}
                                  </span>
                                </div>
                              </div>

                              {/* Always show full description for maneuvers */}
                              <p className="font-body text-sm text-brown-text whitespace-pre-wrap">
                                {maneuver.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spells (Level 0 Caster only) */}
              {character.level === 'Level0' && character.classType === 'Caster' && getSelectedSpells().length > 0 && (
                <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 mb-6 shadow-parchment-lg">
                  <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                    Spells
                  </h2>
                  <div className="space-y-3">
                    {getSelectedSpells().map((spell) => {
                      const isExpanded = expandedSpellId === spell.id;

                      return (
                        <div
                          key={spell.id}
                          className="bg-parchment-light border border-brown-medium rounded-lg p-4 cursor-pointer hover:border-brown-accent transition-all"
                          onClick={() => setExpandedSpellId(isExpanded ? null : spell.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-title text-lg font-semibold text-brown-text">
                              {spell.name}
                            </h3>
                            <div className="flex items-center gap-2 ml-2">
                              <span className="px-2 py-0.5 rounded-full text-xs font-sans font-semibold bg-blue-600 text-white">
                                Action
                              </span>
                              <span className="bg-gold text-parchment-light px-3 py-1 rounded-full text-sm font-sans font-semibold whitespace-nowrap">
                                {spell.cost}
                              </span>
                            </div>
                          </div>

                          {!isExpanded ? (
                            <p className="font-body text-sm text-brown-medium italic">
                              {spell.descSummary}
                            </p>
                          ) : (
                            <div className="font-body text-sm text-brown-text">
                              {spell.desc.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-2 last:mb-0 whitespace-pre-wrap">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          )}

                          <div className="text-xs text-brown-medium mt-2 text-right">
                            {isExpanded ? 'Click to collapse' : 'Click to expand'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features */}
              {ancestry && (
                <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 shadow-parchment-lg">
                  <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                    Features
                  </h2>
                  <div className="space-y-4">
                    {/* Novice Feature */}
                    {ancestry.noviceFeature && (
                      <div className="bg-parchment-light border border-brown-medium rounded-lg p-4">
                        <h3 className="font-title text-lg font-semibold text-brown-text mb-2">
                          {ancestry.noviceFeature.name}
                        </h3>
                        <p className="font-body text-brown-text">
                          {ancestry.noviceFeature.desc}
                        </p>
                      </div>
                    )}

                    {/* Level 0 Features */}
                    {character.level === 'Level0' && character.ancestry.level0Choices.length > 0 && (
                      <>
                        {character.ancestry.level0Choices.map((choiceId) => {
                          const feature = ancestry.level0Features?.find(f => f.id === choiceId);
                          if (!feature) return null;

                          return (
                            <div key={choiceId} className="bg-parchment-light border border-brown-medium rounded-lg p-4">
                              <h3 className="font-title text-lg font-semibold text-brown-text mb-2">
                                {feature.name}
                              </h3>
                              <p className="font-body text-brown-text">
                                {feature.desc}
                              </p>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actions Section */}
            <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 shadow-parchment-lg">
              <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                Actions
              </h2>
              <div className="space-y-3">
                {getAvailableActions().map((action, index) => (
                  <div key={action.id || index} className="bg-parchment-light border border-brown-medium rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-title text-lg font-semibold text-brown-text">
                        {action.name}
                      </h3>
                      <span className="bg-brown-accent text-parchment-light px-3 py-1 rounded-full text-sm font-sans font-semibold">
                        {action.cost}
                      </span>
                    </div>
                    <p className="font-body text-sm text-brown-text">
                      {action.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reactions Section */}
            <div className="bg-parchment rounded-lg border-2 border-brown-accent p-6 shadow-parchment-lg">
              <h2 className="font-title text-2xl text-brown-text mb-4 border-b-2 border-brown-accent pb-3 px-2">
                Reactions
              </h2>
              <div className="space-y-3">
                {getAvailableReactions().map((reaction, index) => (
                  <div key={reaction.id || index} className="bg-parchment-light border border-gold-dark rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-title text-lg font-semibold text-brown-text">
                        {reaction.name}
                      </h3>
                      <span className="bg-gold text-parchment-light px-3 py-1 rounded-full text-sm font-sans font-semibold">
                        {reaction.cost}
                      </span>
                    </div>
                    <p className="font-body text-sm text-brown-text">
                      {reaction.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Level Up Button */}
        {showLevelUpButton && (
          <div className="mt-8 text-center">
            <button
              className="px-10 py-5 bg-gradient-to-br from-gold-light to-gold-dark text-brown-text font-title text-xl font-bold rounded-lg border-2 border-gold shadow-gold hover:shadow-parchment-lg hover:-translate-y-1 transition-all duration-200"
              onClick={handleLevelUp}
            >
              Level Up to {character.level === 'Novice' ? 'Pre-Adventurer (Level -1)' : 'Level 0'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterSheetPage;
