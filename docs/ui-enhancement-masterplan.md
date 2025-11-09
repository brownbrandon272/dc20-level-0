# DC20 Level 0 - UI Enhancement Masterplan

**Goal:** Transform the app to match the visual quality and UX of D&D Beyond, Fantasy Grounds, and Foundry VTT

**Date Created:** 2025-11-08

---

## Reference Analysis

I analyzed 9 reference screenshots from professional TTRPG character creators. Here are the key patterns that make them exceptional:

### 🎨 Visual Elements That Make It "Pop"

1. **Rich Imagery Everywhere**
   - Character portraits (large, prominent)
   - Class/ancestry icons (custom, colorful, thematic)
   - Background images (atmospheric, thematic)
   - Illustrated cards with artwork

2. **Custom Shaped Components**
   - Hexagonal stat displays (D&D Beyond mobile)
   - Shield-shaped elements (Forge)
   - Ornate borders (all examples)
   - Non-rectangular cards with angled corners

3. **Dense Information Design**
   - Every pixel serves a purpose
   - Compact but not cramped
   - Visual grouping with containers
   - Collapsible sections for complex data

4. **Intentional Color Usage**
   - Color-coded stats (red HP, blue mana, green stamina)
   - Colored backgrounds for different sections
   - Gradient overlays on images
   - Distinct visual zones

5. **Typography Hierarchy**
   - Multiple font sizes create clear hierarchy
   - Bold headings, lighter descriptions
   - Numbers prominently displayed
   - Icons paired with text

---

## What You Need to Provide

I need you to source or create the following assets to match reference quality:

### 🖼️ Priority 1: Essential Images (REQUIRED)

#### Ancestry Art (3 images)
- **Human portrait** - 300x400px minimum
- **Elf portrait** - 300x400px minimum
- **Dwarf portrait** - 300x400px minimum

**Style:** Fantasy character art, portrait orientation, similar to D&D Beyond premade characters
**Format:** PNG or WebP with transparency (preferred) or JPEG
**Where to get:**
- AI generation (Midjourney, DALL-E, Stable Diffusion)
- Stock art sites (ArtStation, DeviantArt)
- Commission an artist
- Public domain fantasy art

#### Class/Path Icons (2 icons)
- **Martial icon** - 128x128px minimum (crossed swords, shield, weapon)
- **Caster icon** - 128x128px minimum (spell book, staff, magical symbol)

**Style:** Simple, iconic, flat or slightly 3D
**Format:** PNG with transparency or SVG (preferred)
**Where to get:**
- Game-icons.net (free, extensive library)
- Font Awesome Pro (if you have license)
- Noun Project
- Custom design in Figma/Illustrator

#### Weapon Icons (4+ icons)
- **Shortsword** - 64x64px minimum
- **Quarterstaff** - 64x64px minimum
- **Shortbow** - 64x64px minimum
- **Throwing Dagger** - 64x64px minimum

**Style:** Flat icons or illustrated
**Format:** PNG or SVG
**Where to get:** Game-icons.net is perfect for this

### 🎨 Priority 2: Enhanced Assets (HIGHLY RECOMMENDED)

#### Background Texture
- **Parchment/paper texture** - Tileable, subtle grain
- **Size:** 512x512px or larger (tileable)
- **Format:** PNG or JPEG
- **Where to get:**
  - TextureKing.com (free textures)
  - Generate with Photoshop/GIMP filters
  - Photograph actual parchment paper

#### Archetype Art (4 images) - For Streamlined Mode
- **Smart archetype** - 200x200px (scholar, wizard-like)
- **Quick archetype** - 200x200px (rogue, agile)
- **Tough archetype** - 200x200px (fighter, strong)
- **Charming archetype** - 200x200px (bard, social)

**Style:** Simpler than ancestry art, can be illustrated icons
**Format:** PNG with transparency

### 🌟 Priority 3: Polish Assets (NICE TO HAVE)

#### Decorative Elements
- **Ornate border SVG** - For cards and sections
- **Divider SVG** - Ornate horizontal rule with center ornament
- **Corner ornaments** - Small decorative corners for frames

**Where to get:**
- Freepik (free SVG ornaments)
- Custom design
- Convert from existing RPG resources

