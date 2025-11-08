# DC20 Level 0 - Project Cleanup & CSS Enhancement Plan

**Date Created:** 2025-11-08
**Status:** Ready for Implementation

---

## Executive Summary

This document outlines a comprehensive plan to clean up the repository and fix formatting/aesthetic issues after the recent Tailwind CSS integration. Multiple CSS files were removed but the visual implementation is incomplete, resulting in numerous styling inconsistencies throughout the app.

---

## Analysis Results

### Playwright Testing Findings

I navigated through the entire app flow and captured screenshots of all major pages. The following issues were identified:

#### Critical Formatting Issues

1. **Missing Visual Hierarchy**
   - All text appears flat with minimal contrast
   - Headings don't stand out sufficiently from body text
   - Level badges lack visual emphasis

2. **ChoiceCard Component Issues**
   - Placeholder images fail to load (ERR_NAME_NOT_RESOLVED for via.placeholder.com)
   - Cards lack the ornate borders described in fantasy-aesthetic-guide.md
   - No hover effects visible (though CSS classes are present)
   - Cards appear cramped on mobile view
   - Selected state barely visible

3. **StatBox Component Issues**
   - No custom shapes implemented (heart for HP, shield for PD as per docs)
   - Stat boxes all look identical (square)
   - Colors not applied correctly (all use default brown border)
   - No visual distinction between stat types
   - Tooltips working but styling is basic

4. **Button Styling Issues**
   - Buttons lack decorative styling
   - "Disabled" state barely visible
   - No parchment/ornate aesthetic
   - Footer buttons appear flat

5. **Layout & Spacing Issues**
   - Excessive whitespace in some areas
   - Cramped spacing in stat displays
   - Inconsistent padding across pages
   - Character sheet feels sparse

6. **Typography Issues**
   - Fantasy fonts (Cinzel, Pirata One) not applied consistently
   - Level number styling not visible on all pages
   - Body text lacks character

7. **Background & Texture Issues**
   - Parchment background is solid color, no texture visible
   - No ornate dividers between sections
   - Missing decorative elements

8. **Character Sheet Specific Issues**
   - Attributes display lacks formatting (e.g., "Charisma-2" appears as plain text)
   - No spacing between attribute label and value
   - Equipment section too minimal
   - Tab buttons lack active state styling
   - Actions/Reactions cards have no visual structure

### Repository State

**Deleted CSS Files (not committed):**
- `src/components/ChoiceCard.css`
- `src/components/Footer.css`
- `src/components/Header.css`
- `src/components/Layout.css`
- `src/components/LocalStorageModal.css`
- `src/components/StatBox.css`
- `src/pages/CharacterSheetPage.css`
- `src/pages/LandingPage.css`
- `src/pages/Level0AncestryPage.css`
- `src/pages/Level0MartialPage.css`
- `src/pages/ModePage.css`
- `src/pages/NamePage.css`
- `src/pages/PreAdventurerSkillsPage.css`

**Modified Files:**
- All corresponding `.tsx` components updated to use Tailwind
- `tailwind.config.js` - comprehensive fantasy theme configured
- `src/styles/index.css` - base styles with CSS variables

**Issue:** The Tailwind classes were added to components, but many fantasy aesthetic features from the guide are not implemented.

---

## Project Cleanup Plan

### Phase 1: Repository Housekeeping (High Priority)

**Goal:** Clean up git state and ensure consistency

#### Tasks:

1. **Commit CSS File Deletions**
   - These files are already deleted and replaced by Tailwind
   - Should be committed to clean up git status
   - Files: All 13 deleted CSS files listed above

2. **Review Uncommitted Changes**
   - Many `.tsx` files have Tailwind classes but need refinement
   - Package.json changes (Tailwind dependencies) should be committed
   - postcss.config.js changes should be committed

3. **Clean Up Unused Assets**
   - `.playwright-mcp/` directory with screenshots can be added to .gitignore
   - Review and remove any other temporary files

---

### Phase 2: Fix Core Component Styling (High Priority)

**Goal:** Make ChoiceCard and StatBox components match the fantasy aesthetic

#### 2.1 ChoiceCard Component Fixes

**Issues to Address:**
- Placeholder image URLs fail to load
- Missing ornate border styling
- Hover effects not visible
- Selected state too subtle
- No decorative elements

