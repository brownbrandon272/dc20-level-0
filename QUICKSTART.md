# Quick Start Guide

## Getting Started in 2 Minutes

### 1. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Create Your First Character

#### Option A: Streamlined Mode (Fast - 2 minutes)

1. Click "Create a Character"
2. Select "Streamlined" mode
3. Enter a character name (e.g., "Aragorn")
4. Choose an ancestry (e.g., "Human")
5. Pick a weapon (e.g., "Longsword")
6. View your Novice character sheet
7. Click "Level Up to Pre-Adventurer"
8. Choose an archetype (e.g., "Tough" for a warrior)
9. View updated character sheet
10. Click "Level Up to Level 0"
11. Choose "Martial" class
12. Select Level 0 ancestry features
13. Done! Your character is ready to play

#### Option B: Customizable Mode (Detailed - 5-10 minutes)

1. Click "Create a Character"
2. Select "Customizable" mode
3. Enter a character name
4. Choose an ancestry (you'll get more options at Level 0)
5. Pick any weapon from the full list
6. View your Novice character sheet
7. Click "Level Up to Pre-Adventurer"
8. Click "Continue to Attribute & Skill Setup"
9. Assign attribute array (3, 1, 0, -2) to Might, Agility, Charisma, Intelligence
10. Allocate skill points (5 + INT modifier)
11. Choose 2 languages
12. Click "Continue"
13. View updated character sheet
14. Click "Level Up to Level 0"
15. Choose "Martial" or "Caster"
16. For Martial: Choose shield or additional weapon, select 3 maneuvers
17. For Caster: Choose a spell list (Lightning, Psychic, or Holy)
18. Select Level 0 ancestry features
19. Done! Your character is complete

## Character Sheet Overview

### Tab 1: Character Sheet
- **HP** (Heart icon): Hit Points - your health
- **PD** (Shield icon): Physical Defense - armor against attacks
- **MD**: Mental Defense - resistance to mental effects
- **AD**: Agility Defense - dodge and reflexes
- **Speed**: Movement in spaces per turn
- **AP**: Action Points - actions you can take per turn

### Tab 2: Actions & Reactions
- **Actions**: What you can do on your turn (Move, Attack, etc.)
- **Reactions**: Responses to enemy actions (Opportunity Attack, Parry, etc.)
- **Spells** (Casters only): Available spells with mana costs
- **Maneuvers** (Martials only): Combat techniques with stamina costs

## Tips

### For New Players (Use Streamlined Mode)
- Archetypes:
  - **Smart**: High Intelligence, good for casters
  - **Quick**: High Agility, good for rogues/rangers
  - **Tough**: High Might, good for warriors
  - **Charming**: High Charisma, good for leaders/bards

### For Experienced Players (Use Customizable Mode)
- Standard attribute array: 3, 1, 0, -2
- Skills cost 1 point each (can allocate up to 3 points per skill)
- You get 5 skill points + INT modifier
- Languages: Choose 2 additional (Common is automatic)
- Maneuvers: Pick 3 that complement your playstyle

### Character Persistence
- Your progress is automatically saved
- Close the browser and come back anytime
- Use "Return to [Character Name]" to resume
- Create new character by choosing "No" in the modal

## Common Questions

**Q: Can I change my choices?**
A: Use the Back button to go back, but this may reset later choices. For major changes, create a new character.

**Q: What if I close the browser?**
A: No problem! Your character is saved. Return to continue where you left off.

**Q: Can I create multiple characters?**
A: Currently, one character per browser. Clear localStorage or use a different browser for multiple characters.

**Q: What's the difference between Stamina and Mana?**
A: Stamina is used by Martial characters for maneuvers. Mana is used by Casters for spells.

**Q: Can I print my character sheet?**
A: Use your browser's print function (Ctrl+P / Cmd+P). Future versions will have a print-friendly format.

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Next Steps

1. Complete character creation
2. Test the character in a one-shot session
3. Provide feedback or report issues
4. Customize the data files for your own campaign

Enjoy creating your DC20 characters!