#### Spell/Maneuver Icons
- Icons for each spell type (lightning, psychic, holy)
- Icons for maneuvers (attack, defend, etc.)

**Where to get:** Game-icons.net

---

## Component Design System

Based on the references, here's what we'll build:

### 1. ChoiceCard Component (Complete Redesign)

**Current State:** Rectangle with broken placeholder image
**Target State:** D&D Beyond style card with rich imagery

**New Design:**
```
┌─────────────────────────────┐
│                             │
│   [LARGE CHARACTER IMAGE]   │ ← Full-bleed portrait
│        with gradient        │
│         overlay             │
│                             │
├─────────────────────────────┤
│  HUMAN                      │ ← Title (large, bold)
│  Rogue                      │ ← Subtitle (if applicable)
│                             │
│  Short description text     │ ← 2-3 lines max
│  about the choice...        │
│                             │
│  [PREVIEW]  [SELECT]        │ ← Action buttons
└─────────────────────────────┘
```

**Key Features:**
- Image fills top 60% of card
- Gradient overlay at bottom for text readability
- Angled/ornate border (CSS clip-path or border-image)
- Hover: Image scales up slightly, glow effect
- Selected: Gold border, check icon, elevated shadow

### 2. StatBox Component (Enhanced)

**Current State:** Basic square boxes
**Target State:** D&D Beyond mobile hexagons / Forge styled boxes

**Design Options:**

**Option A: Hexagonal (Modern, D&D Beyond style)**
```
    ___
   /   \
  /  6  \   ← Large number
 |  HP  |   ← Label
  \     /
   \___/
```

**Option B: Shield/Badge (Fantasy, Forge style)**
```
  /‾‾‾\
 |  6  |   ← Number in center
 |  HP |   ← Label
  \___/
```

**Implementation:**
- Clip-path for shape
- Color-coded backgrounds (red HP, blue PD, purple MD, green AD)
- Inner shadow for depth
- Glowing border on hover
- Larger on desktop (120px), smaller on mobile (80px)

### 3. Character Portrait System (NEW)

**Location:** Top of character sheet, next to name

**Design:**
```
┌──────────────────────────────────────┐
│  ┌───────┐                           │
│  │ [IMG] │  Testchar                 │ ← Name (huge)
│  │ PORT- │  Human • Pre-Adventurer   │ ← Ancestry • Level
│  │ RAIT  │  Level -1                 │ ← Level badge
│  └───────┘                           │
└──────────────────────────────────────┘
```

**Features:**
- 120x120px circular or ornate frame
- Upload/select functionality (future)
- Defaults to ancestry-based silhouette
- Ornate border matching theme

### 4. Character Sheet Redesign

**Reference:** D&D Beyond's multi-column layout + Forge's compact design

**New Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [PORTRAIT]  Character Name            [HOME] [EXPORT]  │
│              Ancestry • Level                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┐  ┌──────────────────────────────┐  │
│  │ STATS          │  │ ATTRIBUTES                   │  │
│  │                │  │                              │  │
│  │ [HP] [PD] [MD] │  │  Might      +2   🗡️         │  │
│  │ [AD] [SP] [AP] │  │  Agility    +1   🏹         │  │
│  │                │  │  Charisma   -2   💬         │  │
│  └────────────────┘  │  Intelligence +3  📖        │  │
│                      └──────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐    │
│  │ EQUIPMENT                                      │    │
│  │  🗡️ Shortsword (1H, 2 S damage, Parry)       │    │
│  │  🛡️ Light Armor (+1 PD)                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ FEATURES & ABILITIES                           │    │
│  │                                                │    │
│  │  ✨ Human Determination                        │    │
│  │  Once per rest, reroll any check...           │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Key Improvements:**
- Multi-column layout (2-3 columns on desktop, 1 on mobile)
- Stat boxes in prominent grid
- Icons next to attributes
- Equipment cards with icons
- Collapsible sections for advanced details
- Background cards/panels for visual grouping

### 5. Selection Page Redesign

**Reference:** D&D Beyond class selector with icons

