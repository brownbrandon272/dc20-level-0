import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Character,
  CharacterStore,
  CreationMode,
  CharacterLevel,
  Weapon,
  Attributes,
  Skills,
  Languages,
  ClassType,
  Armor,
  Shield,
  CalculatedStats
} from '../types';

const initialCharacterState: Character = {
  name: '',
  creationMode: null,
  level: 'Novice',
  lastStep: '/',

  ancestry: {
    id: null,
    level0Choices: [],
    level0ChoiceDetails: {}
  },

  attributes: {
    might: 0,
    agility: 0,
    charisma: 0,
    intelligence: 0
  },

  skills: {},

  languages: {},

  inventory: {
    weapon: null,
    armor: null,
    shield: null,
    additionalWeapon: null
  },

  classType: null,
  chosenManeuvers: [],
  chosenSpellList: null,
  chosenArchetype: null,
  chosenMartialPath: null,

  calculatedStats: {
    hp: 6,
    hpMax: 6,
    pd: 8,
    ad: 8,
    attackCheck: 0,
    saveDC: 10,
    martialCheck: 0,
    spellCheck: 0,
    speed: 5,
    stamina: 2,
    mana: 2,
    actionPoints: 4,
    gritPoints: 0
  }
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: initialCharacterState,

      // Set character name
      setName: (name: string) => set((state) => ({
        character: { ...state.character, name }
      })),

      // Set creation mode
      setCreationMode: (mode: CreationMode) => set((state) => ({
        character: { ...state.character, creationMode: mode }
      })),

      // Set last step for navigation
      setLastStep: (step: string) => set((state) => ({
        character: { ...state.character, lastStep: step }
      })),

      // Set ancestry
      setAncestry: (ancestryId: string) => set((state) => ({
        character: {
          ...state.character,
          ancestry: { ...state.character.ancestry, id: ancestryId }
        }
      })),

      // Add level 0 ancestry choice
      addAncestryLevel0Choice: (choiceId: string) => set((state) => ({
        character: {
          ...state.character,
          ancestry: {
            ...state.character.ancestry,
            level0Choices: [...state.character.ancestry.level0Choices, choiceId]
          }
        }
      })),

      // Set (replace) level 0 ancestry choices
      setAncestryLevel0Choices: (choices: string[]) => set((state) => ({
        character: {
          ...state.character,
          ancestry: {
            ...state.character.ancestry,
            level0Choices: choices
          }
        }
      })),

      // Set ancestry feature choice (for dropdown selections)
      setAncestryFeatureChoice: (featureId: string, selectedOption: string) => set((state) => ({
        character: {
          ...state.character,
          ancestry: {
            ...state.character.ancestry,
            level0ChoiceDetails: {
              ...state.character.ancestry.level0ChoiceDetails,
              [featureId]: selectedOption
            }
          }
        }
      })),

      // Set weapon
      setWeapon: (weapon: Weapon) => set((state) => ({
        character: {
          ...state.character,
          inventory: { ...state.character.inventory, weapon }
        }
      })),

      // Set level
      setLevel: (level: CharacterLevel) => set((state) => ({
        character: { ...state.character, level }
      })),

      // Set attributes
      setAttributes: (attributes: Attributes) => set((state) => ({
        character: { ...state.character, attributes }
      })),

      // Set archetype (streamlined mode)
      setArchetype: (archetype: string) => set((state) => ({
        character: { ...state.character, chosenArchetype: archetype }
      })),

      // Set skills
      setSkills: (skills: Skills) => set((state) => ({
        character: { ...state.character, skills }
      })),

      // Set languages
      setLanguages: (languages: Languages) => set((state) => ({
        character: { ...state.character, languages }
      })),

      // Set class type
      setClassType: (classType: ClassType) => set((state) => ({
        character: { ...state.character, classType }
      })),

      // Set maneuvers
      setManeuvers: (maneuvers: string[]) => set((state) => ({
        character: { ...state.character, chosenManeuvers: maneuvers }
      })),

      // Set spell list
      setSpellList: (spellListId: string) => set((state) => ({
        character: { ...state.character, chosenSpellList: spellListId }
      })),

      // Set martial path
      setMartialPath: (pathId: string) => set((state) => ({
        character: { ...state.character, chosenMartialPath: pathId }
      })),

      // Set armor
      setArmor: (armor: Armor) => set((state) => ({
        character: {
          ...state.character,
          inventory: { ...state.character.inventory, armor }
        }
      })),

      // Set shield
      setShield: (shield: Shield) => set((state) => ({
        character: {
          ...state.character,
          inventory: { ...state.character.inventory, shield }
        }
      })),

      // Set additional weapon
      setAdditionalWeapon: (weapon: Weapon) => set((state) => ({
        character: {
          ...state.character,
          inventory: { ...state.character.inventory, additionalWeapon: weapon }
        }
      })),

      // Update calculated stats
      updateCalculatedStats: (stats: Partial<CalculatedStats>) => set((state) => ({
        character: {
          ...state.character,
          calculatedStats: { ...state.character.calculatedStats, ...stats }
        }
      })),

      // Reset character (start new)
      resetCharacter: () => set({ character: initialCharacterState }),

      // Check if character exists
      hasExistingCharacter: () => {
        const { character } = get();
        return character.name !== '' && character.ancestry.id !== null;
      },

      // Get character data
      getCharacter: () => get().character
    }),
    {
      name: 'dc20-character-storage',
      version: 1
    }
  )
);
