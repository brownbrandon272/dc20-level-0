# Technical Considerations for DC20 Level 0 Character Creator

## Overview

This document outlines the key technical decisions made during development and provides guidance for future enhancements.

**For current cleanup tasks and CSS fixes needed, see:** [project-cleanup-plan.md](project-cleanup-plan.md)

---

## Recent Changes (Latest Session)

### 2025-11-18 - UI/UX Enhancements: Images, Badges, and Categories

**Changes Implemented:**
1. **Maneuver Categorization System**: Added `maneuverCategory` field to maneuvers.json
   - Categories: Save Maneuver, Defense Maneuver, Grapple Maneuver, Attack Maneuver
   - Grouped display in Level0MartialPage with category headers
   - Proper categorization: taunt (Defense), bodyBlock (Grapple), expose/hamstring/trip (Save)

2. **Image Size Optimization**:
   - Maneuver selection cards: 32x32 pixels (`w-32 h-32`)
   - Character sheet maneuvers: 16x16 pixels (`w-16 h-16`)
   - Weapon selection cards: 12x12 pixels (`w-12 h-12`)
   - Spell images: Consistent sizing across selection and character sheet

3. **Badge Layout Optimization**:
   - Combined Action/Reaction and cost badges inline with `flex gap-2`
   - Applied to both maneuvers AND spells in character sheet
   - Significantly reduced vertical space in cards while maintaining readability
   - Blue badge for Action (`bg-blue-600`), Purple badge for Reaction (`bg-purple-600`)

4. **Full Description Display**:
   - Maneuvers now always show full `desc` in character sheet (no expand/collapse)
   - Spells retain expand/collapse functionality (descriptions are longer)
   - Removed click handler and "Click to expand" text from maneuver cards

5. **Weapon Card Enhancement**:
   - Added weapon icons to right side of weapon selection cards
   - 12x12 pixel images with flex layout for proper alignment

**Files Modified:**
- `src/data/maneuvers.json` - Added maneuverCategory field to all maneuvers
- `src/pages/Level0MartialPage.tsx` - Grouping logic, image sizing, badge layout
- `src/pages/CharacterSheetPage.tsx` - Image sizing, badge layout for both maneuvers and spells
- `src/pages/Level0EquipmentPage.tsx` - Added weapon images to cards

**Key Lessons Learned:**

1. **Inline Badge Pattern**: For cards with multiple metadata badges (type, cost, etc.), use inline flex layout instead of stacked:
   ```tsx
   <div className="flex items-center gap-2">
     <span className="badge-type">Action</span>
     <span className="badge-cost">1 AP</span>
   </div>
   ```
   This reduces vertical height while keeping badges visually associated.

2. **Categorized Display Pattern**: When displaying large lists of similar items with natural categories:
   - Group items using reduce: `items.reduce((acc, item) => { acc[item.category] = [...]; }, {})`
   - Define category display order array: `['Category1', 'Category2', ...]`
   - Map over ordered categories to ensure consistent display
   - Add category headers with styling to differentiate sections

3. **Image Sizing Strategy**:
   - Selection/choice pages: Larger images (32x32) for better visual recognition
   - Character sheet/compact displays: Smaller images (16x16) to save space
   - Icon-only displays: Very small (12x12) when image is supplementary

4. **Different Display Logic for Similar Components**:
   - Not all similar components need identical behavior
   - Maneuvers vs Spells: Both are abilities, but maneuvers have short descriptions (show all), spells have long descriptions (expand/collapse)
   - Consider content length when deciding between always-visible vs expandable

5. **Data-Driven Categorization**:
   - Add category metadata to data files rather than hard-coding categories in components
   - Allows flexibility for future category changes without touching component logic
   - Makes the system more maintainable and scalable

**Testing Notes:**
- Verified all maneuver categories display correctly in their groups
- Confirmed image sizes render at expected pixel dimensions
- Tested badge alignment in both selection and character sheet views
- Validated that spell cards still have expand/collapse while maneuvers show full descriptions

---

### 2025-11-17 - Critical CSS Conflict Fix

**Problem Identified:**
Tailwind utility classes (borders, padding, margins) were not being applied despite being present in the JSX. The issue was caused by conflicting global CSS rules in `src/styles/index.css` that had higher specificity than Tailwind utilities.