**New Design for Ancestry/Weapon/Class Pages:**
```
┌───────────────────────────────────────────────────┐
│  Choose Your Ancestry                   Novice -2 │
│  Your heritage and special abilities              │
├───────────────────────────────────────────────────┤
│                                                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  [ICON]    │  │  [ICON]    │  │  [ICON]    │ │
│  │            │  │            │  │            │ │
│  │  [IMAGE]   │  │  [IMAGE]   │  │  [IMAGE]   │ │
│  │            │  │            │  │            │ │
│  │  Human     │  │  Elf       │  │  Dwarf     │ │
│  │            │  │            │  │            │ │
│  │  Short desc│  │  Short desc│  │  Short desc│ │
│  └────────────┘  └────────────┘  └────────────┘ │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Features:**
- Icon above or on card
- Full character portrait
- Color-coded borders per type
- Grid layout: 3 cols desktop, 2 cols tablet, 1 col mobile
- Search/filter bar for many options (future)

### 6. Action/Reaction Cards (NEW)

**Reference:** Forge's spell/ability layout

**Design:**
```
┌──────────────────────────────────────┐
│  ⚔️ Attack            [1 AP]          │ ← Icon, name, cost badge
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Divider
│  Make a weapon attack against a      │
│  creature within reach.              │ ← Description
│                                       │
│  Range: Melee  |  Type: Martial      │ ← Properties
└──────────────────────────────────────┘
```

**Features:**
- Compact card format
- Icon + name + AP cost badge
- Expandable for full details
- Color-coded borders (actions = blue, reactions = orange)
- Hover shows tooltip with full details

---

## Technical Implementation Plan

### Phase 1: Asset Integration (2-3 hours)

**Prerequisites:** You provide images

**Tasks:**
1. Create `/public/images/` directory structure:
   ```
   /public/images/
     /ancestries/
       human.png
       elf.png
       dwarf.png
     /classes/
       martial-icon.png
       caster-icon.png
     /weapons/
       shortsword.svg
       quarterstaff.svg
       shortbow.svg
       throwing-dagger.svg
     /archetypes/
       smart.png
       quick.png
       tough.png
       charming.png
     /textures/
       parchment.jpg
     /decorative/
       border-ornate.svg
       divider.svg
   ```

2. Update data files with image paths:
   ```json
   // ancestries.json
   {
     "human": {
       "name": "Human",
       "image": "/images/ancestries/human.png",
       "icon": "/images/ancestries/human-icon.svg",
       // ...
     }
   }
   ```

3. Update ChoiceCard to use real images:
   ```tsx
   <img
     src={imageUrl || '/images/placeholder.png'}
     alt={title}
     onError={(e) => e.target.src = '/images/placeholder.png'}
   />
   ```

### Phase 2: ChoiceCard Redesign (3-4 hours)

**Tasks:**

1. **Create new ChoiceCard variant: "ImageCard"**
   ```tsx
   // New component: ImageChoiceCard.tsx
   interface Props {
     title: string;
     subtitle?: string;
     description: string;
     imageUrl: string;
     iconUrl?: string;
     onClick: () => void;
     selected?: boolean;
     showPreview?: boolean;
   }
   ```

2. **Implement gradient overlay**
   - Image fills top portion
   - Linear gradient from transparent to black at bottom
   - Text overlays gradient for readability

3. **Add ornate border**
   - Use Tailwind's border-image or SVG border
   - Angled corners with clip-path
   - Gold border on selected state with glow

4. **Dual button layout**
   - "Preview" button (outline style)
   - "Select" button (solid style)
   - Preview opens modal with full details (future enhancement)

5. **Hover animations**
   - Image scales 105%
   - Card lifts with enhanced shadow
   - Glow effect on border

**Example Implementation:**
```tsx
<div className="group relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
  {/* Image Section */}
  <div className="relative h-64 overflow-hidden">
    <img
      src={imageUrl}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* Icon Badge */}
    {iconUrl && (
      <div className="absolute top-4 left-4 w-12 h-12 bg-parchment rounded-full p-2">
        <img src={iconUrl} alt="" />
      </div>
    )}
  </div>

  {/* Content Section */}
  <div className="p-4 bg-parchment">
    <h3 className="font-title text-2xl text-brown-text">{title}</h3>
    {subtitle && <p className="text-brown-medium">{subtitle}</p>}
    <p className="text-sm mt-2">{description}</p>

    {/* Buttons */}
    <div className="flex gap-2 mt-4">
      <button className="flex-1 btn-outline">Preview</button>
      <button className="flex-1 btn-primary">Select</button>
    </div>
  </div>
