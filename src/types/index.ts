// Character Types
export type CreationMode = 'streamlined' | 'customizable';
export type CharacterLevel = 'Novice' | 'PreAdventurer' | 'Level0';
export type ClassType = 'Martial' | 'Caster' | null;

export interface Attributes {
  might: number;
  agility: number;
  charisma: number;
  intelligence: number;
}

export interface Skills {
  [skillName: string]: number;
}

export interface Languages {
  [language: string]: number; // 0 = None, 1 = Limited, 2 = Fluent
}

export interface Weapon {
  id: string;
  name: string;
  category: string;
  style: string;
  hands: string;
  damage: string;
  properties: string[];
  streamlined: boolean;
}

export interface Armor {
  name: string;
  pdBonus: number;
}

export interface Shield {
  name: string;
  pdBonus: number;
}

export interface Inventory {
  weapon: Weapon | null;
  armor: Armor | null;
  shield: Shield | null;
  additionalWeapon: Weapon | null;
}

export interface Ancestry {
  id: string | null;
  level0Choices: string[];
}

export interface CalculatedStats {
  hp: number;
  hpMax: number;
  pd: number;
  ad: number;
  attackCheck: number;
  saveDC: number;
  martialCheck: number;
  spellCheck: number;
  speed: number;
  stamina: number;
  mana: number;
  actionPoints: number;
}

export interface Character {
  name: string;
  creationMode: CreationMode | null;
  level: CharacterLevel;
  lastStep: string;
  ancestry: Ancestry;
  attributes: Attributes;
  skills: Skills;
  languages: Languages;
  inventory: Inventory;
  classType: ClassType;
  chosenManeuvers: string[];
  chosenSpellList: string | null;
  chosenArchetype: string | null;
  calculatedStats: CalculatedStats;
}

// Data Types
export interface AncestryFeature {
  id: string;
  type: 'choice' | 'passive';
  name: string;
  desc: string;
}

export interface AncestryData {
  id: string;
  name: string;
  noviceFeature: {
    name: string;
    desc: string;
  };
  level0Features: AncestryFeature[];
}

export interface AncestryMap {
  [key: string]: AncestryData;
}

export interface Maneuver {
  id: string;
  name: string;
  type: 'action' | 'reaction';
  category: 'basic' | 'maneuver';
  cost: string;
  desc: string;
  autoSelected: boolean;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  cost: string;
  desc: string;
}

export interface SpellList {
  id: string;
  name: string;
  desc: string;
  spells: Spell[];
}

export interface SpellListMap {
  [key: string]: SpellList;
}

export interface Action {
  id: string;
  name: string;
  cost: string;
  desc: string;
}

export interface Archetype {
  id: string;
  name: string;
  desc: string;
  attributes: Attributes;
  suggestedSkills: string[];
  suggestedLanguages: string[];
}

export interface ArchetypeMap {
  [key: string]: Archetype;
}

export interface OtherData {
  skills: string[];
  languages: string[];
  archetypes: ArchetypeMap;
  baseActions: Action[];
  baseReactions: Action[];
}

// Store Types
export interface CharacterStore {
  character: Character;
  setName: (name: string) => void;
  setCreationMode: (mode: CreationMode) => void;
  setLastStep: (step: string) => void;
  setAncestry: (ancestryId: string) => void;
  addAncestryLevel0Choice: (choiceId: string) => void;
  setWeapon: (weapon: Weapon) => void;
  setLevel: (level: CharacterLevel) => void;
  setAttributes: (attributes: Attributes) => void;
  setArchetype: (archetype: string) => void;
  setSkills: (skills: Skills) => void;
  setLanguages: (languages: Languages) => void;
  setClassType: (classType: ClassType) => void;
  setManeuvers: (maneuvers: string[]) => void;
  setSpellList: (spellListId: string) => void;
  setArmor: (armor: Armor) => void;
  setShield: (shield: Shield) => void;
  setAdditionalWeapon: (weapon: Weapon) => void;
  updateCalculatedStats: (stats: Partial<CalculatedStats>) => void;
  resetCharacter: () => void;
  hasExistingCharacter: () => boolean;
  getCharacter: () => Character;
}