**Root Cause:**
Global CSS resets in index.css were overriding Tailwind classes:
```css
* { margin: 0; padding: 0; }  /* Overrode ALL Tailwind padding/margin */
button { border: none; }       /* Overrode ALL Tailwind button borders */
input, select {
  padding: 0.5rem;            /* Overrode Tailwind padding on form elements */
  border: 1px solid ...;      /* Overrode Tailwind borders on form elements */
}
h1, h2, h3 { margin-bottom: 1rem; }  /* Overrode Tailwind heading margins */
```

**Solution Implemented:**
Removed conflicting properties from global CSS rules in `src/styles/index.css`:
- Removed `margin: 0; padding: 0;` from universal selector
- Removed `border: none;` from button selector
- Removed `padding` and `border` from input/select/textarea selector
- Removed `margin-bottom` from heading selectors
- Removed focus state `border-color` (Tailwind handles this)

**Result:**
All Tailwind utility classes now work correctly:
- ✅ Borders: `border-2 border-gray-600` applies correctly
- ✅ Padding: `p-4`, `p-6` apply correctly
- ✅ Margins: `mb-8`, `mb-6` apply correctly
- ✅ All other Tailwind utilities functional

**Files Modified:**
- `src/styles/index.css` - Removed conflicting CSS properties

**Testing:**
Verified with Playwright MCP browser automation:
- Borders: `borderWidth: "1.6px"` ✅
- Padding: `padding: "16px"` ✅
- Margins: `marginBottom: "32px"` ✅

**Important Lesson:**
When using Tailwind CSS, avoid global CSS resets that set specific values for padding, margin, borders, etc. Use Tailwind's `@layer base` directive for base styles instead, or ensure global CSS only sets properties that won't conflict with utility classes.

---

### 2025-11-08 - Tailwind CSS Integration & Analysis

**Major Changes:**
- Full Tailwind CSS integration completed
- All component-specific CSS files deleted (13 files)
- Tailwind configuration created with fantasy theme
- Comprehensive app testing via Playwright MCP
- Documentation system expanded with project-cleanup-plan.md

**Files Affected:**
- Deleted 13 CSS files (ChoiceCard, StatBox, all page CSS files)
- Updated all corresponding .tsx files with Tailwind classes
- Added tailwind.config.js with fantasy parchment theme
- Updated src/styles/index.css with Tailwind directives

**Current Status:**
- Tailwind integration structurally complete
- Visual implementation incomplete (many aesthetic features pending)
- See project-cleanup-plan.md for detailed list of needed fixes

**Known Issues Identified:**
- ChoiceCard placeholder images fail to load (via.placeholder.com ERR_NAME_NOT_RESOLVED)
- StatBox custom shapes (heart, shield) not implemented
- StatBox color prop not working correctly
- Attribute display formatting issues ("Charisma-2" has no spacing)
- Parchment texture not visible
- Typography inconsistent (fantasy fonts not applied everywhere)
- Many hover effects not visible despite CSS classes being present

---

## Previous Changes

### 1. App Branding Update
- **Changed**: "DC20 Character Creator" → "DC20 Level 0"
- **Files Modified**:
  - index.html
  - Header.tsx
  - LandingPage.tsx
- **Rationale**: Better reflects the scope of the app (creating Level 0 characters for one-shots)

### 2. Level Numbering System Revision
- **Old System**: Novice (Level -1), Pre-Adventurer (Level -0.5), Level 0
- **New System**: Novice (Level -2), Pre-Adventurer (Level -1), Level 0
- **Implementation**:
  - Level numbers displayed in a differentiated font style (`.level-number` class)
  - Uses lighter weight `Lato` font at 87.5% size with reduced opacity
- **Files Modified**: All page components displaying level badges
- **Rationale**: Aligns with official DC20 numbering and improves visual hierarchy

### 3. Landing Page Simplification
- **Removed**: Three informational cards at bottom
- **Kept**: Two main action buttons
- **Rationale**: Reduces clutter, makes buttons more prominent, improves mobile experience

### 4. Removed Dash Action
- **Modified**: other.json baseActions array
- **Removed**: Dash action (2 AP - Move twice)
- **Rationale**: Game balance adjustment per requirements