</div>
```

### Phase 3: StatBox Shape Implementation (2-3 hours)

**Tasks:**

1. **Create hexagon clip-path utility in Tailwind config**
   ```js
   // tailwind.config.js
   theme: {
     extend: {
       clipPath: {
         hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
         shield: 'polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%)',
         badge: 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%)',
       }
     }
   }
   ```

2. **Update StatBox component with proper shapes**
   ```tsx
   const shapeClasses = {
     square: 'rounded-lg',
     hexagon: 'clip-path-hexagon',
     shield: 'clip-path-shield',
     badge: 'clip-path-badge',
   };

   const colorSchemes = {
     hp: 'bg-gradient-to-br from-red-500 to-red-700 text-white',
     pd: 'bg-gradient-to-br from-gray-400 to-gray-600 text-white',
     md: 'bg-gradient-to-br from-purple-500 to-purple-700 text-white',
     ad: 'bg-gradient-to-br from-green-500 to-green-700 text-white',
   };
   ```

3. **Add inner shadows and borders**
   ```tsx
   className="shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-2 border-white/20"
   ```

4. **Implement responsive sizing**
   - Desktop: 120x120px
   - Tablet: 100x100px
   - Mobile: 80x80px

### Phase 4: Character Sheet Redesign (4-5 hours)

**Tasks:**

1. **Create character header component**
   - Portrait (circular or ornate frame)
   - Name (huge, title font)
   - Ancestry and level badges
   - Action buttons (Home, Export, Print)

2. **Implement multi-column layout**
   ```tsx
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     {/* Left Column: Stats */}
     <div className="lg:col-span-1">
       <StatSection />
     </div>

     {/* Middle Column: Attributes & Equipment */}
     <div className="lg:col-span-1">
       <AttributeSection />
       <EquipmentSection />
     </div>

     {/* Right Column: Features & Skills */}
     <div className="lg:col-span-1">
       <FeaturesSection />
       <SkillsSection />
     </div>
   </div>
   ```

3. **Create section card component**
   ```tsx
   const SectionCard = ({ title, children, icon, collapsible = false }) => (
     <div className="bg-parchment rounded-ornate border-2 border-brown-medium p-4 shadow-parchment-lg">
       <div className="flex items-center justify-between mb-3">
         <h2 className="font-title text-xl flex items-center gap-2">
           {icon && <span className="text-2xl">{icon}</span>}
           {title}
         </h2>
         {collapsible && <button>▼</button>}
       </div>
       {children}
     </div>
   );
   ```

4. **Redesign attribute display**
   ```tsx
   <div className="space-y-2">
     {attributes.map(attr => (
       <div className="flex items-center justify-between bg-parchment-light p-2 rounded">
         <div className="flex items-center gap-2">
           <span className="text-xl">{attr.icon}</span>
           <span className="font-body font-semibold">{attr.name}</span>
         </div>
         <span className={`font-title text-xl ${attr.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
           {attr.value >= 0 ? '+' : ''}{attr.value}
         </span>
       </div>
     ))}
   </div>
   ```

5. **Create equipment card component**
   ```tsx
   <div className="flex items-start gap-3 p-3 bg-parchment-light rounded-lg">
     <img src={weaponIcon} className="w-12 h-12" />
     <div className="flex-1">
       <h4 className="font-title font-semibold">Shortsword</h4>
       <p className="text-sm text-brown-medium">1H, 2 S damage, Parry</p>
     </div>
   </div>
   ```

### Phase 5: Actions & Reactions Cards (2-3 hours)

**Tasks:**

1. **Create ActionCard component**
   ```tsx
   interface ActionCardProps {
     name: string;
     apCost: number;
     description: string;
     type: 'action' | 'reaction';
     icon?: string;
     properties?: string[];
     expanded?: boolean;
   }
   ```

2. **Implement compact card design**
   - Icon + Name + AP badge in header
   - Collapsible description
   - Properties in footer
   - Color-coded by type

3. **Add expansion/collapse functionality**
   - Click to toggle
   - Smooth height transition
   - Full details when expanded

### Phase 6: Progressive Enhancement (3-4 hours)

**Tasks:**

1. **Add ornate dividers between sections**
   - SVG ornamental divider component
   - Center icon (sword, gem, dragon)
   - Gradient fade on edges

2. **Implement corner ornaments on cards**
   - SVG corner decorations
   - Absolute positioned
   - Subtle, not overwhelming

3. **Add parchment texture to background**
   - Tileable texture image
   - Low opacity overlay
   - Performance optimized

4. **Enhance button styles**
   - Embossed appearance
   - Ornate borders
   - Inner glow on hover

5. **Add entrance animations**
   - Stagger card reveals
   - Fade-in + slide-up
   - 50ms delay between items

### Phase 7: Mobile Optimization (2-3 hours)

**Tasks:**

1. **Responsive stat grid**
   - 3 cols on desktop
   - 2 cols on mobile
   - Smaller sizes

2. **Collapsible sections on mobile**
   - All sections start collapsed
   - Tap to expand
   - Smooth accordion animation

3. **Simplified cards on mobile**
   - Smaller images
   - Less padding
   - Stacked buttons

4. **Touch-friendly hit areas**
   - Minimum 44px tap targets
   - Increased padding on interactive elements

---

## Asset Sourcing Recommendations

### Free Resources (Recommended Starting Point)

**Icons:**
- **Game-icons.net** - 4000+ free fantasy game icons (best for weapons, stats, abilities)
- **Noun Project** - Simple icons (free with attribution)
- **Font Awesome Free** - Basic icons

**Character Art:**
- **Artbreeder** - Generate character portraits (free tier available)
- **This Person Does Not Exist** - Face generator (can edit with medieval clothes)
- **Pixabay / Pexels** - Free stock photos (search "medieval" "fantasy")
- **Public Domain Images** - Old book illustrations

**Textures:**
- **TextureKing.com** - Free paper/parchment textures
- **Subtle Patterns** - Tileable background patterns
- **CC0 Textures** - Free PBR textures

### AI Generation (Fast & Customizable)

**Recommended Prompts for Midjourney/DALL-E:**

```
Human Ancestry:
"fantasy character portrait, human warrior, leather armor,
medieval setting, D&D style, digital art, front facing,
warm lighting, painterly style"

Elf Ancestry:
"fantasy elf character portrait, ranger, forest background,
pointed ears, D&D style, digital art, front facing"

Dwarf Ancestry:
"fantasy dwarf character portrait, blacksmith, braided beard,
D&D style, digital art, front facing, stone background"

Martial Icon:
"crossed swords icon, simple, flat design, fantasy game,
gold and silver, transparent background"

Caster Icon:
"magic spell book icon, glowing, simple, flat design,
fantasy game, purple and blue, transparent background"
```

### Commercial Options (High Quality)

**If you have budget:**
- **Shutterstock** - High-quality stock art ($29/month)
- **Envato Elements** - Unlimited downloads ($16.50/month)
- **Fiverr** - Commission custom icons ($5-50 per icon)
- **Upwork** - Commission full art set ($100-500)

---

## Priority Asset List

**You should start by providing these 10 assets:**

### Must Have (Start Here)
1. ✅ **Human portrait** (ancestry)
2. ✅ **Elf portrait** (ancestry)
3. ✅ **Dwarf portrait** (ancestry)
4. ✅ **Martial icon** (class)
5. ✅ **Caster icon** (class)

### High Priority (Week 1)
6. ✅ **Shortsword icon** (weapon)
7. ✅ **Shortbow icon** (weapon)
8. ✅ **Parchment texture** (background)

### Medium Priority (Week 2)
9. ✅ **Archetype images** (4 total: smart, quick, tough, charming)
10. ✅ **Ornate border SVG** (decorative)

With just the first 8 assets, we can dramatically improve the visual quality of the app!

---

## Implementation Timeline

**Assuming you provide assets in batches:**

### Week 1: Core Visual Upgrade (10-12 hours)
- Day 1-2: You provide 5 core assets (3 ancestries, 2 classes)
- Day 2-3: I integrate assets + redesign ChoiceCard (4 hrs)
- Day 4: Redesign StatBox with shapes (3 hrs)
- Day 5: Character sheet header + portraits (3 hrs)

### Week 2: Layout & Components (12-15 hours)
- Day 1: You provide weapon icons + textures
- Day 2-3: Character sheet multi-column redesign (5 hrs)
- Day 4: Action/reaction cards (3 hrs)
- Day 5: Attribute section redesign (2 hrs)
- Day 6: Equipment section redesign (2 hrs)
- Day 7: Mobile responsive fixes (3 hrs)

### Week 3: Polish & Enhancement (8-10 hours)
- Day 1: You provide decorative elements
- Day 2: Ornate dividers + decorations (3 hrs)
- Day 3: Button enhancements (2 hrs)
- Day 4: Animations + transitions (2 hrs)
- Day 5: Final testing + refinement (3 hrs)

**Total Time:** 30-37 hours of development
**Your Time:** 5-8 hours of asset sourcing

---

## Alternative: Rapid Prototype Approach

**Don't have time to source perfect assets?**

I can create a rapid prototype using:
- **Placeholder gradients** instead of portraits (colorful, abstract)
- **Game-icons.net** for all icons (free, immediate)
- **CSS gradients** for textures (no images needed)
- **Pure CSS** ornate borders (no SVGs)

This lets us build the **structure and layout** now, then **swap in real assets** later without code changes.

**Prototype timeline:** 15-20 hours (no waiting on assets)

---

## Success Metrics

We'll know we've succeeded when:

1. ✅ Every choice page has visual imagery
2. ✅ Stat boxes have distinct shapes and colors
3. ✅ Character sheet uses multi-column layout
4. ✅ No "placeholder" or broken images
5. ✅ Every interactive element has clear hover state
6. ✅ Mobile layout is compact but readable
7. ✅ App feels intentional, not generic
8. ✅ Users can identify choices visually, not just by reading
9. ✅ Information density matches reference apps
10. ✅ Overall aesthetic evokes "fantasy tabletop RPG"

---

## Next Steps

**Choose your approach:**

### Option A: Full Asset Approach (Highest Quality)
1. **You:** Spend 1-2 days sourcing/creating assets from recommendations above
2. **Me:** Implement Phase 1-7 over ~3 weeks (30-37 hrs)
3. **Result:** Professional-quality app matching reference screenshots

### Option B: Rapid Prototype Approach (Fastest)
1. **Me:** Build entire UI structure using placeholders + game-icons.net (15-20 hrs)
2. **You:** Review prototype, decide which assets to improve
3. **You:** Gradually replace placeholders with real assets
4. **Result:** Functional, attractive UI immediately, improves over time

### Option C: Hybrid Approach (Recommended)
1. **You:** Provide just 5 core assets (3 ancestry portraits + 2 class icons) - 2-4 hours
2. **Me:** Implement Phases 1-4 with those assets, use free icons for rest (15 hrs)
3. **Result:** 80% visual quality with minimal asset sourcing time
4. **Later:** Add remaining assets as time permits

---

## My Recommendation

**Start with Option C (Hybrid):**

1. **Today:** You use AI generation (Midjourney/DALL-E) to create 3 ancestry portraits (1-2 hours)
2. **Today:** You download 2 class icons from game-icons.net (15 minutes)
3. **Tomorrow:** I implement new ChoiceCard + StatBox with your assets (6-8 hours)
4. **This Weekend:** I redesign character sheet layout (6 hours)
5. **Next Week:** You source remaining assets, I integrate + polish

**This gives you visible results in 2-3 days while keeping scope manageable.**

---

## Questions for You

Before I start, please answer:

1. **What's your preferred approach?** (A, B, or C above)
2. **Do you have access to AI image generation?** (Midjourney, DALL-E, Stable Diffusion)
3. **What's your timeline?** (Need it done this week? This month? Whenever?)
4. **Budget for assets?** ($0, under $50, under $200, flexible)
5. **Art style preference?** (Realistic, illustrated, cartoon, pixel art, other)

Let me know and I'll tailor the plan to your constraints!
