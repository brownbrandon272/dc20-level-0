# Technical Considerations for DC20 Level 0 Character Creator

## Overview

This document outlines the key technical decisions made during development and provides guidance for future enhancements.

**For current cleanup tasks and CSS fixes needed, see:** [project-cleanup-plan.md](project-cleanup-plan.md)

---

## Recent Changes (Latest Session)

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
