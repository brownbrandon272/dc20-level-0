# DC20 Novice Character Creator

A responsive, TypeScript-powered web application for creating DC20 TTRPG characters from Novice (Level -1) to Level 0. Perfect for one-shot sessions and new players!

## Features

- **Two Creation Modes**
  - **Streamlined**: Quick character creation with pre-selected options (ideal for new players)
  - **Customizable**: Full control over all character options (for experienced players)

- **Progressive Leveling**: Experience character growth through three stages:
  - Novice (Level -1)
  - Pre-Adventurer (Level -0.5)
  - Level 0

- **Interactive Character Sheet**: Two-tab view displaying:
  - Core stats (HP, PD, MD, AD, Speed, AP)
  - Available actions and reactions
  - Equipment and resources

- **Persistent State**: All progress is saved to browser localStorage - close and return anytime

- **Responsive Design**: Fully functional on desktop and mobile devices

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

This is a **static site** (no server required) and can be deployed to:
- **Digital Ocean App Platform** (recommended) - [See deployment guide](docs/deployment-guide.md)
- **Netlify** - Drag and drop the `dist/` folder
- **Vercel** - Import GitHub repository
- **GitHub Pages** - Enable in repository settings

**Quick Deploy to Digital Ocean**:
1. Update `.do/app.yaml` with your GitHub username
2. Push to GitHub
3. Create app on Digital Ocean App Platform
4. Select "Static Site" as component type
5. Deploy!

For detailed instructions, see [docs/deployment-guide.md](docs/deployment-guide.md)

## User Flow

1. **Landing Page**: Choose to create a character or return to an existing one
2. **Creation Mode**: Select Streamlined or Customizable
3. **Character Name**: Enter your character's name
4. **Novice Stage**:
   - Choose ancestry (Human, Elf, Dwarf)
   - Select starting weapon
5. **Pre-Adventurer Stage**:
   - Streamlined: Choose archetype (Smart, Quick, Tough, Charming)
   - Customizable: Allocate attributes, skills, and languages
6. **Level 0 Stage**:
   - Choose class type (Martial or Caster)
   - Martial: Select maneuvers and equipment
   - Caster: Choose spell list (Lightning, Psychic, Holy)
   - Select Level 0 ancestry features
7. **Character Sheet**: View completed character with all stats and abilities

## Project Structure

```
dc20-level-0/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Footer.jsx     # Back/Return buttons
│   │   ├── ChoiceCard.jsx # Selection card component
│   │   ├── StatBox.jsx    # Character stat display
│   │   └── LocalStorageModal.jsx  # Resume character modal
│   ├── pages/            # Route pages
│   │   ├── LandingPage.jsx
│   │   ├── ModePage.jsx
│   │   ├── NamePage.jsx
│   │   ├── NoviceAncestryPage.jsx
│   │   ├── NoviceWeaponPage.jsx
│   │   ├── CharacterSheetPage.jsx
│   │   ├── PreAdventurerPage.jsx
│   │   ├── PreAdventurerSkillsPage.jsx
│   │   ├── Level0Page.jsx
│   │   ├── Level0MartialPage.jsx
│   │   ├── Level0CasterPage.jsx
│   │   └── Level0AncestryPage.jsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # All interfaces and types
│   ├── context/          # State management
│   │   └── characterStore.ts  # Zustand store with localStorage persistence
│   ├── utils/            # Utility functions
│   │   └── calculateStats.ts  # Character stat calculations
│   ├── data/             # Static game data (JSON with TypeScript types)
│   │   ├── weapons.json
│   │   ├── ancestries.json
│   │   ├── spells.json
│   │   ├── maneuvers.json
│   │   └── other.json
│   ├── styles/           # Global styles
│   │   └── index.css
│   ├── App.tsx           # Main app with routing
│   └── main.tsx          # App entry point
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Tech Stack

- **React 19** - UI library
- **TypeScript 5.7** - Type-safe JavaScript
- **React Router 7** - Client-side routing
- **Zustand 5** - State management with localStorage persistence
- **Vite 6** - Build tool and dev server
- **CSS3** - Styling with CSS custom properties

## Key Features Explained

### State Management

Uses Zustand with persistence middleware to automatically save character data to localStorage. All character creation progress is preserved across browser sessions.

### Type Safety

The entire codebase is written in TypeScript with comprehensive type definitions in `src/types/index.ts`. This provides:
- Full type checking at compile time
- IntelliSense support in your IDE
- Safer refactoring
- Self-documenting code

### Stat Calculation

The `calculateStats.ts` utility handles:
- Novice base stats (Level -1)
- Attribute-based calculations for Pre-Adventurer and Level 0
- Defense calculations (PD, MD, AD)
- Resource calculations (HP, Stamina, Mana)
- Ancestry feature bonuses

### Dual Creation Modes

**Streamlined Mode:**
- Limited weapon choices (4 options)
- Archetype-based attribute allocation
- Auto-selected skills and languages
- Pre-themed maneuvers for martial characters

**Customizable Mode:**
- All weapons available
- Manual attribute allocation (standard array: 3, 1, 0, -2)
- Full skill and language selection
- Complete maneuver customization

## Data Structure

Character data stored in localStorage:

```javascript
{
  name: "Character Name",
  creationMode: "streamlined" | "customizable",
  level: "Novice" | "PreAdventurer" | "Level0",
  lastStep: "/path/to/last/page",
  ancestry: { id, level0Choices[] },
  attributes: { might, agility, charisma, intelligence },
  skills: { skillName: points },
  languages: { language: proficiency },
  inventory: { weapon, armor, shield, additionalWeapon },
  classType: "Martial" | "Caster" | null,
  chosenManeuvers: [],
  chosenSpellList: null,
  calculatedStats: { hp, pd, md, ad, speed, etc. }
}
```

## Navigation

- **Home Button**: Returns to landing page (in header)
- **Back Button**: Browser back navigation (in footer)
- **Return Button**: Jump back to last saved progress (in footer)

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Export character to PDF
- Print-friendly character sheet
- Share character via URL
- DM tools for managing multiple characters
- Character leveling beyond Level 0
- Custom ancestry/class creation

## License

MIT License - See LICENSE file for details

## Contributing

This is a demonstration project. Feel free to fork and customize for your own DC20 campaigns!

## Acknowledgments

Built for the DC20 TTRPG system. Character creation rules are simplified for one-shot gameplay.