**Implementation:**
```tsx
// Update ChoiceCard.tsx with:
1. Replace placeholder URLs with local SVG placeholders or data URLs
2. Add thicker, ornate borders using Tailwind border utilities
3. Enhance hover animation (scale + shadow + border glow)
4. Make selected state more prominent (gold border + glow)
5. Add corner decorative elements (optional SVG ornaments)
6. Implement parchment texture background overlay
7. Add subtle shadow effects for depth
```

**Acceptance Criteria:**
- Cards load without network errors
- Hover creates a "lift" effect with visible shadow
- Selected cards have a clear gold border with glow effect
- Cards have a fantasy/medieval aesthetic

#### 2.2 StatBox Component Fixes

**Issues to Address:**
- No custom shapes (heart, shield, hexagon)
- Color prop not working correctly
- All boxes look identical
- Missing stat-specific theming

**Implementation:**
```tsx
// Update StatBox.tsx with:
1. Implement heart clip-path for HP stat
2. Implement shield clip-path for PD stat
3. Add proper color gradients based on stat type
4. Fix color prop mapping (currently not working)
5. Add inner shadows for embossed effect
6. Improve tooltip styling with better positioning
7. Add stat-specific background patterns
```

**Acceptance Criteria:**
- HP displays in heart shape with red gradient
- PD displays in shield shape with grey/silver gradient
- MD displays in hexagon with purple gradient
- AD displays in hexagon with green gradient
- Shapes use proper clip-path CSS
- Colors match fantasy-aesthetic-guide.md specifications

---

### Phase 3: Typography & Visual Hierarchy (Medium Priority)

**Goal:** Apply fantasy fonts consistently and create clear visual hierarchy

#### 3.1 Font Application

**Issues to Address:**
- Title fonts not applied to all headings
- Body text lacks character
- Level badges inconsistent

**Implementation:**
```tsx
// Apply in relevant components:
1. Page titles → font-title (Cinzel)
2. Section headings → font-title or font-medieval
3. Card titles → font-title at smaller size
4. Body text → font-body (Merriweather)
5. Level badges → font-sans with reduced opacity (already defined)
6. Flavor text/descriptions → font-body italic
```

**Files to Update:**
- All page components (`src/pages/*.tsx`)
- ChoiceCard component
- CharacterSheetPage sections

#### 3.2 Visual Hierarchy Enhancement

**Issues to Address:**
- Headings don't stand out
- No clear content separation
- Flat appearance

**Implementation:**
1. Increase heading font sizes using Tailwind's custom sizes
2. Add text shadows to major headings
3. Use color variations (gold for important text)
4. Add ornate dividers between sections
5. Implement proper spacing scale

---

### Phase 4: Background & Textures (Medium Priority)

**Goal:** Add parchment texture and decorative elements

#### 4.1 Parchment Texture

**Current Issue:** Background is solid color

**Implementation:**
1. Verify SVG noise texture in tailwind.config.js is working
2. If not, create actual parchment texture PNG (low file size)
3. Apply as background-image with low opacity
4. Add subtle vignette effect to body
5. Test on various screen sizes

#### 4.2 Decorative Elements

**Implementation:**
1. Create ornate divider component (SVG or border-image)
2. Add section dividers to CharacterSheetPage
3. Add corner ornaments to cards (optional)
4. Add decorative border to header
5. Implement torn-edge effect on some cards (optional)

---

### Phase 5: Layout & Spacing Refinement (Medium Priority)

**Goal:** Improve spacing, alignment, and mobile responsiveness

#### 5.1 CharacterSheetPage Improvements

**Issues:**
- Stats display is cramped
- Attributes have formatting issues ("Charisma-2")
- Equipment section too minimal
- Actions/Reactions lack visual structure

**Implementation:**
```tsx
1. Fix attribute display formatting:
   - Add spacing between label and value
   - Use flex layout with gap
   - Style positive/negative values differently

2. Enhance stats grid:
   - Better spacing between stat boxes
   - Responsive grid layout
   - Group related stats visually

3. Improve Equipment section:
   - Add icons or visual separators
   - Better formatting for weapon properties
   - Card-style background

4. Actions & Reactions styling:
   - Add background to each action card
   - Visual separation between items
   - Icon or badge for AP cost
   - Better hierarchy in action names
```

#### 5.2 Form & Input Styling

**Issues:**
- Text inputs look basic
- Buttons lack character
- No focus states visible

**Implementation:**
1. Style text inputs with ornate border
2. Add focus glow effect (gold)
3. Improve button styling (embossed appearance)
4. Add disabled state with visible degradation
5. Create button variants (primary, secondary, outline)

