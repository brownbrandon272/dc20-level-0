import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ModePage from './pages/ModePage';
import NamePage from './pages/NamePage';
import NoviceAncestryPage from './pages/NoviceAncestryPage';
import NoviceWeaponPage from './pages/NoviceWeaponPage';
import CharacterSheetPage from './pages/CharacterSheetPage';
import PreAdventurerPage from './pages/PreAdventurerPage';
import PreAdventurerSkillsPage from './pages/PreAdventurerSkillsPage';
import Level0Page from './pages/Level0Page';
import Level0MartialPage from './pages/Level0MartialPage';
import Level0CasterPage from './pages/Level0CasterPage';
import Level0AncestryPage from './pages/Level0AncestryPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create/mode" element={<ModePage />} />
          <Route path="/create/name" element={<NamePage />} />
          <Route path="/create/novice/ancestry" element={<NoviceAncestryPage />} />
          <Route path="/create/novice/weapon" element={<NoviceWeaponPage />} />
          <Route path="/character/sheet" element={<CharacterSheetPage />} />
          <Route path="/create/pre-adventurer" element={<PreAdventurerPage />} />
          <Route path="/create/pre-adventurer/skills" element={<PreAdventurerSkillsPage />} />
          <Route path="/create/level0" element={<Level0Page />} />
          <Route path="/create/level0/martial" element={<Level0MartialPage />} />
          <Route path="/create/level0/caster" element={<Level0CasterPage />} />
          <Route path="/create/level0/ancestry" element={<Level0AncestryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