### 5. Fixed "Return to {name}" Button Logic
- **Issue**: Button was showing on character sheet even when that was the latest page
- **Solution**: Added check to prevent display on `/character/sheet` route
- **File**: Footer.tsx

### 6. Tailwind CSS Integration (Expanded)
- **Added**: tailwind.config.js with comprehensive fantasy theme
- **Theme**: Parchment/scroll aesthetic with fantasy fonts
- **Colors**:
  - Parchment: light (#F5E8C3), default (#E8D9B0), dark (#D4C29E)
  - Brown: text (#3E2723), accent (#8B4513), medium (#6D4C41)
  - Gold: default (#D4AF37), light (#E5C158), dark (#B8941F)
  - Stat-specific: HP (red), PD (grey), MD (purple), AD (green)
- **Fonts**:
  - Titles: Cinzel, Pirata One, Uncial Antiqua, New Rocker
  - Body: Merriweather, Lato
- **Custom Utilities**:
  - Box shadows: parchment, parchment-lg, elevated, inset-sm, gold
  - Animations: fade-in, slide-up
  - Background: parchment-texture (SVG noise)
- **Rationale**: Creates immersive fantasy tabletop aesthetic
- **Status**: Configuration complete, visual implementation ongoing

---

## Bug Fixes from Previous Session

### Variable Reference Errors Fixed:
1. **NoviceAncestryPage.tsx**: `Object.values(ancestries)` → `Object.values(ancestriesData)`
2. **Level0CasterPage.tsx**: `Object.values(spells)` → `Object.values(spellsData)`
3. **NoviceWeaponPage.tsx**: Ternary `: weapons` → `: weaponsData`
4. **Level0Page.tsx**: Typo "spellsData" → "spells"

---

## Architecture Decisions

### State Management
- Zustand with persistence middleware
- localStorage key: `dc20-character-storage`
- Single store pattern

### Type Safety
- TypeScript strict mode
- JSON type checking enabled (`resolveJsonModule`)

### Data-Driven Design
- All game content in JSON files
- Easy content updates without code changes

---

## Future Enhancement Considerations

### Styling & Visual Polish (In Progress)

**See [project-cleanup-plan.md](project-cleanup-plan.md) for complete implementation plan.**

**High Priority:**
- Fix ChoiceCard placeholder images (currently fail to load)
- Implement StatBox custom shapes (heart, shield, hexagon)
- Fix StatBox color prop application
- Improve typography consistency (apply fantasy fonts)
- Fix attribute display formatting

**Medium Priority:**
- Add visible parchment texture to background
- Enhance button styling (ornate/embossed appearance)
- Improve card hover effects
- Better spacing on CharacterSheetPage
- Add ornate dividers between sections

**Low Priority:**
- Entrance animations
- Decorative corner elements
- Easter eggs and delight features

### Weapon Card Redesign (Future)
- Smaller cards (4 visible on mobile)
- Info bubble with tagline and properties
- Grid layout (2x2 mobile)

### Character Sheet Optimization (Future)
- Reduce spacing for mobile
- Compact stat display
- Collapsible sections

---

## Known Limitations

1. No backend (client-side only)
2. Single character storage
3. No export/import
4. Limited validation
5. No undo functionality

---

## Changelog

### 2025-11-08 - Tailwind Integration & Analysis
- **Integrated Tailwind CSS** with comprehensive fantasy parchment theme
- **Deleted 13 component CSS files**, migrated to Tailwind utility classes
- **Tested entire app** using Playwright MCP, identified numerous styling issues
- **Created project-cleanup-plan.md** with detailed fix list and implementation plan
- **Updated CLAUDE.md** with documentation links and current project state
- **Expanded technical_considerations.md** with Tailwind details and known issues

### 2025-11-08 - Initial Fantasy Theme Setup (Earlier)
- Updated app name to "DC20 Level 0"
- Revised level numbering (Novice = -2, Pre-Adventurer = -1)
- Simplified landing page
- Removed Dash action
- Fixed "Return to {name}" button logic
- Fixed 4 variable reference bugs
- Added Google Fonts integration
- Created tailwind.config.js with fantasy color palette and fonts