#### 5.3 Modal Improvements

**Files:** LocalStorageModal.tsx

**Implementation:**
1. Add backdrop blur effect
2. Ornate modal border
3. Better button spacing
4. Improve modal entrance animation

---

### Phase 6: Polish & Animations (Low Priority)

**Goal:** Add subtle animations and finishing touches

#### 6.1 Animations

**Implementation:**
1. Page transition fade-in (already defined in tailwind)
2. Card entrance stagger animation
3. Stat box pulse on value change
4. Button press animation
5. Tooltip slide-in animation

#### 6.2 Easter Eggs & Delight

**Optional Enhancements:**
1. Hover effects reveal flavor text
2. Dice roll animation for random selections
3. Sound effects toggle (optional)
4. Character portrait placeholder

---

## Implementation Priority Matrix

### Must Fix (Blocking Issues)

1. ✅ ChoiceCard placeholder images → Replace with working solution
2. ✅ StatBox shapes → Implement heart/shield/hexagon
3. ✅ StatBox colors → Fix color prop application
4. ✅ Attribute display formatting → Fix "Charisma-2" spacing issue
5. ✅ Commit deleted CSS files → Clean git status

### Should Fix (UX Impact)

6. Typography consistency → Apply fantasy fonts throughout
7. Button styling → Add ornate/fantasy styling
8. Card hover effects → Make more visible
9. Selected state → Enhance visibility
10. CharacterSheet layout → Improve spacing and organization

### Nice to Have (Polish)

11. Parchment texture → Add visible texture
12. Ornate dividers → Between sections
13. Animations → Entrance and interaction animations
14. Decorative elements → Corner ornaments, borders
15. Modal enhancements → Backdrop, better styling

---

## Testing Checklist

After implementing fixes, test:

- [ ] All pages render without console errors
- [ ] Images load correctly on all cards
- [ ] StatBox shapes display correctly
- [ ] All fonts load and apply correctly
- [ ] Responsive layout works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Hover effects are visible and smooth
- [ ] Selected states are clearly distinguishable
- [ ] Form inputs are usable and styled
- [ ] Character sheet is readable and well-organized
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

## Documentation Updates Required

After implementation:

1. Update `technical_considerations.md`:
   - Document Tailwind migration completion
   - Note any new patterns or utilities added
   - Update changelog with aesthetic improvements

2. Update `fantasy-aesthetic-guide.md`:
   - Mark implemented features
   - Add screenshots of final design
   - Document any deviations from original plan

3. Update `CLAUDE.md`:
   - Remove references to deleted CSS files
   - Add section on Tailwind utility patterns used
   - Document component styling conventions

---

## Risk Assessment

### Low Risk
- Typography changes
- Color adjustments
- Spacing refinements

### Medium Risk
- Clip-path implementation (browser compatibility)
- SVG texture performance
- Complex animations

### Mitigation Strategies
1. Test clip-path in multiple browsers
2. Provide fallback for shapes (square)
3. Use CSS containment for performance
4. Keep animations subtle and optional
5. Progressive enhancement approach

---

## Timeline Estimate

- **Phase 1 (Housekeeping):** 30 minutes
- **Phase 2 (Core Components):** 3-4 hours
- **Phase 3 (Typography):** 2 hours
- **Phase 4 (Textures):** 2 hours
- **Phase 5 (Layout):** 3 hours
- **Phase 6 (Polish):** 2-3 hours

**Total Estimated Time:** 12-14 hours

---

## Success Criteria

The project cleanup is complete when:

1. ✅ No deleted files in git status (all committed)
2. ✅ No console errors on any page
3. ✅ All images load successfully
4. ✅ StatBox components display correct shapes and colors
5. ✅ Typography uses fantasy fonts consistently
6. ✅ Hover effects are visible and smooth
7. ✅ Selected states are clearly visible
8. ✅ Layout is responsive and well-spaced
9. ✅ Character sheet is readable and organized
10. ✅ App matches fantasy aesthetic guide vision (at least 80%)
11. ✅ Documentation is updated and accurate
12. ✅ All tests pass

---

## Notes

- Prioritize functionality over decoration
- Maintain accessibility (WCAG AA contrast ratios)
- Keep performance in mind (optimize images, minimize animations)
- Test on real devices, not just browser DevTools
- Consider creating a style guide page for future reference
