# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Links to Documentation

- **[Architecture & MCP Servers](docs/mcp-browser-architecture.md)** - Available MCP tools and when to use them
- **[Fantasy Aesthetic Guide](docs/fantasy-aesthetic-guide.md)** - Complete visual design system and styling guidelines
- **[Technical Considerations](docs/technical_considerations.md)** - Recent changes, decisions, and known issues
- **[Project Cleanup Plan](docs/project-cleanup-plan.md)** - Current cleanup tasks and CSS fixes needed
- **[Docs System README](docs/README.md)** - Understanding the documentation philosophy

## Project Overview

DC20 Level 0 Character Creator - A React + TypeScript web application for creating DC20 TTRPG characters from Novice (Level -2) to Level 0. The app features two creation modes (Streamlined/Customizable), progressive leveling, and automatic state persistence via localStorage.

**Tech Stack**: React 19, TypeScript 5.7, Zustand 5, React Router 7, Vite 6, Tailwind CSS 3

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Installation
npm install          # Install dependencies
```

## Architecture Overview

### State Management Pattern

**Critical:** This app uses Zustand with persistence middleware. All character state is automatically saved to localStorage under the key `dc20-character-storage`.

- **Store Location**: `src/context/characterStore.ts`
- **Type Definitions**: `src/types/index.ts` - All TypeScript interfaces and types
- **Pattern**: Single store with `character` object containing all state
- **Auto-persistence**: Every state mutation automatically syncs to localStorage
- **Key Methods**:
  - `setLastStep(path)` - Must be called before navigation to enable "Return" functionality
  - `updateCalculatedStats(stats)` - Updates derived stats (HP, PD, MD, etc.)
  - `resetCharacter()` - Clears all character data for new character creation

**When modifying character state:**
1. Always use the store's setter methods (never mutate `character` directly)
2. Call `setLastStep()` before navigating to allow resume functionality
3. Call `updateCalculatedStats()` after any change that affects stats
4. Use `recalculateStats()` utility when attributes/level/equipment changes

### Character Progression Flow

The app follows a strict 3-stage progression:

1. **Novice (Level -2)**:
   - Routes: `/create/novice/*`
   - Choices: Ancestry → Weapon
   - Stats: Flat values (HP: 6, PD/MD/AD: 8)
   - Character Modifier (CM) = 0

2. **Pre-Adventurer (Level -1)**:
   - Routes: `/create/pre-adventurer/*`
   - Streamlined: Choose archetype (auto-assigns attributes/skills)
   - Customizable: Manual attribute allocation (3,1,0,-2) + skill points (5 + INT)
   - Character Modifier (CM) becomes 1

3. **Level 0**:
   - Routes: `/create/level0/*`
   - Choose class (Martial/Caster)
   - Martial: Select maneuvers + equipment
   - Caster: Select spell list
   - Final ancestry features

**Note:** Level numbering was updated in Nov 2025 to align with official DC20 system. See [technical_considerations.md](docs/technical_considerations.md) for details.

### Stat Calculation System

**Location**: `src/utils/calculateStats.js`

**Two calculation modes:**
- `calculateNoviceStats()` - Returns fixed Novice stats
- `recalculateStats(character)` - Calculates based on full character data

**Key formulas (for Pre-Adventurer/Level 0):**
```javascript
CM = level === 'Novice' ? 0 : 1
HP = 6 + Might
PD = 8 + CM + Agility + ArmorBonus + ShieldBonus
MD = 8 + CM + Charisma + Intelligence
AD = 8 + CM + Agility + Might
AttackCheck = CM + max(Might, Agility)
SaveDC = 10 + CM + max(Charisma, Intelligence)
```

**Ancestry bonuses** are applied in `recalculateStats()` via the `level0Choices` array:
- `'resilience'` → +2 HP
- `'fleetOfFoot'` → +1 Speed

### Navigation & State Persistence

**Three-button navigation system:**
- **Home** (Header): Always visible, navigates to `/`
- **Back** (Footer): Browser back, shown on all non-home pages
- **Return** (Footer): Jumps to `character.lastStep`, only shown when `lastStep !== currentPath`

**Critical Pattern**: Before ANY navigation that should be resumable:
```javascript
setLastStep(currentPath);
navigate(nextPath);
```

### Data-Driven Design

All game content lives in JSON files (`src/data/*.json`) with TypeScript type checking:
- `weapons.json` - Array of weapon objects with `streamlined: boolean` flag
- `ancestries.json` - Map of ancestry objects with features by level
- `spells.json` - Map of spell lists keyed by ID (lightning, psychic, holy)
- `maneuvers.json` - Array of maneuver objects with `autoSelected` flag
- `other.json` - Object with skills, languages, archetypes, base actions/reactions

**Type definitions** in `src/types/index.ts` provide compile-time checking for all data structures.

**Adding new content:**
1. Add data to appropriate JSON file in `src/data/`
2. TypeScript validates structure based on inferred types from JSON imports
3. Enable `resolveJsonModule` in tsconfig.json for JSON type checking
4. Special mechanics require updating `recalculateStats()` or `applyArchetype()` in `src/utils/calculateStats.ts`

**Importing data:**
```typescript
import weaponsData from '../data/weapons.json';
import ancestriesData from '../data/ancestries.json';
import spellsData from '../data/spells.json';
import maneuversData from '../data/maneuvers.json';
import otherData from '../data/other.json';
```

### Route Structure & Flow Control

**Flow divergence based on `creationMode`:**
- Streamlined: Pre-selected options, archetypes, limited choices
- Customizable: Full control, manual allocation

**Example flow divergence** (see `PreAdventurerPage.tsx`):
```typescript
if (creationMode === 'streamlined') {
  // Apply archetype → auto-calculate → go to sheet
  navigate('/character/sheet');
} else {
  // Go to manual attribute/skill allocation page
  navigate('/create/pre-adventurer/skills');
}
```

**Modal system**: `LocalStorageModal` checks for existing character on landing page:
- Detects via `hasExistingCharacter()` (checks for name + ancestry)
- Returns to `character.lastStep` or falls back to `/character/sheet`

### Component Patterns & Styling

**IMPORTANT:** This app uses **Tailwind CSS** for all styling. Component-specific CSS files have been removed. All styling is done via Tailwind utility classes in JSX.

**Tailwind Configuration:**
- Location: `tailwind.config.js`
- Theme: Fantasy parchment aesthetic
- Colors: Parchment backgrounds, brown text, gold accents, stat-specific colors
- Fonts: Cinzel (titles), Merriweather (body), Pirata One, Lato
- See [fantasy-aesthetic-guide.md](docs/fantasy-aesthetic-guide.md) for complete design system

**Global Styles:**
- Location: `src/styles/index.css`
- Contains: Google Fonts imports, Tailwind directives, CSS custom properties, global resets
- Body background: Parchment with SVG noise texture

**ChoiceCard**: Universal selection component
- Used for all major choices (mode, ancestry, weapon, class, etc.)
- Props: `title`, `description`, `imageUrl`, `onClick`, `selected`, `disabled`
- Styling: Tailwind classes for parchment background, ornate borders, hover effects
- **Known Issue:** Placeholder image URLs currently fail to load (needs fix - see project-cleanup-plan.md)

**StatBox**: Character stat display
- Props: `label`, `value`, `tooltip`, `shape`, `color`
- Supports `shape` prop: `'square'` (default), `'heart'` (HP), `'shield'` (PD)
- Supports `color` prop: `'primary'`, `'heart'`, `'shield'`, etc.
- **Known Issue:** Custom shapes (heart/shield) not fully implemented (needs clip-path refinement)
- Tooltips on hover with arrow indicator
- Used in CharacterSheetPage for all stats

**CharacterSheetPage tabs**:
- Tab 1: Stats + Attributes + Equipment + Resources
- Tab 2: Actions + Reactions (dynamically populated based on level/class)
- Styling: Parchment cards with brown accents

**Common UI Patterns (Established 2025-11-18):**

1. **Inline Badge Layout** - For cards with multiple metadata indicators:
   ```tsx
   <div className="flex items-center gap-2">
     <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">Action</span>
     <span className="bg-brown-accent text-parchment-light px-2 py-1 rounded-full text-xs">1 AP</span>
   </div>
   ```
   - Use `flex gap-2` to keep badges together horizontally
   - Reduces vertical card height while maintaining readability
   - Applied to maneuvers, spells, and similar ability cards

2. **Categorized List Display** - For large lists with natural groupings:
   ```tsx
   // Group items by category
   const itemsByCategory = items.reduce((acc, item) => {
     const category = item.category || 'Other';
     if (!acc[category]) acc[category] = [];
     acc[category].push(item);
     return acc;
   }, {});

   // Define display order
   const categoryOrder = ['Category1', 'Category2', 'Other'];

   // Render in order
   {categoryOrder.map(category => {
     const categoryItems = itemsByCategory[category];
     if (!categoryItems) return null;
     return (
       <div key={category}>
         <h3>{category}</h3>
         {categoryItems.map(item => <Card key={item.id} {...item} />)}
       </div>
     );
   })}
   ```
   - Store category metadata in data files, not components
   - Use ordered array to control display sequence
   - Applied to maneuver selection page

3. **Image Sizing Hierarchy**:
   - **Selection/choice pages**: 32x32px (`w-32 h-32`) - Larger for visual recognition
   - **Character sheet displays**: 16x16px (`w-16 h-16`) - Compact for space efficiency
   - **Icon supplements**: 12x12px (`w-12 h-12`) - When image is secondary to text
   - Always use `object-contain` to preserve aspect ratio

4. **Conditional Display Logic**:
   - Similar components may need different behaviors based on content
   - Example: Maneuvers (short descriptions) show full text always, Spells (long descriptions) use expand/collapse
   - Consider content length and user needs when choosing display patterns

### Critical Implementation Details

**Streamlined mode weapon filtering:**
```typescript
const weaponsList = creationMode === 'streamlined'
  ? weaponsData.filter(w => w.streamlined)
  : weaponsData;
```

**Level 0 armor bonus:**
All characters get Light Armor (+1 PD) when reaching Level 0 (set in `Level0Page.tsx`)

**Maneuver auto-selection:**
The 'attack' maneuver has `autoSelected: true` and is always included for Martial characters

**Archetype application (Streamlined):**
Archetypes in `otherData` define complete attribute sets. The `applyArchetype()` utility extracts attributes/skills/languages and auto-assigns them.

## Common Modifications

### Adding a New Ancestry
1. Add entry to `src/data/ancestries.json` following the structure
2. Include `noviceFeature` (single object) and `level0Features` (array of choices)
3. TypeScript will infer types from JSON and provide type checking
4. If feature affects stats, update `recalculateStats()` in `src/utils/calculateStats.ts`

### Adding New Weapons/Spells/Maneuvers
1. Add to respective JSON file in `src/data/`
2. Follow existing structure - JSON imports are type-checked via `resolveJsonModule`
3. For streamlined weapons: set `"streamlined": true`
4. For auto-selected maneuvers: set `"autoSelected": true`

### Modifying Stat Calculations
Edit `src/utils/calculateStats.ts`:
- Novice stats: `calculateNoviceStats()`
- Progressive stats: `recalculateStats()`
- Always return complete stats object matching the `CalculatedStats` type

### Changing Navigation Flow
1. Update route in `src/App.tsx`
2. Create page component in `src/pages/` as a `.tsx` file
3. Ensure proper TypeScript typing for props and state
4. Ensure proper `setLastStep()` calls before navigation
5. Handle both streamlined/customizable modes if applicable

## TypeScript Guidelines

**Type Imports:**
```typescript
import type { Character, Weapon, Ancestry } from '../types';
```

**Component Props:**
Always define interface for component props:
```typescript
interface MyComponentProps {
  title: string;
  onSelect: (id: string) => void;
  optional?: boolean;
}
```

**Store Usage:**
The store is fully typed. TypeScript will infer types:
```typescript
const character = useCharacterStore((state) => state.character);
const setWeapon = useCharacterStore((state) => state.setWeapon);
```

## Debugging Tips

**Check localStorage:** Browser DevTools → Application → Local Storage → `dc20-character-storage`

**Type errors:**
- Check `src/types/index.ts` for type definitions
- Ensure imported data uses correct types (e.g., `Weapon[]` not `any[]`)
- Use TypeScript's type inference where possible

**Stat calculation issues:**
- Verify `updateCalculatedStats()` is called after state changes
- Check CM (Character Modifier) is correct for level
- Ensure ancestry bonuses are in the `level0Choices` array
- Check return type matches `CalculatedStats` interface

**Navigation issues:**
- Verify `setLastStep()` is called before each navigate
- Check `character.lastStep` in store to debug "Return" button

**Mode-specific bugs:**
- Check `character.creationMode` value (type: `CreationMode | null`)
- Ensure conditional logic properly handles both 'streamlined' and 'customizable'

## Tech Stack & Styling System

- **React 19** + React Router 7
- **TypeScript 5.7**
- **Zustand 5** (with persist middleware)
- **Vite 6** (build tool)
- **Tailwind CSS 3** (utility-first styling)
- **PostCSS** (CSS processing)
- **Google Fonts** (Cinzel, Merriweather, Pirata One, Lato)

**Styling Approach:**
- Tailwind utility classes for all component styling
- CSS custom properties in `src/styles/index.css` for theme values
- No component-specific CSS files (all removed in Tailwind migration)
- Fantasy parchment theme with brown/gold color palette
- See [fantasy-aesthetic-guide.md](docs/fantasy-aesthetic-guide.md) for complete design system

**Current Status:**
- Tailwind integration complete
- Many aesthetic features from design guide still need implementation
- See [project-cleanup-plan.md](docs/project-cleanup-plan.md) for detailed fix list
