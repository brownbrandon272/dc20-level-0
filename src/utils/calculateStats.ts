import type { Character, CalculatedStats, OtherData, Maneuver, SpellListMap, Attributes } from '../types';

/**
 * Calculate stats for a Novice character (Level -1)
 * At this stage, character has basic stats
 */
export function calculateNoviceStats(_character: Character): CalculatedStats {
  return {
    hp: 6,
    hpMax: 6,
    pd: 8,
    md: 8,
    ad: 8,
    attackCheck: 0,
    saveDC: 10,
    martialCheck: 0,
    spellCheck: 0,
    speed: 6,
    stamina: 2,
    mana: 2,
    actionPoints: 3
  };
}

/**
 * Calculate complete stats based on character data
 * This is called after Pre-Adventurer or Level 0 choices
 */
export function recalculateStats(character: Character): CalculatedStats {
  const { attributes, inventory, level, ancestry } = character;
  const { might, agility, charisma, intelligence } = attributes;

  // Base stats
  const stats: CalculatedStats = {
    speed: 6,
    actionPoints: 3,
    stamina: 2,
    mana: 2,
    hp: 0,
    hpMax: 0,
    pd: 0,
    md: 0,
    ad: 0,
    attackCheck: 0,
    saveDC: 0,
    martialCheck: 0,
    spellCheck: 0
  };

  // Calculate HP
  // HP = 6 + Might
  stats.hp = 6 + might;
  stats.hpMax = 6 + might;

  // Calculate Checks
  // Character Modifier (CM) = 0 for Novice, 1 for Pre-Adventurer and Level 0
  const cm = level === 'Novice' ? 0 : 1;

  // Attack Check = CM + highest physical attribute (Might or Agility)
  stats.attackCheck = cm + Math.max(might, agility);

  // Save DC = 10 + CM + highest mental attribute (Charisma or Intelligence)
  stats.saveDC = 10 + cm + Math.max(charisma, intelligence);

  // Martial Check = CM + highest of Athletics or Acrobatics skill
  // For simplicity, we'll use the higher physical attribute as proxy
  stats.martialCheck = cm + Math.max(might, agility);

  // Spell Check = CM + highest mental attribute
  stats.spellCheck = cm + Math.max(charisma, intelligence);

  // Calculate Defenses
  if (level === 'Novice') {
    // Novice has flat defenses
    stats.pd = 8;
    stats.md = 8;
    stats.ad = 8;
  } else {
    // Pre-Adventurer and Level 0 calculations
    // PD = 8 + CM + Agility + Armor Bonus
    let armorBonus = 0;
    if (inventory.armor) {
      armorBonus = inventory.armor.pdBonus || 0;
    }
    let shieldBonus = 0;
    if (inventory.shield) {
      shieldBonus = inventory.shield.pdBonus || 0;
    }
    stats.pd = 8 + cm + agility + armorBonus + shieldBonus;

    // MD = 8 + CM + Charisma + Intelligence
    stats.md = 8 + cm + charisma + intelligence;

    // AD = 8 + CM + Agility + Might
    stats.ad = 8 + cm + agility + might;
  }

  // Apply ancestry bonuses
  if (ancestry.id && ancestry.level0Choices.length > 0) {
    ancestry.level0Choices.forEach(choice => {
      if (choice === 'resilience') {
        // Human Resilience: +2 HP
        stats.hp += 2;
        stats.hpMax += 2;
      } else if (choice === 'fleetOfFoot') {
        // Elf Fleet of Foot: +1 Speed
        stats.speed += 1;
      }
      // Other ancestry features don't affect calculated stats directly
    });
  }

  return stats;
}

/**
 * Apply archetype bonuses (streamlined mode only)
 * This sets attributes based on the chosen archetype
 */
export function applyArchetype(
  archetypeId: string,
  otherData: OtherData
): { attributes: Attributes; suggestedSkills: string[]; suggestedLanguages: string[] } | null {
  const archetypes = otherData.archetypes;
  const archetype = archetypes[archetypeId];

  if (!archetype) {
    return null;
  }

  return {
    attributes: archetype.attributes,
    suggestedSkills: archetype.suggestedSkills,
    suggestedLanguages: archetype.suggestedLanguages
  };
}

/**
 * Get available maneuvers based on character choices
 */
export function getAvailableManeuvers(character: Character, maneuversData: Maneuver[]): Maneuver[] {
  if (character.level !== 'Level0' || character.classType !== 'Martial') {
    return [];
  }

  // Return all maneuvers
  return maneuversData;
}

/**
 * Get available spells based on character choices
 */
export function getAvailableSpells(character: Character, spellsData: SpellListMap) {
  if (character.level !== 'Level0' || character.classType !== 'Caster') {
    return [];
  }

  if (!character.chosenSpellList) {
    return [];
  }

  const spellList = spellsData[character.chosenSpellList];
  return spellList ? spellList.spells : [];
}

/**
 * Calculate skill modifier
 */
export function getSkillModifier(character: Character, skillName: string): number {
  const skillValue = character.skills[skillName] || 0;
  const cm = character.level === 'Novice' ? 0 : 1;

  // Skill check = CM + Skill Points + Attribute Modifier
  // For simplicity, we're just returning skill points here
  // In a full implementation, you'd map skills to attributes
  return cm + skillValue;
}
