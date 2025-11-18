# Fantasy Aesthetic Guide for DC20 Level 0 Character Creator

## Overview

This document outlines the visual design system for the DC20 Level 0 character creator. The aesthetic is "fantasy parchment" - evoking classic fantasy tabletop gaming with warm parchment colors, ornate borders, and traditional fantasy fonts.

The goal is to create an immersive, thematic experience while maintaining excellent readability and usability.

**Implementation Status:** Partially complete. See [project-cleanup-plan.md](project-cleanup-plan.md) for detailed status and remaining tasks.

**Related Documentation:**
- [CLAUDE.md](../CLAUDE.md) - Component patterns and styling approach
- [technical_considerations.md](technical_considerations.md) - Recent changes and known issues
- [project-cleanup-plan.md](project-cleanup-plan.md) - Detailed fix list and implementation plan

---

## Current vs. Desired Aesthetic

| Aspect | Current (Tech) | Desired (Fantasy) |
|--------|----------------|-------------------|
| **Typography** | Clean sans-serif | Flavor fonts for titles, readable serifs for body |
| **Colors** | Bright purple/blue gradient | Warm parchment OR moody dark theme |
| **Backgrounds** | Flat white/light grey | Textured parchment or dark charcoal with noise |
| **UI Elements** | Rectangular, flat, modern | Ornate, physical shapes (hearts, shields, hexagons) |
| **Borders** | Thin, subtle | Thick, decorative, with embossing |
| **Shadows** | Minimal | Deep, dramatic shadows for depth |
| **Icons** | None/minimal | Thematic fantasy icons throughout |
| **Dividers** | Simple lines | Ornate decorative dividers |

---

## Typography

### Title & Flavor Text Fonts

Use **decorative, fantasy-style fonts** for headers, titles, and flavor text. These should be used sparingly for maximum impact.

**Recommended Google Fonts:**

- **Pirata One** - Bold, pirate-y feel with thick strokes
- **Cinzel** - Classical Roman elegance, great for headers
- **Uncial Antiqua** - Medieval manuscript style
- **New Rocker** - Gothic, ornate, fantasy vibe
- **IM Fell English** - Old English, traditional RPG aesthetic

**Usage:**
- Page titles (e.g., "Choose Your Ancestry")
- Section headers
- Feature names
- Flavor quotes or lore snippets

### Body & UI Text Fonts

Use **highly readable serif or sans-serif fonts** for body text, descriptions, stat blocks, and UI elements.

**Recommended Google Fonts:**

**Serif Options (Parchment Theme):**
- **Merriweather** - Excellent readability, warm and friendly
- **EB Garamond** - Classic, elegant, highly readable
- **Sorts Mill Goudy** - Book-like quality, traditional

**Sans-Serif Options (Dark Theme):**
- **Lato** - Clean, modern but warm
- **Roboto** - Neutral, highly legible
- **Open Sans** - Friendly, versatile

**Usage:**
- Ability descriptions
- Stat values
- Button labels
- Body paragraphs
- Table content

### Font Pairing Examples

**Parchment Theme:**
- Titles: **Cinzel** (decorative)
- Body: **Merriweather** (readable serif)

**Dark Theme:**
- Titles: **New Rocker** (ornate gothic)
- Body: **Lato** (clean sans-serif)

---

## Color Palettes

### Path A: Parchment / Scroll Theme

Evokes old scrolls, weathered books, and handwritten character sheets.

**Primary Colors:**
- **Background**: `#F5E8C3` (Cream/Parchment)
- **Secondary Background**: `#E8D9B0` (Darker parchment)
- **Text**: `#3E2723` (Dark Brown)
- **Accent**: `#8B4513` (Saddle Brown)
- **Highlight**: `#D4AF37` (Gold)
- **Borders**: `#6D4C41` (Medium Brown)

**Usage:**
- Main background: Parchment cream with paper texture
- Cards/panels: Slightly darker parchment with subtle borders
- Text: Dark brown for excellent contrast
- Interactive elements: Gold highlights on hover
- Dividers: Medium brown ornate borders

### Path B: Dark Mode Fantasy Theme

Evokes candlelit taverns, mysterious dungeons, and nighttime adventures.

**Primary Colors:**
- **Background**: `#212121` (Charcoal)
- **Secondary Background**: `#2E2E2E` (Lighter Charcoal)
- **Text**: `#E0E0E0` (Light Grey)
- **Accent**: `#8B0000` (Dark Red)
- **Highlight**: `#FFD700` (Gold)
- **Borders**: `#4A4A4A` (Medium Grey)

**Usage:**
- Main background: Dark charcoal with subtle noise texture
- Cards/panels: Slightly lighter charcoal with glowing borders
- Text: Light grey for readability
- Interactive elements: Dark red accents with gold highlights
- Dividers: Glowing/embossed grey borders

---

## Textures & Backgrounds

