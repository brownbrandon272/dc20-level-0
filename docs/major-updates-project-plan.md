# DC20 Level 0 Character Creator - Major Updates Project Plan

**Document Version:** 1.0
**Date:** 2025-11-13
**Status:** Planning Phase

---

## Executive Summary

This document outlines a comprehensive plan for major updates to the DC20 Level 0 Character Creator. Changes span all three character levels (Novice/-2, Pre-Adventurer/-1, Level 0) and introduce new systems for actions/reactions display, enhanced spell/maneuver data formats, and sophisticated ancestry feature mechanics.

**Key Changes:**
- Level -2: Streamlined weapon adjustments, 4 action points
- Level -1: +2 bonus attribute points, updated skill/language systems
- Level 0: Equipment selection, specialization paths, grit points
- Universal: Actions/reactions display with multiple description formats
- Ancestry: Dynamic feature selection with dropdowns and stat effects

---

## Table of Contents

1. [Phase 1: Data Structure & Type Updates](#phase-1-data-structure--type-updates)
2. [Phase 2: Level -2 (Novice) Changes](#phase-2-level--2-novice-changes)
3. [Phase 3: Level -1 (Pre-Adventurer) Changes](#phase-3-level--1-pre-adventurer-changes)
4. [Phase 4: Level 0 Changes](#phase-4-level-0-changes)
5. [Phase 5: Actions & Reactions Display System](#phase-5-actions--reactions-display-system)
6. [Phase 6: Ancestry Display Logic & Special Features](#phase-6-ancestry-display-logic--special-features)
7. [Phase 7: Update Character Sheet Display](#phase-7-update-character-sheet-display)
8. [Phase 8: Verification & Testing](#phase-8-verification--testing)
9. [Phase 9: Navigation & Flow Updates](#phase-9-navigation--flow-updates)
10. [Implementation Priority Order](#implementation-priority-order)
11. [Questions for User](#questions-for-user)

---

## PHASE 1: Data Structure & Type Updates

### 1.1 Update Type Definitions

**File:** `src/types/index.ts`

**Changes:**
- Add `gritPoints: number` to `CalculatedStats` interface
- Add `languageFluency` type: `0 | 1 | 2` (None, Limited, Fluent)
- Extend `Spell` and `Maneuver` interfaces:
  ```typescript
  interface Spell {
    id: string;
    name: string;
    level: number;
    cost: string;
    desc: string;
    descSummary: string;        // NEW: For customizable mode
    descExtremeSummary: string; // NEW: 3-6 words for streamlined
  }
  ```
- Add `SpecializationPath` type:
  ```typescript
  interface MartialPath {
    id: 'brawler' | 'rogue' | 'knight';
    name: string;
    desc: string;
    weapons: string[];      // Weapon IDs
    shield?: boolean;
    maneuvers: string[];    // Maneuver IDs
    conditionalLogic?: {    // For Knight's shield/weapon and Rogue's shortbow/dagger logic
      condition: string;
      ifTrue: any;
      ifFalse: any;
    };
  }
  ```
- Add ancestry feature effect types:
  ```typescript
  interface AncestryFeatureEffect {
    type: 'attributeIncrease' | 'skillExpertise' | 'statBonus' | 'displayOnly';
    target?: string;
    value?: number;
  }
  ```
- Update `actionPoints` to be level-dependent

### 1.2 Update Data Files

#### weapons.json

**Changes:**
- Set `shortsword.streamlined = false`
- Set `longsword.streamlined = true`

**Result:** 4 streamlined weapons:
- ✓ Throwing Dagger (already true)
- ✓ Longsword (change to true)
- ✓ Quarterstaff (already true)
- ✓ Shortbow (already true)

#### ancestries.json

**Changes:**
- Update Dwarf "Dwarven Resilience" description to clarify "+1 HP maximum" (currently shows but needs verification)
- Ensure all features have proper `displayOnly` flags
- Add feature metadata for UI implementations:
  ```json
  {
    "id": "attributeIncrease",
    "type": "choice",
    "displayOnly": false,
    "name": "Attribute Increase",
    "desc": "Increase one Attribute of your choice by 1 (up to maximum of +3).",
    "uiType": "dropdown",
    "options": ["might", "agility", "charisma", "intelligence"],
    "validation": { "maxValue": 3 }
  }
  ```

#### other.json

**Changes:**
- Update languages array:
  ```json
  "languages": ["Human", "Dwarven", "Elvish", "Gnomish", "Halfling", "Orcish"]
  ```
  **Note:** Common is NOT included (everyone speaks it by default)
- Update archetypes to include +2 bonus points factored in:
  ```json
  "smart": {
    "attributes": { "might": 0, "agility": 1, "charisma": -2, "intelligence": 3 }
    // Becomes: { "might": 0, "agility": 2, "charisma": -1, "intelligence": 3 }
    // or similar distribution with +2 applied
  }
  ```
  **Options for +2 distribution:**
  - Smart: +3 INT, +3 AGI, +0 MIG, -2 CHA (boost AGI twice)
  - Quick: +3 AGI, +2 CHA, +0 MIG, -1 INT (boost CHA and INT)
  - Tough: +3 MIG, +2 AGI, +1 CHA, -2 INT (boost AGI and CHA)
  - Charming: +3 CHA, +1 INT, +0 AGI, +0 MIG (boost MIG twice)

- Verify skill list accuracy against requirements
  - **Current:** Awareness, Athletics, Intimidation, Acrobatics, Trickery, Stealth, Animal, Influence, Insight, Investigation, Medicine, Survival (12 total)
  - **Note:** Archetypes reference "Arcana", "History", "Sleight of Hand", "Persuasion", "Deception", "Performance" which are NOT in the main skills array
  - **Action Required:** The 12 "Current" skills are the complete list of skills, and the "Note" skills are skills that need to be replaced with a skill from "Current" skills.

#### spells.json & maneuvers.json

**Changes:**
- ✅ **VERIFIED:** Reference document `/ref/Maneuvers and Spellcasting.md` has been analyzed
- Add `descSummary` field to each spell/maneuver
- Add `descExtremeSummary` field (3-6 words) to each spell/maneuver
- **MAJOR CHANGES REQUIRED:** Current data does not match reference document

**Current Issues Found:**

**MANEUVERS - Significant Discrepancies:**
1. **Attack Maneuvers (All Auto-Selected):**
   - ✅ Current has generic "Attack" - Reference has 3 specific attack maneuvers
   - ❌ Missing: "Extend Attack" (1 AP) - Increase melee range by 1 or ranged by 5
   - ❌ Missing: "Power Attack" (1 AP) - Deal +1 damage (can use multiple times)
   - ❌ Missing: "Sweep Attack" (1 AP) - Attack original + 1 additional target within 1 space
   - ❌ Current "Power Attack" is WRONG: Shows 2 AP and +2 damage (should be 1 AP, +1 damage)

2. **Save Maneuvers:**
   - ❌ Missing: "Expose" (1 AP) - Target gets Exposed condition (ADV on attacks against it)
   - ❌ Current "Hamstring" exists but not in reference as separate maneuver
   - ❌ Missing: "Trip" (2 AP) - Target falls Prone
   - ❌ Current has "Disarm", "Grapple", "Shove" - these are BASE ACTIONS not maneuvers

3. **Defense Maneuvers:**
   - ✅ Current has "Parry" - Reference confirms (1 AP, +5 PD bonus)
   - ❌ Missing: "Raise Shield" (1 AP) - Requires shield, reduce damage by shield's PD bonus
   - ❌ Missing: "Taunt" (1 AP, optional +1 AP) - Target gets Taunted condition
   - ❌ Current has "Defensive Stance" - NOT in reference document

4. **Grapple Maneuvers:**
   - ❌ Missing: "Body Block" (1 AP) - Reaction, split damage with grappled creature
   - ❌ Missing: "Restrain" (1 AP) - Grappled target becomes Restrained
   - ❌ Missing: "Throw" (1 AP) - Throw grappled creature

**CORRECT MANEUVER LIST (14 total + 3 auto-selected attack maneuvers):**
- **Attack Maneuvers (Auto-Selected):** Extend Attack, Power Attack, Sweep Attack
- **Save Maneuvers:** Expose, Hamstring, Trip
- **Defense Maneuvers:** Parry, Raise Shield, Taunt
- **Grapple Maneuvers:** Body Block, Restrain, Throw

**SPELLS - Complete Redesign Required:**

Current implementation is extremely simplified. Reference shows complex spell system with:
- Cantrips with multiple effects
- AP/MP enhancement systems
- Spell Checks with success/failure tiers
- Different damage types and ranges

**Lightning & Teleportation List:**
1. **Lightning Bolt** (Cantrip, 1 AP):
   - Spell Attack: 2 Lightning damage vs PD
   - OR create Lightning Orb for light (10 min)
   - AP Enhancements: +1 damage (1 AP), +5 range (1 AP), Chain to additional target (1 AP)
   - Passive: +1 damage to metal armor

2. **Crackling Lightning** (2 AP + 1 MP):
   - Choose area: Line (10 spaces), Cone (3 spaces), or Sphere (2 radius)
   - 2 Lightning damage vs PD
   - MP Enhancements: Dazed condition (1 MP), 15 space origin (1 MP)

3. **Misty Step** (1 AP + 1 MP):
   - DC 20 Spell Check
   - Success: Teleport 5 spaces (+2 per 5 over DC)
   - Failure: Teleport 3 spaces
   - MP Enhancement: +4 spaces (1 MP)

**Psychic & Enchantment List:**
1. **Psi Bolt** (Cantrip, 1 AP):
   - Spell Attack: 1 Psychic damage vs MD
   - OR cause mild headache (1 min)
   - AP Enhancements: +1 damage (1 AP), +5 range (1 AP), Dazed save (1 AP)
   - Passive: +1 damage to Dazed targets

2. **Psychic Fear** (2 AP + 1 MP):
   - Spell Check vs MD + Intelligence Save
   - Hit: 2 Psychic damage
   - Save Fail: Target spends 1 AP to move away
   - MP Enhancement: Lose additional 1 AP (1 MP)

3. **Command** (2 AP + 1 MP):
   - Spell Check vs Charisma Save
   - Success: Target spends 2 AP to follow command
   - Commands: Move, Prone, Drop, Attack
   - MP Enhancements: +1 round duration (1 MP), +1 target (2 MP)

**Holy & Restoration List:**
1. **Sacred Bolt** (Cantrip, 1 AP):
   - Spell Attack: 1 Radiant damage vs MD
   - OR create Bright Beam for light (10 min)
   - AP Enhancements: +1 damage (1 AP), +5 range (1 AP), Exposed save (1 AP)
   - Passive: +1 damage to Undead/Exposed

2. **Bless** (2 AP + 1 MP):
   - DC 10 Spell Check
   - Success: Bless 3 creatures (+1 per 10 over DC)
   - Failure: Bless 2 creatures
   - Effect: Add d4 to checks/saves (1 min, concentration)
   - MP Enhancements: +1 target (1 MP), d4→d6 (2 MP)

3. **Heal** (2 AP + 1 MP):
   - DC 10 Spell Check
   - Success: 3 HP (+1 per 5 over DC, +2 on Nat 20)
   - Failure: 2 HP
   - Bonus: +1 HP if touching
   - MP Enhancements: -1 AP cost (1 MP), +3 HP per MP (Bolster)

**Action Items:**
1. ❌ **CRITICAL:** Current maneuvers.json needs complete rewrite - only 2/14 are correct
2. ❌ **CRITICAL:** Current spells.json is too simplified - needs spell check mechanics, enhancements
3. ❌ **CRITICAL:** Spell list names wrong: "Lightning/Psychic/Holy" → "Lightning & Teleportation/Psychic & Enchantment/Holy & Restoration"
4. ❌ Need to implement Stamina Point system: "1 SP can be spent in place of 1 AP for Maneuvers"
5. ❌ Need spell check/save system with DC mechanics

#### Create: baseActionsExpanded.json

**New file:** `src/data/baseActionsExpanded.json`

**Structure:**
```json
{
  "defensiveActions": [
    {
      "id": "disengage",
      "name": "Disengage",
      "cost": "1 AP",
      "desc": "Impose DisADV on Opportunity Attacks against you until the start of your next turn.",
      "descSummary": "Disengage (1 AP): DisADV on Opportunity Attacks until your next turn.",
      "descExtremeSummary": "Safer movement",
      "variant": {
        "id": "fullDisengage",
        "name": "Full Disengage",
        "cost": "2 AP",
        "desc": "Be immune to Opportunity Attacks until the start of your next turn."
      }
    },
    {
      "id": "dodge",
      "name": "Dodge",
      "cost": "1 AP",
      "desc": "Impose DisADV on the next Attack or Grapple against you until the start of your next turn.",
      "descSummary": "Dodge (1 AP): Next attack against you has DisADV.",
      "descExtremeSummary": "Harder to hit",
      "variant": {
        "id": "fullDodge",
        "name": "Full Dodge",
        "cost": "2 AP",
        "desc": "Impose DisADV on all Attacks or Grapples against you until the start of your next turn."
      }
    },
    {
      "id": "hide",
      "name": "Hide",
      "cost": "1 AP",
      "desc": "Make a Stealth Check vs Passive Awareness to hide from creatures.",
      "descSummary": "Hide (1 AP): Stealth Check vs Passive Awareness.",
      "descExtremeSummary": "Become hidden"
    }
  ],
  "offensiveActions": [
    {
      "id": "attack",
      "name": "Attack",
      "cost": "1 AP",
      "desc": "Make 1 Attack Check.",
      "descSummary": "Attack (1 AP): Make an attack check.",
      "descExtremeSummary": "Basic attack"
    },
    {
      "id": "disarm",
      "name": "Disarm",
      "cost": "1 AP",
      "desc": "Attack Check vs Athletics, Acrobatics, or Trickery.",
      "descSummary": "Disarm (1 AP): Contested check to remove item.",
      "descExtremeSummary": "Remove held item from target"
    },
    {
      "id": "grapple",
      "name": "Grapple",
      "cost": "1 AP",
      "desc": "Use a free hand, Athletics Check vs Martial Check. Depends on creature size.",
      "descSummary": "Grapple (1 AP): Athletics vs Martial, restrain target.",
      "descExtremeSummary": "Restrain target"
    },
    {
      "id": "shove",
      "name": "Shove",
      "cost": "1 AP",
      "desc": "Athletics vs Martial.",
      "descSummary": "Shove (1 AP): Push target with contested check.",
      "descExtremeSummary": "Push target away"
    },
    {
      "id": "tackle",
      "name": "Tackle",
      "cost": "1 AP",
      "desc": "Move 2+ Spaces straight and Tackle (Grappled, you and target move 1 Space and fall Prone) a same Size or smaller creature, Athletics vs Martial.",
      "descSummary": "Tackle (1 AP): Charge and grapple, both fall prone.",
      "descExtremeSummary": "Charging grapple"
    }
  ],
  "utilityActions": [
    {
      "id": "move",
      "name": "Move",
      "cost": "1 AP",
      "desc": "Move up to your Speed. Can split movement but cannot end your turn in an occupied Space.",
      "descSummary": "Move (1 AP): Move up to your Speed.",
      "descExtremeSummary": "Move around"
    },
    {
      "id": "help",
      "name": "Help",
      "cost": "1 AP",
      "desc": "Grant a creature a d8 Help Die (lasts until the start of your next turn). Applies to Attack or Skill check.",
      "descSummary": "Help (1 AP): Give ally d8 Help Die.",
      "descExtremeSummary": "Aid an ally"
    },
    {
      "id": "object",
      "name": "Object",
      "cost": "1 AP",
      "desc": "e.g. Drink/administer a Potion, Lock/unlock a lock, transfer/toss an item",
      "descSummary": "Object (1 AP): Interact with objects or items.",
      "descExtremeSummary": "Use an item"
    },
    {
      "id": "spell",
      "name": "Spell",
      "cost": "Variable",
      "desc": "Cast a Spell you know. May require MP.",
      "descSummary": "Spell (Variable): Cast a known spell.",
      "descExtremeSummary": "Cast spell",
      "levelRequirement": "Level0",
      "classRequirement": "Caster"
    },
    {
      "id": "comboSpellcasting",
      "name": "Combo Spellcasting",
      "cost": "Variable",
      "desc": "2+ creatures can combine AP and MP to enhance a Spell.",
      "descSummary": "Combo Spellcasting: Multiple casters combine resources for enhanced spell.",
      "descExtremeSummary": "Team casting",
      "levelRequirement": "Level0",
      "classRequirement": "Caster"
    }
  ],
  "reactions": [
    {
      "id": "heldAction",
      "name": "Held Actions",
      "cost": "Variable",
      "desc": "Declare an action and a trigger outside of your turn.",
      "descSummary": "Held Actions: Prepare action with trigger.",
      "descExtremeSummary": "Ready an action"
    },
    {
      "id": "gritPoints",
      "name": "Grit Points (GP)",
      "cost": "1 GP",
      "desc": "Reduce 1 damage from an attack or give yourself ADV on a save.",
      "descSummary": "Grit Points (1 GP): Reduce damage by 1 or gain ADV on save.",
      "descExtremeSummary": "Damage reduction"
    },
    {
      "id": "opportunityAttack",
      "name": "Opportunity Attack",
      "cost": "1 AP",
      "desc": "Spend 1 AP to make a melee attack.",
      "descSummary": "Opportunity Attack (1 AP): Attack when enemy leaves reach.",
      "descExtremeSummary": "Punish movement",
      "classRequirement": "Martial"
    },
    {
      "id": "spellDuel",
      "name": "Spell Duel",
      "cost": "2 AP, 1+ MP",
      "desc": "Spend 2 AP and 1+ MP to challenge the creature with a Spell Duel.",
      "descSummary": "Spell Duel (2 AP, 1+ MP): Counter enemy spell with contested check.",
      "descExtremeSummary": "Counter spell",
      "levelRequirement": "Level0",
      "classRequirement": "Caster"
    }
  ]
}
```

#### Create: martialPaths.json

**New file:** `src/data/martialPaths.json`

```json
{
  "brawler": {
    "id": "brawler",
    "name": "Brawler",
    "desc": "A tough, close-quarters fighter who uses raw strength.",
    "image": "/martial-path/martial-path-brawler.png",
    "weapons": ["battleaxe"],
    "shield": false,
    "maneuvers": ["taunt", "bodyBlock", "throw"]
  },
  "rogue": {
    "id": "rogue",
    "name": "Rogue",
    "desc": "A cunning combatant who relies on speed and trickery.",
    "image": "/martial-path/martial-path-rogue.png",
    "conditionalLogic": {
      "condition": "hasWeapon('shortbow')",
      "ifTrue": {
        "weapons": ["throwingDagger"],
        "shield": false
      },
      "ifFalse": {
        "weapons": ["shortbow"],
        "shield": false
      }
    },
    "maneuvers": ["parry", "trip", "hamstring"]
  },
  "knight": {
    "id": "knight",
    "name": "Knight",
    "desc": "A noble warrior who defends with sword and shield.",
    "image": "/martial-path/martial-path-knight.png",
    "conditionalLogic": {
      "condition": "hasWeapon('longsword')",
      "ifTrue": {
        "weapons": [],
        "shield": true,
        "maneuvers": ["expose", "parry", "raiseShield"]
      },
      "ifFalse": {
        "weapons": ["longsword"],
        "shield": false,
        "maneuvers": ["expose", "parry", "trip"]
      }
    }
  }
}
```

**Note:** This requires additional maneuvers not currently in `maneuvers.json`:
- `trip`
- `raiseShield`
- `hamstring`
etc.

See `ref/Maneuvers and Spellcasting.md` for more details on maneuvers.

---

## PHASE 2: Level -2 (Novice) Changes

### 2.1 Update Stat Calculations

**File:** `src/utils/calculateStats.ts`

**Function:** `calculateNoviceStats()`

**Change:**
```typescript
// BEFORE
actionPoints: 3

// AFTER
actionPoints: 4
```

**Impact:** All Novice characters will have 4 AP per turn instead of 3.

### 2.2 Update Weapon Selection

**File:** `src/pages/NoviceWeaponPage.tsx`

**Status:** No changes needed

**Reason:** Component already filters weapons by `streamlined` flag. Once `weapons.json` is updated (Phase 1.2), the correct weapons will automatically display.

---

## PHASE 3: Level -1 (Pre-Adventurer) Changes

### 3.1 Update Customizable Mode - Attribute Selection

**File:** `src/pages/PreAdventurerSkillsPage.tsx`

#### 3.1.1 Add Bonus Attribute Point UI

**New section to add after base array assignment:**

```typescript
// State for bonus point allocation
const [bonusPoint1, setBonusPoint1] = useState<string>('');
const [bonusPoint2, setBonusPoint2] = useState<string>('');

// Calculate final attributes including bonus points
const calculateFinalAttributes = () => {
  const final = { ...attributes };
  if (bonusPoint1) final[bonusPoint1 as keyof Attributes] += 1;
  if (bonusPoint2) final[bonusPoint2 as keyof Attributes] += 1;

  // Cap at +3
  Object.keys(final).forEach(key => {
    if (final[key as keyof Attributes] > 3) {
      final[key as keyof Attributes] = 3;
    }
  });

  return final;
};
```

**UI component:**
```tsx
<div className="bonus-points-section">
  <h3>Bonus Attribute Points (2 points)</h3>
  <p>You have 2 additional points to spend on attributes (max +3 per attribute).</p>

  <div className="dropdowns">
    <select
      value={bonusPoint1}
      onChange={(e) => setBonusPoint1(e.target.value)}
    >
      <option value="">Select attribute...</option>
      <option value="might" disabled={attributes.might >= 3}>
        Might {attributes.might >= 3 ? '[AT MAXIMUM]' : ''}
      </option>
      <option value="agility" disabled={attributes.agility >= 3}>
        Agility {attributes.agility >= 3 ? '[AT MAXIMUM]' : ''}
      </option>
      <option value="charisma" disabled={attributes.charisma >= 3}>
        Charisma {attributes.charisma >= 3 ? '[AT MAXIMUM]' : ''}
      </option>
      <option value="intelligence" disabled={attributes.intelligence >= 3}>
        Intelligence {attributes.intelligence >= 3 ? '[AT MAXIMUM]' : ''}
      </option>
    </select>

    <select
      value={bonusPoint2}
      onChange={(e) => setBonusPoint2(e.target.value)}
    >
      {/* Same options as above */}
    </select>
  </div>
</div>
```

#### 3.1.2 Update Skill Points Formula

**Change:**
```typescript
// BEFORE
const availableSkillPoints = 5 + character.attributes.intelligence;

// AFTER
const availableSkillPoints = 5 + calculateFinalAttributes().intelligence;
```

#### 3.1.3 Update Language System

**New section for language allocation:**

```typescript
// State for language allocation
const [languagePoints, setLanguagePoints] = useState<number>(2);
const [selectedLanguages, setSelectedLanguages] = useState<{[key: string]: number}>({
  'Common': 2 // Common is always Fluent (2 points)
});

// Language point costs
const LANGUAGE_COSTS = {
  LIMITED: 1,
  FLUENT: 2
};
```

**UI component:**
```tsx
<div className="language-section">
  <h3>Languages</h3>
  <p>You are fluent in Common. You have 2 Language Points to spend.</p>
  <p>Limited proficiency costs 1 point. Fluent costs 2 points.</p>

  <div className="languages-grid">
    {languagesList.filter(lang => lang !== 'Common').map(language => (
      <div key={language} className="language-option">
        <span>{language}</span>
        <select
          value={selectedLanguages[language] || 0}
          onChange={(e) => handleLanguageChange(language, Number(e.target.value))}
        >
          <option value="0">None (0 pts)</option>
          <option value="1">Limited (1 pt)</option>
          <option value="2">Fluent (2 pts)</option>
        </select>
      </div>
    ))}
  </div>

  <p>Remaining points: {languagePoints - calculateUsedPoints()}</p>
</div>
```

#### 3.1.4 Update Continue Handler

**Modify to save new data:**
```typescript
const handleContinue = () => {
  const finalAttributes = calculateFinalAttributes();

  setAttributes(finalAttributes);
  setSkills(allocatedSkills);
  setLanguages(selectedLanguages);

  recalculateStats({
    ...character,
    attributes: finalAttributes,
    skills: allocatedSkills,
    languages: selectedLanguages
  });

  setLastStep(location.pathname);
  navigate('/character/sheet');
};
```

### 3.2 Update Streamlined Mode - Archetypes

**File:** `src/pages/PreAdventurerPage.tsx`

#### 3.2.1 Update Archetype Application

**Function:** `applyArchetype()` in `src/utils/calculateStats.ts`

**Changes:**
```typescript
export function applyArchetype(
  archetypeId: string,
  otherData: OtherData
): {
  attributes: Attributes;
  skills: { [key: string]: number };
  languages: { [key: string]: number };
} {
  const archetype = otherData.archetypes[archetypeId];

  // Attributes already include the +2 bonus from updated other.json
  const attributes = { ...archetype.attributes };

  // Apply 1 point to each suggested skill (5 + INT formula handled in recalculate)
  const skills: { [key: string]: number } = {};
  archetype.suggestedSkills.forEach(skill => {
    skills[skill] = 1;
  });

  // Languages: Common (Fluent=2) + 2 points
  // Auto-assign: Common (Fluent) + first suggested language (Fluent)
  const languages: { [key: string]: number } = {
    'Common': 2,
    [archetype.suggestedLanguages[0]]: 2
  };

  return { attributes, skills, languages };
}
```

### 3.3 Update Stat Calculations

**File:** `src/utils/calculateStats.ts`

**Function:** `recalculateStats()`

**Verify skill points calculation:**
```typescript
// Skill points = 5 + Intelligence
// This is used for validation, not direct calculation
const expectedSkillPoints = 5 + character.attributes.intelligence;
```

**Note:** Skills are already tracked as allocated points in `character.skills` object, so no formula change needed—just validation logic.

---

## PHASE 4: Level 0 Changes

### 4.1 Add Weapon/Armor Selection Flow

#### 4.1.1 Create Equipment Page

**New file:** `src/pages/Level0EquipmentPage.tsx`

```typescript
import React, { useState } from 'react';
import { useCharacterStore } from '../context/characterStore';
import { useNavigate, useLocation } from 'react-router-dom';
import ChoiceCard from '../components/ChoiceCard';

export default function Level0EquipmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const character = useCharacterStore((state) => state.character);
  const classType = character.classType;
  const creationMode = character.creationMode;
  const setArmor = useCharacterStore((state) => state.setArmor);
  const setShield = useCharacterStore((state) => state.setShield);
  const setAdditionalWeapon = useCharacterStore((state) => state.setAdditionalWeapon);
  const setLastStep = useCharacterStore((state) => state.setLastStep);
  const recalculateStats = useCharacterStore((state) => state.updateCalculatedStats);

  const [hasLightArmor, setHasLightArmor] = useState(false);
  const [equipmentChoice, setEquipmentChoice] = useState<'shield' | 'weapon' | null>(null);

  const handleContinue = () => {
    // Apply light armor
    if (hasLightArmor) {
      setArmor({ name: 'Light Armor', pdBonus: 1 });
    }

    // Apply shield or additional weapon (Martial only)
    if (classType === 'Martial') {
      if (equipmentChoice === 'shield') {
        setShield({ name: 'Shield', pdBonus: 1 });
      } else if (equipmentChoice === 'weapon') {
        // Additional weapon selection handled on next page
      }
    }

    // Recalculate stats with new equipment
    recalculateStats(character);

    setLastStep(location.pathname);

    // Navigation based on mode and class
    if (creationMode === 'streamlined') {
      if (classType === 'Martial') {
        navigate('/create/level0/martial-path');
      } else {
        navigate('/create/level0/caster');
      }
    } else {
      if (classType === 'Martial') {
        navigate('/create/level0/martial');
      } else {
        navigate('/create/level0/caster');
      }
    }
  };

  return (
    <div className="level0-equipment-page">
      <h1>Level 0: Equipment</h1>

      <section className="armor-section">
        <h2>Armor Selection</h2>
        <div className="armor-option">
          <input
            type="checkbox"
            id="lightArmor"
            checked={hasLightArmor}
            onChange={(e) => setHasLightArmor(e.target.checked)}
          />
          <label htmlFor="lightArmor">
            Light Armor (+1 PD)
          </label>
        </div>
      </section>

      {classType === 'Martial' && (
        <section className="equipment-choice-section">
          <h2>Choose One</h2>
          <div className="choice-grid">
            <ChoiceCard
              title="Shield"
              description="+1 PD, enables shield maneuvers"
              imageUrl="/equipment/equipment-shield.png"
              selected={equipmentChoice === 'shield'}
              onClick={() => setEquipmentChoice('shield')}
            />
            <ChoiceCard
              title="Additional Weapon"
              description="Dual wield or have backup weapon"
              imageUrl="/equipment/equipment-dual-weapon.png"
              selected={equipmentChoice === 'weapon'}
              onClick={() => setEquipmentChoice('weapon')}
            />
          </div>
        </section>
      )}

      <button
        onClick={handleContinue}
        disabled={classType === 'Martial' && !equipmentChoice}
      >
        Continue
      </button>
    </div>
  );
}
```

#### 4.1.2 Update Navigation in Level0Page

**File:** `src/pages/Level0Page.tsx`

**Change navigation from:**
```typescript
navigate('/create/level0/martial'); // or '/create/level0/caster'
```

**To:**
```typescript
navigate('/create/level0/equipment');
```

### 4.2 Update Ancestry Feature Selection

**File:** `src/pages/Level0AncestryPage.tsx`

#### 4.2.1 Add Dropdown Handlers

```typescript
// State for dropdown selections
const [attributeIncreaseChoice, setAttributeIncreaseChoice] = useState<string>('');
const [skillExpertiseChoice, setSkillExpertiseChoice] = useState<string>('');

// Handler for attribute increase
const handleAttributeIncrease = (attribute: string) => {
  setAttributeIncreaseChoice(attribute);

  // Apply immediately to character
  const newAttributes = {
    ...character.attributes,
    [attribute]: character.attributes[attribute as keyof Attributes] + 1
  };

  setAttributes(newAttributes);

  // Store the choice for display
  setAncestryFeatureChoice('attributeIncrease', attribute);
};

// Handler for skill expertise
const handleSkillExpertise = (skill: string) => {
  setSkillExpertiseChoice(skill);

  // Apply +2 to skill (expertise)
  const newSkills = {
    ...character.skills,
    [skill]: (character.skills[skill] || 0) + 2
  };

  setSkills(newSkills);

  // Store the choice for display
  setAncestryFeatureChoice('skillExpertise', skill);
};

// Get available attributes for increase (not at max)
const getAvailableAttributes = () => {
  return Object.keys(character.attributes).filter(attr =>
    character.attributes[attr as keyof Attributes] < 3
  );
};
```

#### 4.2.2 Update Feature Display UI

```tsx
{ancestryData.level0Features.map(feature => {
  // Display-only features
  if (feature.displayOnly) {
    return (
      <ChoiceCard
        key={feature.id}
        title={feature.name}
        description={feature.desc}
        selected={selectedFeatures.includes(feature.id)}
        onClick={() => handleFeatureToggle(feature.id)}
      />
    );
  }

  // Attribute Increase dropdown
  if (feature.id === 'attributeIncrease') {
    return (
      <div key={feature.id} className="feature-dropdown">
        <h3>{feature.name}</h3>
        <p>{feature.desc}</p>
        <select
          value={attributeIncreaseChoice}
          onChange={(e) => handleAttributeIncrease(e.target.value)}
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
      <div key={feature.id} className="feature-dropdown">
        <h3>{feature.name}</h3>
        <p>{feature.desc}</p>
        <select
          value={skillExpertiseChoice}
          onChange={(e) => handleSkillExpertise(e.target.value)}
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
```

### 4.3 Add Martial Specialization Paths (Streamlined)

#### 4.3.1 Create Martial Path Page

**New file:** `src/pages/Level0MartialPathPage.tsx`

```typescript
import React, { useState } from 'react';
import { useCharacterStore } from '../context/characterStore';
import { useNavigate, useLocation } from 'react-router-dom';
import ChoiceCard from '../components/ChoiceCard';
import martialPathsData from '../data/martialPaths.json';
import weaponsData from '../data/weapons.json';

export default function Level0MartialPathPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const character = useCharacterStore((state) => state.character);
  const setManeuvers = useCharacterStore((state) => state.setManeuvers);
  const setAdditionalWeapon = useCharacterStore((state) => state.setAdditionalWeapon);
  const setShield = useCharacterStore((state) => state.setShield);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const applyMartialPath = (pathId: string) => {
    const path = martialPathsData[pathId as keyof typeof martialPathsData];

    // Handle Knight's conditional logic
    if (pathId === 'knight') {
      const hasLongsword = character.inventory.weapon?.id === 'longsword';
      const config = hasLongsword
        ? path.conditionalLogic.ifTrue
        : path.conditionalLogic.ifFalse;

      if (config.shield) {
        setShield({ name: 'Shield', pdBonus: 1 });
      }

      if (config.weapons.length > 0) {
        const weapon = weaponsData.find(w => w.id === config.weapons[0]);
        if (weapon) setAdditionalWeapon(weapon);
      }

      setManeuvers(config.maneuvers);
    } else {
      // Standard path application
      if (path.shield) {
        setShield({ name: 'Shield', pdBonus: 1 });
      }

      if (path.weapons.length > 0) {
        const weapon = weaponsData.find(w => w.id === path.weapons[0]);
        if (weapon) setAdditionalWeapon(weapon);
      }

      setManeuvers(path.maneuvers);
    }
  };

  const handleContinue = () => {
    if (!selectedPath) return;

    applyMartialPath(selectedPath);
    setLastStep(location.pathname);
    navigate('/create/level0/ancestry');
  };

  return (
    <div className="martial-path-page">
      <h1>Choose Your Martial Path</h1>

      <div className="paths-grid">
        {Object.values(martialPathsData).map(path => (
          <ChoiceCard
            key={path.id}
            title={path.name}
            description={path.desc}
            imageUrl={path.image}
            selected={selectedPath === path.id}
            onClick={() => setSelectedPath(path.id)}
          />
        ))}
      </div>

      <button onClick={handleContinue} disabled={!selectedPath}>
        Continue
      </button>
    </div>
  );
}
```

### 4.4 Update Spellcaster Selection (Streamlined)

**File:** `src/pages/Level0CasterPage.tsx`

#### 4.4.1 Add Mode Detection

```typescript
const creationMode = character.creationMode;
const isStreamlined = creationMode === 'streamlined';
```

#### 4.4.2 Update Spell Display

```tsx
{Object.values(spellsData).map(spellList => (
  <div key={spellList.id} className="spell-list-option">
    <ChoiceCard
      title={spellList.name}
      description={spellList.desc}
      imageUrl={spellList.image}
      selected={selectedSpellList === spellList.id}
      onClick={() => setSelectedSpellList(spellList.id)}
    />

    {/* Show spell details based on mode */}
    <div className="spells-preview">
      {spellList.spells.map(spell => (
        <div key={spell.id} className="spell-item">
          <strong>{spell.name}</strong>
          {isStreamlined ? (
            // Extreme summary for streamlined
            <span className="extreme-summary"> - {spell.descExtremeSummary}</span>
          ) : (
            // Full summary for customizable
            <p className="spell-summary">{spell.descSummary}</p>
          )}
        </div>
      ))}
    </div>
  </div>
))}
```

### 4.5 Update Stat Calculations

**File:** `src/utils/calculateStats.ts`

#### 4.5.1 Add Grit Points Calculation

```typescript
// In recalculateStats() function
stats.gritPoints = 2 + character.attributes.charisma;
```

#### 4.5.2 Fix Area Defense Formula

**IMPORTANT:** Confirm with user if this is correct change.

```typescript
// CURRENT
stats.ad = 8 + cm + character.attributes.agility + character.attributes.might;

// NEW (based on requirements)
stats.ad = 8 + cm + character.attributes.charisma + character.attributes.intelligence;
```

#### 4.5.3 Update PD Formula (Already Correct)

```typescript
// Verify this is implemented correctly
stats.pd = 8 + cm + character.attributes.agility + armorBonus + shieldBonus;
```

#### 4.5.4 Add Specialization Resources

```typescript
// In recalculateStats() function
if (character.level === 'Level0') {
  if (character.classType === 'Martial') {
    stats.stamina = 1; // Note: Refreshes at end of combat or 2 AP
  } else if (character.classType === 'Caster') {
    stats.mana = 3; // Note: Refreshes on long rest
  }
}
```

#### 4.5.5 Apply Dwarven Resilience Correctly

```typescript
// In ancestry bonus section
ancestry.level0Choices.forEach(choice => {
  if (choice === 'resilience' || ancestryData.noviceFeature?.name === 'Dwarven Resilience') {
    stats.hp += 1;      // CHANGED from +2 to +1
    stats.hpMax += 1;   // CHANGED from +2 to +1
  }
  // ... other bonuses
});
```

---

## PHASE 5: Actions & Reactions Display System

### 5.1 Create Action/Reaction Display Component

**New file:** `src/components/ActionCard.tsx`

```typescript
import React from 'react';

interface ActionCardProps {
  action: {
    id: string;
    name: string;
    cost: string;
    desc: string;
    descSummary?: string;
    descExtremeSummary?: string;
  };
  displayMode: 'full' | 'summary' | 'extreme';
  onClick?: () => void;
}

export default function ActionCard({ action, displayMode, onClick }: ActionCardProps) {
  const getDisplayContent = () => {
    switch (displayMode) {
      case 'extreme':
        return action.descExtremeSummary || action.name;
      case 'summary':
        return action.descSummary || action.desc;
      case 'full':
      default:
        return action.desc;
    }
  };

  return (
    <div className="action-card" onClick={onClick}>
      <div className="action-header">
        <h4>{action.name}</h4>
        <span className="action-cost">{action.cost}</span>
      </div>
      <div className="action-content">
        {displayMode === 'extreme' ? (
          <span className="extreme-summary">{getDisplayContent()}</span>
        ) : displayMode === 'summary' ? (
          <p className="summary">{getDisplayContent()}</p>
        ) : (
          <div className="full-description">{getDisplayContent()}</div>
        )}
      </div>
    </div>
  );
}
```

### 5.2 Update Character Sheet Actions Tab

**File:** `src/pages/CharacterSheetPage.tsx` (Tab 2)

#### 5.2.1 Add Display Mode Toggle

```typescript
const [actionsDisplayMode, setActionsDisplayMode] = useState<'summary' | 'full'>('summary');
```

#### 5.2.2 Update Actions Display Logic

```tsx
<div className="actions-tab">
  {/* Display mode toggle */}
  <div className="display-mode-toggle">
    <button
      className={actionsDisplayMode === 'summary' ? 'active' : ''}
      onClick={() => setActionsDisplayMode('summary')}
    >
      Summary
    </button>
    <button
      className={actionsDisplayMode === 'full' ? 'active' : ''}
      onClick={() => setActionsDisplayMode('full')}
    >
      Full Details
    </button>
  </div>

  {/* Defensive Actions - Always shown */}
  <section className="defensive-actions">
    <h3>Defensive Actions</h3>
    {baseActionsExpanded.defensiveActions.map(action => (
      <ActionCard
        key={action.id}
        action={action}
        displayMode={actionsDisplayMode}
        onClick={() => openActionModal(action)}
      />
    ))}
  </section>

  {/* Offensive Actions - Always shown */}
  <section className="offensive-actions">
    <h3>Offensive Actions</h3>
    {baseActionsExpanded.offensiveActions.map(action => (
      <ActionCard
        key={action.id}
        action={action}
        displayMode={actionsDisplayMode}
        onClick={() => openActionModal(action)}
      />
    ))}
  </section>

  {/* Utility Actions - Always shown */}
  <section className="utility-actions">
    <h3>Utility Actions</h3>
    {baseActionsExpanded.utilityActions
      .filter(action => {
        // Filter Level 0 / Class-specific actions
        if (action.levelRequirement && character.level !== action.levelRequirement) return false;
        if (action.classRequirement && character.classType !== action.classRequirement) return false;
        return true;
      })
      .map(action => (
        <ActionCard
          key={action.id}
          action={action}
          displayMode={actionsDisplayMode}
          onClick={() => openActionModal(action)}
        />
      ))
    }
  </section>

  {/* Maneuvers - Level 0 Martial only */}
  {character.level === 'Level0' && character.classType === 'Martial' && (
    <section className="maneuvers">
      <h3>Maneuvers</h3>
      {character.chosenManeuvers.map(maneuverId => {
        const maneuver = maneuversData.find(m => m.id === maneuverId);
        if (!maneuver) return null;
        return (
          <ActionCard
            key={maneuver.id}
            action={maneuver}
            displayMode={actionsDisplayMode}
            onClick={() => openActionModal(maneuver)}
          />
        );
      })}
    </section>
  )}

  {/* Spells - Level 0 Caster only */}
  {character.level === 'Level0' && character.classType === 'Caster' && (
    <section className="spells">
      <h3>Spells</h3>
      {character.chosenSpellList && spellsData[character.chosenSpellList]?.spells.map(spell => (
        <ActionCard
          key={spell.id}
          action={spell}
          displayMode={actionsDisplayMode}
          onClick={() => openActionModal(spell)}
        />
      ))}
    </section>
  )}

  {/* Reactions - Always shown */}
  <section className="reactions">
    <h3>Reactions</h3>
    {baseActionsExpanded.reactions
      .filter(reaction => {
        // Filter Level 0 / Class-specific reactions
        if (reaction.levelRequirement && character.level !== reaction.levelRequirement) return false;
        if (reaction.classRequirement && character.classType !== reaction.classRequirement) return false;
        return true;
      })
      .map(reaction => (
        <ActionCard
          key={reaction.id}
          action={reaction}
          displayMode={actionsDisplayMode}
          onClick={() => openActionModal(reaction)}
        />
      ))
    }
  </section>
</div>
```

### 5.3 Create Spell/Maneuver Modal

**New file:** `src/components/SpellManeuverModal.tsx`

```typescript
import React from 'react';

interface SpellManeuverModalProps {
  action: {
    id: string;
    name: string;
    cost: string;
    desc: string;
    level?: number;
    type?: string;
    category?: string;
  };
  onClose: () => void;
}

export default function SpellManeuverModal({ action, onClose }: SpellManeuverModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="action-modal-card">
          <div className="action-modal-header">
            <h2>{action.name}</h2>
            {action.level !== undefined && (
              <span className="action-level">Level {action.level}</span>
            )}
          </div>

          <div className="action-modal-meta">
            <span className="action-cost"><strong>Cost:</strong> {action.cost}</span>
            {action.type && (
              <span className="action-type"><strong>Type:</strong> {action.type}</span>
            )}
            {action.category && (
              <span className="action-category"><strong>Category:</strong> {action.category}</span>
            )}
          </div>

          <div className="action-modal-description">
            <p>{action.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Usage in CharacterSheetPage:**
```typescript
const [modalAction, setModalAction] = useState<any>(null);

const openActionModal = (action: any) => {
  setModalAction(action);
};

const closeActionModal = () => {
  setModalAction(null);
};

// In JSX:
{modalAction && (
  <SpellManeuverModal action={modalAction} onClose={closeActionModal} />
)}
```

---

## PHASE 6: Ancestry Display Logic & Special Features

### 6.1 Create Ancestry Feature Handler

**New file:** `src/utils/ancestryFeatureEffects.ts`

```typescript
import type { Character, Attributes } from '../types';

/**
 * Apply attribute increase from ancestry feature
 * @param character Current character state
 * @param attribute Attribute to increase (might, agility, charisma, intelligence)
 * @returns Updated attributes object
 */
export function applyAttributeIncrease(
  character: Character,
  attribute: keyof Attributes
): Attributes {
  const newAttributes = { ...character.attributes };
  const currentValue = newAttributes[attribute];

  // Cap at +3
  if (currentValue < 3) {
    newAttributes[attribute] = currentValue + 1;
  }

  return newAttributes;
}

/**
 * Apply skill expertise from ancestry feature
 * @param character Current character state
 * @param skill Skill to apply expertise to
 * @returns Updated skills object
 */
export function applySkillExpertise(
  character: Character,
  skill: string
): { [key: string]: number } {
  const newSkills = { ...character.skills };

  // Expertise adds +2 to skill
  newSkills[skill] = (newSkills[skill] || 0) + 2;

  return newSkills;
}

/**
 * Get list of attributes available for increase (not at cap)
 * @param character Current character state
 * @returns Array of attribute keys that can be increased
 */
export function getAvailableAttributesForIncrease(
  character: Character
): (keyof Attributes)[] {
  const attributes = character.attributes;
  return (Object.keys(attributes) as (keyof Attributes)[]).filter(
    attr => attributes[attr] < 3
  );
}

/**
 * Apply Dwarven Resilience bonus
 * @param stats Current calculated stats
 * @returns Updated stats with +1 HP
 */
export function applyDwarvenResilience(stats: any): any {
  return {
    ...stats,
    hp: stats.hp + 1,
    hpMax: stats.hpMax + 1
  };
}

/**
 * Check if ancestry feature requires user choice
 * @param feature Ancestry feature object
 * @returns True if requires dropdown/selection
 */
export function requiresUserChoice(feature: any): boolean {
  return !feature.displayOnly && feature.type === 'choice';
}

/**
 * Get UI type for ancestry feature
 * @param featureId Feature ID
 * @returns UI component type to render
 */
export function getFeatureUIType(featureId: string): string {
  const dropdownFeatures = ['attributeIncrease', 'skillExpertise'];
  return dropdownFeatures.includes(featureId) ? 'dropdown' : 'checkbox';
}
```

### 6.2 Update Character Store

**File:** `src/context/characterStore.ts`

#### 6.2.1 Add Feature Choice Details

```typescript
// In Character interface
ancestry: {
  id: string | null;
  level0Choices: string[];
  level0ChoiceDetails: {
    [featureId: string]: string; // Feature ID -> Selected option (e.g., 'attributeIncrease' -> 'might')
  };
};
```

#### 6.2.2 Add Store Methods

```typescript
// In store actions
setAncestryFeatureChoice: (featureId: string, choice: string) => {
  set((state) => ({
    character: {
      ...state.character,
      ancestry: {
        ...state.character.ancestry,
        level0ChoiceDetails: {
          ...state.character.ancestry.level0ChoiceDetails,
          [featureId]: choice
        }
      }
    }
  }));
},

removeAncestryFeatureChoice: (featureId: string) => {
  set((state) => {
    const { [featureId]: removed, ...rest } = state.character.ancestry.level0ChoiceDetails;
    return {
      character: {
        ...state.character,
        ancestry: {
          ...state.character.ancestry,
          level0ChoiceDetails: rest
        }
      }
    };
  });
}
```

### 6.3 Update Stat Recalculation

**File:** `src/utils/calculateStats.ts`

#### 6.3.1 Apply Dynamic Ancestry Features

```typescript
// In recalculateStats() function, after basic stat calculations

// Apply ancestry feature effects
if (character.ancestry.id && character.ancestry.level0ChoiceDetails) {
  const choiceDetails = character.ancestry.level0ChoiceDetails;

  // Attribute Increase
  if (choiceDetails.attributeIncrease) {
    const attr = choiceDetails.attributeIncrease as keyof Attributes;
    // This is already applied to character.attributes, so it's included in calculations
  }

  // Skill Expertise
  if (choiceDetails.skillExpertise) {
    // This is already applied to character.skills, included in skill checks
  }
}

// Apply Dwarven Resilience (Novice feature)
const ancestryData = ancestriesData[character.ancestry.id as keyof typeof ancestriesData];
if (ancestryData?.noviceFeature?.name === 'Dwarven Resilience' &&
    !ancestryData.noviceFeature.displayOnly) {
  stats.hp += 1;
  stats.hpMax += 1;
}

// Apply level 0 feature stat bonuses
character.ancestry.level0Choices.forEach(choice => {
  // Fleet of Foot (Elf)
  if (choice === 'fleetOfFoot') {
    stats.speed += 1;
  }
  // Other stat-affecting features...
});
```

---

## PHASE 7: Update Character Sheet Display

### 7.1 Update Defense Stats (PD and AD)

**File:** `src/pages/CharacterSheetPage.tsx`

#### 7.1.1 Update CalculatedStats Interface

**File:** `src/types/index.ts`

```typescript
interface CalculatedStats {
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
  gritPoints: number;  // ADD THIS
}
```

**Note:** MD (Mental Defense) has been removed from the game system (see Q5 resolution)

#### 7.1.2 Update PD and AD Formulas in recalculateStats

**File:** `src/utils/calculateStats.ts`

```typescript
// NEW FORMULAS (Q5 Resolution)
stats.pd = 8 + cm + character.attributes.agility + character.attributes.intelligence + armorBonus + shieldBonus;
stats.ad = 8 + cm + character.attributes.might + character.attributes.charisma;
```

#### 7.1.3 Display Defense Stats in Character Sheet

```tsx
<div className="defenses-section">
  <FramedStat
    label="Precision Defense (PD)"
    value={character.calculatedStats.pd}
    frameType="gold-circle"
    tooltip="8 + Combat Mastery (+1) + Agility + Intelligence + Armor Bonus + Shield Bonus"
  />

  <FramedStat
    label="Area Defense (AD)"
    value={character.calculatedStats.ad}
    frameType="gold-circle"
    tooltip="8 + Combat Mastery (+1) + Might + Charisma"
  />
</div>
```

### 7.2 Update Resource Display

#### 7.2.1 Show Correct Resources by Level and Class

```tsx
{/* Resources Section */}
{character.level === 'Level0' && (
  <div className="resources-section">
    <h3>Resources</h3>

    {/* Grit Points - All characters */}
    <FramedStat
      label="Grit Points"
      value={character.calculatedStats.gritPoints}
      frameType="rectangle-gold"
      tooltip="2 + Charisma. Use to reduce damage by 1 or gain ADV on save."
    />

    {/* Stamina Points - Martial only */}
    {character.classType === 'Martial' && (
      <FramedStat
        label="Stamina Points"
        value={character.calculatedStats.stamina}
        frameType="rectangle-silver"
        tooltip="Martial resource. Refreshes at end of combat, or spend 2 AP to refresh 1 SP."
      />
    )}

    {/* Mana Points - Caster only */}
    {character.classType === 'Caster' && (
      <FramedStat
        label="Mana Points"
        value={character.calculatedStats.mana}
        frameType="rectangle-silver"
        tooltip="Caster resource. Refreshes on long rest."
      />
    )}
  </div>
)}
```

### 7.3 Add Formula Tooltips

All formula tooltips have been added in the sections above (7.1.3 and 7.2.1).

**Summary of tooltips:**
- **PD:** "8 + Combat Mastery (+1) + Agility + Intelligence + Armor Bonus + Shield Bonus"
- **AD:** "8 + Combat Mastery (+1) + Might + Charisma"
- **Grit:** "2 + Charisma. Use to reduce damage by 1 or gain ADV on save."
- **Stamina:** "Martial resource. Refreshes at end of combat, or spend 2 AP to refresh 1 SP."
- **Mana:** "Caster resource. Refreshes on long rest."

**Note:** MD (Mental Defense) removed - no longer exists in game system (Q5)

---

## PHASE 8: Verification & Testing

### 8.1 Verify Spell/Maneuver Data

**Status:** ✅ RESOLVED - Reference document analyzed (Q1, Q2)

**Completed:**
1. ✅ Analyzed `/ref/Maneuvers and Spellcasting.md` reference document
2. ✅ Identified all 12 maneuvers (3 Attack, 3 Save, 3 Defense, 3 Grapple)
3. ✅ Identified all 9 spells across 3 spell lists
4. ✅ Confirmed maneuver names for martial paths

**Action Items:**
1. ❌ Rewrite `maneuvers.json` with complete 12 maneuver list (see Phase 1.2)
2. ❌ Rewrite `spells.json` with complete 9 spell list (see Phase 1.2)
3. ❌ Verify 1:1 correspondence with images in `/public/maneuver/` and `/public/spell/` directories

**All Maneuvers Confirmed:**
- **Attack (Auto-Selected):** Extend Attack, Power Attack, Sweep Attack
- **Save:** Expose, Hamstring, Trip
- **Defense:** Parry, Raise Shield, Taunt
- **Grapple:** Body Block, Restrain, Throw

### 8.2 Skill List Verification

**Status:** ✅ RESOLVED (Q3)

**Definitive skill list (12 skills):**
Awareness, Athletics, Intimidation, Acrobatics, Trickery, Stealth, Animal Handling, Influence, Insight, Investigation, Medicine, Survival

**Action Items:**
1. ❌ Update archetype `suggestedSkills` in `other.json` to only reference these 12 skills
2. ❌ Remove invalid skill references: Arcana, History, Sleight of Hand, Persuasion, Deception, Performance

### 8.3 Language List Verification

**Status:** ✅ RESOLVED (Q4)

**Definitive language list (6 languages):**
Human, Dwarven, Elvish, Gnomish, Halfling, Orcish

**Important Notes:**
- Common is NOT in the list (everyone speaks it by default)
- Remove other languages: Draconic, Infernal, Celestial, Primordial, Giant, Goblin

**Action Items:**
1. ❌ Update `other.json` languages array to: `["Human", "Dwarven", "Elvish", "Gnomish", "Halfling", "Orcish"]`
2. ❌ Remove from current list: Common, Dwarvish, Giant, Goblin, Orc, Draconic, Infernal, Celestial, Primordial
3. ❌ Add to list: Human
4. ❌ Update Pre-Adventurer pages to reflect that Common is spoken by default (not selected)

### 8.4 Testing Checklist

#### 8.4.1 Streamlined Path Testing
- [ ] Landing → Mode (Streamlined) → Name → Novice Ancestry → Novice Weapon
  - [ ] Verify 4 streamlined weapons shown
  - [ ] Verify Novice stats calculated correctly
  - [ ] Verify 4 AP shown
- [ ] Pre-Adventurer → Archetype selection
  - [ ] Verify attributes include +2 bonus (e.g., Smart: +3/+3/+0/-2)
  - [ ] Verify skills auto-assigned
  - [ ] Verify 2 Language Points assigned (no Common selection needed)
  - [ ] Verify navigation to character sheet
- [ ] Level 0 → Class selection → Equipment → Martial Path / Spells → Ancestry → Sheet
  - [ ] Verify Light Armor checkbox works
  - [ ] Verify Martial path equipment applied correctly
  - [ ] Verify Knight conditional logic (longsword → shield)
  - [ ] Verify Caster spells show extreme-summaries
  - [ ] Verify ancestry features display correctly
  - [ ] Verify final character sheet shows all stats

#### 8.4.2 Customizable Path Testing
- [ ] Landing → Mode (Customizable) → Name → Novice Ancestry → Novice Weapon
  - [ ] Verify all 12 weapons shown
  - [ ] Verify Novice stats calculated correctly
  - [ ] Verify 4 AP shown
- [ ] Pre-Adventurer → Skills page
  - [ ] Verify attribute array assignment (3/1/0/-2)
  - [ ] Verify +2 bonus point dropdowns work (2 separate dropdowns)
  - [ ] Verify max +3 cap enforced (attributes at +3 disabled)
  - [ ] Verify skill points = 5 + INT
  - [ ] Verify language point system (2 pts total, no Common selection)
  - [ ] Verify Fluent = 2pts, Limited = 1pt
  - [ ] Verify navigation to character sheet
- [ ] Level 0 → Class selection → Equipment → Martial/Caster customization → Ancestry → Sheet
  - [ ] Verify Light Armor checkbox
  - [ ] Verify Shield vs Additional Weapon choice (Martial)
  - [ ] Verify maneuver selection (3 chosen + 3 auto-selected Attack maneuvers = 6 total)
  - [ ] Verify spell list selection with summaries
  - [ ] Verify ancestry dropdown features work
  - [ ] Verify attribute increase enforces max
  - [ ] Verify skill expertise applies +2

#### 8.4.3 Stat Calculation Testing
- [ ] Novice (Level -2):
  - [ ] HP = 6
  - [ ] PD = 8
  - [ ] AD = 8
  - [ ] AP = 4
  - [ ] CM = 0
- [ ] Pre-Adventurer (Level -1):
  - [ ] CM = 1
  - [ ] HP = 6 + MIG
  - [ ] PD = 8 + 1 + AGI + INT (NEW FORMULA - Q5)
  - [ ] AD = 8 + 1 + MIG + CHA (NEW FORMULA - Q5)
  - [ ] Attack Check = 1 + max(MIG, AGI)
  - [ ] Save DC = 10 + 1 + max(CHA, INT)
- [ ] Level 0:
  - [ ] Grit = 2 + CHA
  - [ ] Stamina = 1 (Martial)
  - [ ] Mana = 3 (Caster)
  - [ ] PD = 8 + 1 + AGI + INT + Armor(1) + Shield(1) (NEW FORMULA - Q5)
  - [ ] AD = 8 + 1 + MIG + CHA (NEW FORMULA - Q5)
  - [ ] Dwarven Resilience = +1 HP (not +2)
  - [ ] **NO MD** - removed from game (Q5)

#### 8.4.4 Ancestry Feature Testing
- [ ] Human - Attribute Increase:
  - [ ] Dropdown shows all 4 attributes
  - [ ] Attributes at +3 are disabled with "[AT MAXIMUM]"
  - [ ] Selection applies +1 to attribute
  - [ ] Stat recalculation updates derived stats
- [ ] Human - Skill Expertise:
  - [ ] Dropdown shows all skills
  - [ ] Selection applies +2 to skill
- [ ] Dwarf - Dwarven Resilience:
  - [ ] Applies +1 HP at Novice level
  - [ ] Displayed in features list
- [ ] Elf - Display-only features:
  - [ ] Can be selected
  - [ ] Displayed in character sheet
  - [ ] Don't affect stats

#### 8.4.5 Actions/Reactions Display Testing
- [ ] Character Sheet Tab 2:
  - [ ] Summary vs Full toggle works
  - [ ] Defensive actions shown for all levels
  - [ ] Offensive actions shown for all levels
  - [ ] Utility actions shown correctly by level/class
  - [ ] Maneuvers shown for Level 0 Martial
  - [ ] Spells shown for Level 0 Caster
  - [ ] Reactions shown correctly by level/class
  - [ ] Click action → modal opens with full details
  - [ ] Modal close button works

#### 8.4.6 Navigation Testing
- [ ] Home button returns to landing
- [ ] Back button uses browser history
- [ ] Return button goes to lastStep
- [ ] lastStep is set before each navigation
- [ ] Resume character flow works from localStorage

#### 8.4.7 Persistence Testing
- [ ] Create character through Streamlined path
- [ ] Refresh page mid-creation
- [ ] Verify localStorage modal appears
- [ ] Resume character
- [ ] Verify all data retained
- [ ] Complete character
- [ ] Restart browser
- [ ] Verify character still exists
- [ ] Create new character
- [ ] Verify old character overwritten

---

## PHASE 9: Navigation & Flow Updates

### 9.1 Update Route Structure

**File:** `src/App.tsx`

**Add new routes:**
```typescript
<Route path="/create/level0/equipment" element={<Level0EquipmentPage />} />
<Route path="/create/level0/martial-path" element={<Level0MartialPathPage />} />
```

**Final route structure:**
```typescript
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/create/mode" element={<ModePage />} />
  <Route path="/create/name" element={<NamePage />} />
  <Route path="/create/novice/ancestry" element={<NoviceAncestryPage />} />
  <Route path="/create/novice/weapon" element={<NoviceWeaponPage />} />
  <Route path="/create/pre-adventurer" element={<PreAdventurerPage />} />
  <Route path="/create/pre-adventurer/skills" element={<PreAdventurerSkillsPage />} />
  <Route path="/create/level0" element={<Level0Page />} />
  <Route path="/create/level0/equipment" element={<Level0EquipmentPage />} />
  <Route path="/create/level0/martial" element={<Level0MartialPage />} />
  <Route path="/create/level0/martial-path" element={<Level0MartialPathPage />} />
  <Route path="/create/level0/caster" element={<Level0CasterPage />} />
  <Route path="/create/level0/ancestry" element={<Level0AncestryPage />} />
  <Route path="/character/sheet" element={<CharacterSheetPage />} />
</Routes>
```

### 9.2 Update Navigation Logic Flow

**Complete navigation flow diagram:**

```
Landing
  ↓
Mode Selection (Streamlined / Customizable)
  ↓
Name Entry
  ↓
─────────────────────────────────────────────────────
NOVICE (Level -2)
─────────────────────────────────────────────────────
  ↓
Ancestry Selection
  ↓
Weapon Selection
  - Streamlined: 4 weapons
  - Customizable: 12 weapons
  ↓
Character Sheet (Novice complete)
  ↓
─────────────────────────────────────────────────────
PRE-ADVENTURER (Level -1)
─────────────────────────────────────────────────────
  ↓
[STREAMLINED]                [CUSTOMIZABLE]
  ↓                              ↓
Archetype Selection           Skills Page
  - Auto-assign stats           - Attribute array (3/1/0/-2)
  - Auto-assign skills          - +2 bonus points
  - Auto-assign languages       - Skill points (5 + INT)
  ↓                              - Language points (Common + 2)
Character Sheet                ↓
                              Character Sheet
  ↓
─────────────────────────────────────────────────────
LEVEL 0
─────────────────────────────────────────────────────
  ↓
Class Selection (Martial / Caster)
  ↓
Equipment Page
  - Light Armor checkbox
  - Shield vs Additional Weapon (Martial only)
  ↓
[STREAMLINED + MARTIAL]      [CUSTOMIZABLE + MARTIAL]
  ↓                              ↓
Martial Path Selection        Martial Customization
  - Brawler                     - Shield OR weapon
  - Rogue                       - Select 3 maneuvers
  - Knight                      ↓
  ↓                           Ancestry Features
Ancestry Features               ↓
  ↓                           Character Sheet
Character Sheet

[STREAMLINED + CASTER]       [CUSTOMIZABLE + CASTER]
  ↓                              ↓
Spell List Selection          Spell List Selection
  - Shows extreme summaries    - Shows full summaries
  ↓                              ↓
Ancestry Features             Ancestry Features
  ↓                              ↓
Character Sheet               Character Sheet
```

### 9.3 Update All Navigation Calls

**Pattern to follow in all page components:**
```typescript
const handleContinue = () => {
  // 1. Apply any state changes
  setWeapon(selectedWeapon);

  // 2. Recalculate stats if needed
  recalculateStats(character);

  // 3. CRITICAL: Set last step BEFORE navigating
  setLastStep(location.pathname);

  // 4. Navigate to next page
  navigate('/next-page');
};
```

**Files to update:**
- [x] `src/pages/Level0Page.tsx` - Navigate to equipment page
- [x] `src/pages/Level0EquipmentPage.tsx` - Navigate based on mode and class
- [x] `src/pages/Level0MartialPathPage.tsx` - Navigate to ancestry page
- [x] `src/pages/Level0MartialPage.tsx` - Already navigates to ancestry
- [x] `src/pages/Level0CasterPage.tsx` - Already navigates to ancestry
- [x] `src/pages/Level0AncestryPage.tsx` - Already navigates to sheet

---

## Implementation Priority Order

### Priority 1: Foundation & Quick Wins (MUST DO FIRST)
1. **Phase 1.1** - Update type definitions (enables everything else)
2. **Phase 2** - Level -2 changes (quick win, 1 line change)
3. **Phase 1.2 (partial)** - Update weapons.json for streamlined weapons

### Priority 2: Data Verification (BLOCKS LATER PHASES)
4. **Phase 8.1** - Spell/maneuver verification with user input
5. **Phase 8.2** - Skill list clarification with user
6. **Phase 8.3** - Language list confirmation with user

### Priority 3: Level -1 Implementation
7. **Phase 3.1** - Customizable mode attribute/skill/language updates
8. **Phase 3.2** - Streamlined mode archetype updates
9. **Phase 1.2 (other.json)** - Update archetypes and languages

### Priority 4: Ancestry System (NEEDED FOR LEVEL 0)
10. **Phase 6.1** - Create ancestry feature handler utilities
11. **Phase 6.2** - Update character store with feature choices
12. **Phase 6.3** - Update stat recalculation for dynamic features
13. **Phase 1.2 (ancestries.json)** - Update ancestry data

### Priority 5: Level 0 Core Features
14. **Phase 4.1** - Add equipment selection page
15. **Phase 4.2** - Update ancestry feature selection UI
16. **Phase 4.5** - Update stat calculations (grit, AD formula, specialization)
17. **Phase 1.2 (martialPaths.json)** - Create martial paths data

### Priority 6: Level 0 Specialization
18. **Phase 4.3** - Add martial path selection (streamlined)
19. **Phase 4.4** - Update caster selection with mode detection

### Priority 7: Actions & Display System
20. **Phase 1.2 (baseActionsExpanded.json)** - Create expanded actions data
21. **Phase 5.1** - Create ActionCard component
22. **Phase 5.3** - Create spell/maneuver modal
23. **Phase 5.2** - Update character sheet actions tab

### Priority 8: Character Sheet Polish
24. **Phase 7.1** - Add Mental Defense stat
25. **Phase 7.2** - Update resource display
26. **Phase 7.3** - Add formula tooltips (already done in 7.1-7.2)

### Priority 9: Navigation & Routes
27. **Phase 9.1** - Add new routes to App.tsx
28. **Phase 9.2** - Update navigation logic throughout

### Priority 10: Testing & Verification
29. **Phase 8.4** - Complete testing checklist

---

## Questions for User

### Q1: ✅ RESOLVED - Spell/Maneuver Reference Data
**Status:** Reference document analyzed - see Phase 1.2 spells.json & maneuvers.json section for complete findings

**Key Findings:**
- Current maneuvers.json needs complete rewrite - only 2/14 maneuvers are correct
- Current spells.json is too simplified - missing spell check mechanics and enhancements
- See detailed breakdown in Phase 1.2 above

### Q2: ✅ RESOLVED - Missing Maneuvers
**Status:** All maneuvers found in reference document

**Confirmed maneuvers from reference:**
- **Trip** (2 AP) - Target falls Prone
- **Raise Shield** (1 AP) - Requires shield, reduce damage by shield's PD bonus
- **Hamstring** (1 AP) - Target is Slowed until end of your next turn

**Additional maneuvers also found:**
- Expose, Taunt, Body Block, Restrain, Throw (see Phase 1.2 for full list)

### Q1-NEW: ✅ RESOLVED - Spell System Complexity Level
**Decision:** Option B (Moderate) - Store full spell/maneuver data but display only (no interactive mechanics)

**Implementation:**
- Store complete spell data with all enhancements, DCs, effects
- Store complete maneuver data with all mechanics
- Display as formatted text/cards in character sheet
- No spell check calculator or interactive casting UI

### Q2-NEW: ✅ RESOLVED - Maneuver Selection Count
**Decision:** Players start with 6 total maneuvers (3 attack + 3 chosen)

**Clarification:** Only 12 total maneuvers exist:
- **3 Attack Maneuvers (Auto-Selected):** Extend Attack, Power Attack, Sweep Attack
- **3 Save Maneuvers:** Expose, Hamstring, Trip
- **3 Defense Maneuvers:** Parry, Raise Shield, Taunt
- **3 Grapple Maneuvers:** Body Block, Restrain, Throw

**Player chooses 3 from the 9 non-attack maneuvers**

### Q3: ✅ RESOLVED - Complete Skill List
**Decision:** Use the current 12-skill list, update archetype suggested skills to match

**Definitive Skill List (12 skills):**
Awareness, Athletics, Intimidation, Acrobatics, Trickery, Stealth, Animal Handling, Influence, Insight, Investigation, Medicine, Survival

**Action:** Update archetype suggested skills in `other.json` to only reference these 12 skills

### Q4: ✅ RESOLVED - Language List Confirmation
**Decision:** Final language list (6 languages, no Common)

**Definitive Language List:**
Human, Dwarven, Elvish, Gnomish, Halfling, Orcish

**Notes:**
- Common is NOT in the list (assumed everyone speaks it)
- Remove other languages (Draconic, Infernal, Celestial, etc.)
- Use "Dwarven" not "Dwarvish"
- Use "Orcish" not "Orc"

### Q5: ✅ RESOLVED - Defense Formula Changes
**Decision:** Major rule change - MD removed, PD and AD formulas updated

**NEW FORMULAS:**
```
PD = 8 + Combat Mastery + Agility + Intelligence + Bonuses
AD = 8 + Combat Mastery + Might + Charisma + Bonuses
```

**REMOVED:**
- ~~MD (Mental Defense)~~ - No longer exists

**Changes from current:**
- PD: Added Intelligence
- AD: Changed from (AGI + MIG) to (MIG + CHA)
- MD: Deleted entirely

### Q6: ✅ RESOLVED - Martial Path Equipment Details
**Decision:** Specific equipment and maneuvers for each path

**Brawler:**
- Weapon: Battleaxe (at Level 0)
- Maneuvers: Taunt, Body Block, Throw

**Rogue:**
- Weapon: Shortbow (unless already has one, then Throwing Dagger)
- Maneuvers: Parry, Trip, Hamstring

**Knight:**
- Already defined in plan (conditional: Longsword → Shield logic)

### Q7: ✅ RESOLVED - Archetype Bonus Point Distribution
**Decision:** Use these exact distributions

**Archetype Stat Arrays:**
- **Smart:** +3 INT, +3 AGI, +0 MIG, -2 CHA
- **Quick:** +3 AGI, +2 CHA, +0 MIG, -1 INT
- **Tough:** +3 MIG, +2 AGI, +1 CHA, -2 INT
- **Charming:** +3 CHA, +1 INT, +0 AGI, +0 MIG

---

## Document Status & Next Steps

### Status: ✅ ALL QUESTIONS RESOLVED - READY TO IMPLEMENT

This document provides a complete implementation plan for all requested features. **All user questions have been answered.**

**✅ ALL RESOLVED:**
1. ✅ Spell/maneuver reference data analyzed (Q1, Q2 original)
2. ✅ Spell system complexity level (Q1-NEW) → **Option B: Display only**
3. ✅ Maneuver count (Q2-NEW) → **6 total (3 attack + 3 chosen from 9)**
4. ✅ Complete skill list (Q3) → **12 skills confirmed**
5. ✅ Language list (Q4) → **6 languages (no Common)**
6. ✅ Defense formulas (Q5) → **MD removed, PD/AD updated**
7. ✅ Martial path details (Q6) → **Brawler/Rogue/Knight specs confirmed**
8. ✅ Archetype distributions (Q7) → **Stat arrays confirmed**

**🚨 CRITICAL FORMULA CHANGES:**
- **PD = 8 + CM + AGI + INT + Bonuses** (added INT)
- **AD = 8 + CM + MIG + CHA + Bonuses** (changed from AGI+MIG to MIG+CHA)
- **MD deleted** (no longer exists in game system)

### Implementation Plan:

**ALL PHASES READY TO IMPLEMENT:**
1. ✅ **Phase 1** - Data structure & type updates (including all data files)
2. ✅ **Phase 2** - Level -2 changes (4 AP)
3. ✅ **Phase 3** - Pre-Adventurer changes
4. ✅ **Phase 4** - Level 0 equipment & specialization
5. ✅ **Phase 5** - Actions/reactions display
6. ✅ **Phase 6** - Ancestry system
7. ✅ **Phase 7** - Character sheet updates
8. ✅ **Phase 8** - Testing & verification
9. ✅ **Phase 9** - Navigation updates

### Implementation Timeline Estimate:

**Total Development Time:** 27-37 hours
- **Phase 1:** 3-5 hours (data files + types)
- **Phase 2:** 15 minutes (quick win)
- **Phase 3:** 4-5 hours (Pre-Adventurer complexity)
- **Phase 4:** 6-8 hours (Level 0 equipment + specialization)
- **Phase 5:** 4-5 hours (Actions/reactions display)
- **Phase 6:** 3-4 hours (Ancestry system)
- **Phase 7:** 2-3 hours (Character sheet updates)
- **Phase 8:** 4-6 hours (Testing)
- **Phase 9:** 2-3 hours (Navigation)

### Recommended Implementation Order:

**Session 1 (Foundation - 3-5 hours):**
- Phase 1.1: Type definitions
- Phase 1.2: Data files (weapons, other.json, languages, archetypes)
- Phase 2: Novice 4 AP change

**Session 2 (Spells & Maneuvers - 3-5 hours):**
- Phase 1.2: Complete maneuvers.json rewrite (12 maneuvers)
- Phase 1.2: Complete spells.json rewrite (9 spells, 3 lists)
- Phase 1.2: Create baseActionsExpanded.json
- Phase 1.2: Create martialPaths.json

**Session 3 (Pre-Adventurer - 4-5 hours):**
- Phase 3: Attribute +2 points, skills, languages
- Phase 6: Ancestry system infrastructure

**Session 4 (Level 0 - 6-8 hours):**
- Phase 4: Equipment selection, martial paths, caster selection
- Phase 7: Character sheet updates (new formulas!)

**Session 5 (Display & Navigation - 6-8 hours):**
- Phase 5: Actions/reactions display system
- Phase 9: Navigation updates

**Session 6 (Testing - 4-6 hours):**
- Phase 8: Complete testing checklist

**Ready to begin implementation?**

---

## Appendix: File Structure Overview

### New Files to Create:
```
src/
  data/
    baseActionsExpanded.json       (Phase 1.2)
    martialPaths.json               (Phase 1.2)
  pages/
    Level0EquipmentPage.tsx         (Phase 4.1)
    Level0MartialPathPage.tsx       (Phase 4.3)
  components/
    ActionCard.tsx                  (Phase 5.1)
    SpellManeuverModal.tsx          (Phase 5.3)
  utils/
    ancestryFeatureEffects.ts       (Phase 6.1)
docs/
  major-updates-project-plan.md    (This file)
```

### Files to Modify:
```
src/
  types/
    index.ts                        (Phase 1.1 - types)
  data/
    weapons.json                    (Phase 1.2 - streamlined flags)
    ancestries.json                 (Phase 1.2 - feature metadata)
    other.json                      (Phase 1.2 - languages, archetypes)
    spells.json                     (Phase 1.2 - add summaries)
    maneuvers.json                  (Phase 1.2 - add summaries)
  utils/
    calculateStats.ts               (Phases 2, 3, 4, 6, 7 - stat formulas)
  pages/
    NoviceWeaponPage.tsx            (Phase 2 - already correct)
    PreAdventurerPage.tsx           (Phase 3.2 - archetypes)
    PreAdventurerSkillsPage.tsx     (Phase 3.1 - attributes, skills, languages)
    Level0Page.tsx                  (Phase 4.1 - navigation)
    Level0AncestryPage.tsx          (Phase 4.2 - dropdown features)
    Level0MartialPage.tsx           (Phase 4 - updates)
    Level0CasterPage.tsx            (Phase 4.4 - mode detection)
    CharacterSheetPage.tsx          (Phases 5, 7 - actions tab, stats, resources)
  context/
    characterStore.ts               (Phase 6.2 - feature choice storage)
  App.tsx                           (Phase 9.1 - routes)
```

---

**Document End**