### Parchment Theme Textures

1. **Paper Texture Overlay**: Subtle grain, wrinkles, and aging effects
   - Source: CSS noise filter or overlay PNG
   - Opacity: 5-15% to avoid overwhelming content

2. **Stain/Watermark Effects**: Faded coffee rings, worn edges
   - Use sparingly on non-critical areas
   - Should not interfere with text readability

3. **Border Textures**: Torn edges, decorative frames
   - Around cards and panels
   - Use border-image CSS for ornate frames

### Dark Theme Textures

1. **Subtle Noise**: Fine grain to prevent flat appearance
   - CSS filter or SVG noise pattern
   - Opacity: 3-8%

2. **Vignette Effect**: Darker edges, lighter center
   - Draws focus to content
   - Use radial gradients

3. **Glowing Borders**: Subtle inner glow on panels
   - Box-shadow with inset glow
   - Color: Gold or dark red

---

## UI Element Design

### Physical Stat Boxes

**Already documented in CLAUDE.md, reiterated here:**

- **HP Box**: Heart shape (❤️) - red/crimson theme
- **PD Box**: Shield shape (🛡️) - grey/silver theme
- **MD Box**: Hexagon shape - purple/blue theme
- **AD Box**: Hexagon shape - green theme

**Implementation:**
- Use CSS clip-path for custom shapes
- Add inner shadows for depth
- Embossed/engraved text style
- Icon or symbol in background

**Example CSS for Heart Shape:**
```css
.stat-box--heart {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
  background: linear-gradient(145deg, #c62828, #b71c1c);
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.3);
}
```

### Buttons

**Parchment Theme:**
- Background: Aged paper with decorative border
- Hover: Slight lift effect with shadow
- Active: Pressed/embossed appearance
- Border: Ornate frame using border-image

**Dark Theme:**
- Background: Dark with subtle glow
- Hover: Glowing border effect (gold or red)
- Active: Inner glow intensifies
- Border: Metallic/stone texture

### Cards (ChoiceCard Component)

**Current:** Plain white cards with simple borders

**Desired:**
- **Parchment**: Textured paper background with torn/decorative edges
- **Dark**: Dark panels with glowing borders and corner ornaments
- **Hover State**: Lift effect + glow + border intensification
- **Selected State**: Gold border or seal/stamp graphic overlay

### Forms & Inputs

- **Text Inputs**: Styled to look like handwritten fields or engraved stone
- **Borders**: Decorative, slightly thicker
- **Focus State**: Glow effect matching theme
- **Placeholder Text**: Italic, slightly lighter color

---

## Icons & Decorative Elements

### Thematic Icons

Use fantasy-themed icons throughout the interface:

- **Weapons**: Crossed swords, daggers, staffs
- **Magic**: Spell book, wand, crystal ball
- **Attributes**: Muscle (Might), feather (Agility), brain (Intelligence), speech bubble (Charisma)
- **Skills**: Thematic icons for each skill (e.g., magnifying glass for Investigation)
- **Ancestry**: Race-specific symbols (dwarf hammer, elf leaf, human crown)

**Icon Sources:**
- Font Awesome (free version has many fantasy icons)
- Game-icons.net (extensive free RPG icon library)
- Custom SVG icons for unique elements

### Dividers & Separators

Replace simple `<hr>` lines with ornate decorative dividers:

**Parchment Theme:**
- Flourish designs (curling vines, scrollwork)
- Horizontal ornamental borders
- Small centered icons (dragon, sword, gem)

**Dark Theme:**
- Glowing lines with center ornament
- Metallic/stone texture borders
- Runic or magical symbols

**Implementation:**
```css
.divider {
  height: 2px;
  background: linear-gradient(to right, transparent, #8B4513, transparent);
  position: relative;
}

.divider::after {
  content: "⚔️"; /* or custom SVG */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: var(--background-color);
  padding: 0 1rem;
}
```

---

## Layout Considerations

### Header

**Current:** Purple/blue gradient with white text

**Desired:**
- **Parchment**: Decorative banner with ornate title font, paper texture
- **Dark**: Dark stone/wood texture with glowing title text, corner ornaments

### Footer

- Should match header aesthetic
- Navigation buttons styled as physical objects (scrolls, buttons, runes)

### Page Backgrounds

**Parchment:**
- Full-page paper texture
- Possibly a subtle scroll border on the outer edges

**Dark:**
- Dark charcoal with noise
- Vignette effect
- Optional: Subtle background image (faded dungeon map, dragon watermark) at very low opacity

---

## Tailwind CSS Integration - Critical Warning

**⚠️ IMPORTANT: Avoid Global CSS Conflicts**

When using Tailwind CSS, do NOT use global CSS resets that override utility classes. The following patterns WILL break Tailwind:

```css
/* ❌ BAD - Breaks all Tailwind padding/margin utilities */
* {
  margin: 0;
  padding: 0;
}

/* ❌ BAD - Breaks all Tailwind button borders */
button {
  border: none;
}

/* ❌ BAD - Breaks Tailwind padding/border on form elements */
input, select, textarea {
  padding: 0.5rem;
  border: 1px solid var(--color);
}

/* ❌ BAD - Breaks Tailwind heading margins */
h1, h2, h3 {
  margin-bottom: 1rem;
}
```

**✅ SAFE Global CSS Patterns:**

```css
/* ✅ GOOD - Doesn't conflict with utilities */
* {
  box-sizing: border-box;
}

/* ✅ GOOD - Only sets properties Tailwind doesn't handle */
button {
  font-family: inherit;
  cursor: pointer;
  outline: none;
}

/* ✅ GOOD - Use @layer base for Tailwind-aware resets */
@layer base {
  body {
    @apply font-body text-brown-text bg-parchment-light;
  }
}
```

**Why This Matters:**
Global CSS rules have specificity that can override Tailwind utility classes. This causes utilities like `border-2`, `p-4`, `mb-8` to be present in the HTML but not applied visually. Always prefer Tailwind utilities over global CSS for spacing, borders, colors, etc.

**Fixed in:** 2025-11-17 session - See [technical_considerations.md](technical_considerations.md) for details.

---

## Balance Between Flavor and Usability

### Critical Guidelines

1. **Readability First**: All decorative choices must maintain excellent text legibility
   - High contrast between text and background
   - Font sizes appropriate for reading on all devices
   - Avoid busy backgrounds behind text

2. **Performance**: Textures and effects should not impact load times
   - Optimize images
   - Use CSS effects where possible
   - Test on mobile devices

3. **Accessibility**:
   - Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
   - Ensure decorative fonts are not used for critical information
   - Provide alternative text for icons

4. **Progressive Enhancement**:
   - Core functionality works without decorative elements
   - Fancy effects enhance but don't replace content

5. **Consistency**:
   - Choose ONE theme (parchment OR dark) and apply consistently
   - Use the same decorative patterns throughout
   - Maintain visual hierarchy

---

## Implementation Status

**✅ COMPLETED:**
1. **Typography**: Google Fonts loaded (Cinzel, Merriweather, Pirata One, Lato)
2. **Color Palette**: CSS custom properties defined in `src/styles/index.css` and Tailwind config
3. **Tailwind Setup**: Complete configuration with fantasy theme in `tailwind.config.js`
4. **Component Migration**: All CSS files deleted, Tailwind classes added to components

**🔄 IN PROGRESS:**
5. **Stat Boxes**: Shapes defined but clip-path needs refinement, color prop not working
6. **Buttons**: Basic Tailwind styling present, needs ornate enhancement
7. **Cards**: Parchment colors applied, but ornate borders and textures incomplete
8. **Backgrounds**: SVG noise texture defined but not visible

**❌ NOT STARTED:**
9. **Icons**: No thematic icons added yet
10. **Dividers**: Still using simple separators, no ornate elements
11. **Animations**: Defined in config but not applied to components
12. **Typography Consistency**: Fantasy fonts not applied to all appropriate elements
13. **Visual Polish**: Many hover effects, shadows, and decorative elements missing

**For detailed task breakdown, see:** [project-cleanup-plan.md](project-cleanup-plan.md)

---

## CSS Custom Properties to Update

**Current variables in `src/styles/index.css`:**

```css
:root {
  /* Update these for chosen theme */

  /* Parchment Theme Example */
  --color-background: #F5E8C3;
  --color-surface: #E8D9B0;
  --color-text-primary: #3E2723;
  --color-text-secondary: #6D4C41;
  --color-accent: #8B4513;
  --color-highlight: #D4AF37;

  /* OR Dark Theme Example */
  --color-background: #212121;
  --color-surface: #2E2E2E;
  --color-text-primary: #E0E0E0;
  --color-text-secondary: #B0B0B0;
  --color-accent: #8B0000;
  --color-highlight: #FFD700;

  /* Typography */
  --font-title: 'Cinzel', serif;
  --font-body: 'Merriweather', serif;

  /* Spacing, shadows, etc. */
  --shadow-elevated: 0 4px 8px rgba(0,0,0,0.3);
  --border-decorative: 2px solid var(--color-accent);
}
```

---

## References & Inspiration

- Classic D&D character sheets (physical paper versions)
- Fantasy book covers and medieval manuscripts
- Diablo and Baldur's Gate UI design
- Magic: The Gathering card frames
- The example D&D character creator apps provided by the user

---

## Conclusion

This aesthetic transformation should create an immersive, thematic experience that makes users feel like they're creating a character for a classic tabletop RPG adventure. Every visual element should support the fantasy setting while maintaining the excellent usability and clarity that makes the app functional.

**Key Principle**: Form follows function, but both should serve the fantasy.
