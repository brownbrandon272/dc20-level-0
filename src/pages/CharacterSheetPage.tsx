import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../context/characterStore';
import StatBox from '../components/StatBox';
import ancestriesData from '../data/ancestries.json';
import maneuversData from '../data/maneuvers.json';
import spellsData from '../data/spells.json';
import otherData from '../data/other.json';

function CharacterSheetPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sheet');
  const character = useCharacterStore((state) => state.character);
  const setLastStep = useCharacterStore((state) => state.setLastStep);

  const ancestry = ancestriesData[character.ancestry.id];
  const stats = character.calculatedStats;

  const handleLevelUp = () => {
    if (character.level === 'Novice') {
      setLastStep('/character/sheet');
      navigate('/create/pre-adventurer');
    } else if (character.level === 'PreAdventurer') {
      setLastStep('/character/sheet');
      navigate('/create/level0');
    }
  };

  const showLevelUpButton = character.level !== 'Level0';

  // Get available actions based on level
  const getAvailableActions = () => {
    const actions = [...otherData.baseActions];

    if (character.level === 'Level0') {
      if (character.classType === 'Martial') {
        const selectedManeuvers = maneuversData.filter(m =>
          m.autoSelected || character.chosenManeuvers.includes(m.id)
        );
        actions.push(...selectedManeuvers.filter(m => m.type === 'action'));
      } else if (character.classType === 'Caster' && character.chosenSpellList) {
        const spellList = spellsData[character.chosenSpellList];
        if (spellList && spellList.spells) {
          actions.push(...spellList.spells);
        }
      }
    }

    return actions;
  };

  const getAvailableReactions = () => {
    const reactions = [...otherData.baseReactions];

    if (character.level === 'Level0' && character.classType === 'Martial') {
      const selectedManeuvers = maneuversData.filter(m =>
        m.autoSelected || character.chosenManeuvers.includes(m.id)
      );
      reactions.push(...selectedManeuvers.filter(m => m.type === 'reaction'));
    }

    return reactions;
  };

  return (
    <div className="character-sheet-page">
      <div className="sheet-header">
        <h1>{character.name}</h1>
        <p className="level-badge">
          {character.level === 'Novice' ? (
            <>Novice <span className="level-number">(Level -2)</span></>
          ) : character.level === 'PreAdventurer' ? (
            <>Pre-Adventurer <span className="level-number">(Level -1)</span></>
          ) : (
            'Level 0'
          )}
        </p>
        <p className="ancestry-label">{ancestry?.name}</p>
      </div>

      <div className="sheet-tabs">
        <button
          className={`tab-button ${activeTab === 'sheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('sheet')}
        >
          Character Sheet
        </button>
        <button
          className={`tab-button ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Actions & Reactions
        </button>
      </div>

      <div className="sheet-content">
        {activeTab === 'sheet' && (
          <div className="sheet-tab">
            <div className="stats-grid">
              <StatBox
                label="HP"
                value={`${stats.hp}/${stats.hpMax}`}
                tooltip="Hit Points: Your health"
                shape="heart"
                color="primary"
              />
              <StatBox
                label="PD"
                value={stats.pd}
                tooltip="Physical Defense: Armor class against physical attacks"
                shape="shield"
                color="primary"
              />
              <StatBox
                label="MD"
                value={stats.md}
                tooltip="Mental Defense: Resistance against mental attacks"
                shape="square"
                color="secondary"
              />
              <StatBox
                label="AD"
                value={stats.ad}
                tooltip="Agility Defense: Dodge and reflex saves"
                shape="square"
                color="secondary"
              />
              <StatBox
                label="Speed"
                value={stats.speed}
                tooltip="Movement speed in spaces per turn"
                shape="square"
                color="success"
              />
              <StatBox
                label="AP"
                value={stats.actionPoints}
                tooltip="Action Points: Points to spend on actions each turn"
                shape="square"
                color="success"
              />
            </div>

            {character.level !== 'Novice' && (
              <div className="attributes-section">
                <h2>Attributes</h2>
                <div className="attributes-grid">
                  <div className="attribute-item">
                    <span className="attribute-label">Might</span>
                    <span className="attribute-value">{character.attributes.might >= 0 ? '+' : ''}{character.attributes.might}</span>
                  </div>
                  <div className="attribute-item">
                    <span className="attribute-label">Agility</span>
                    <span className="attribute-value">{character.attributes.agility >= 0 ? '+' : ''}{character.attributes.agility}</span>
                  </div>
                  <div className="attribute-item">
                    <span className="attribute-label">Charisma</span>
                    <span className="attribute-value">{character.attributes.charisma >= 0 ? '+' : ''}{character.attributes.charisma}</span>
                  </div>
                  <div className="attribute-item">
                    <span className="attribute-label">Intelligence</span>
                    <span className="attribute-value">{character.attributes.intelligence >= 0 ? '+' : ''}{character.attributes.intelligence}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="equipment-section">
              <h2>Equipment</h2>
              <div className="equipment-list">
                {character.inventory.weapon && (
                  <div className="equipment-item">
                    <strong>Weapon:</strong> {character.inventory.weapon.name}
                    <span className="equipment-detail">
                      ({character.inventory.weapon.damage} damage, {character.inventory.weapon.hands})
                    </span>
                  </div>
                )}
                {character.inventory.armor && (
                  <div className="equipment-item">
                    <strong>Armor:</strong> {character.inventory.armor.name}
                  </div>
                )}
                {character.inventory.shield && (
                  <div className="equipment-item">
                    <strong>Shield:</strong> {character.inventory.shield.name}
                  </div>
                )}
                {character.inventory.additionalWeapon && (
                  <div className="equipment-item">
                    <strong>Additional Weapon:</strong> {character.inventory.additionalWeapon.name}
                  </div>
                )}
              </div>
            </div>

            {character.level === 'Level0' && (
              <div className="resources-section">
                <h2>Resources</h2>
                <div className="resources-grid">
                  {character.classType === 'Martial' && (
                    <div className="resource-item">
                      <span className="resource-label">Stamina</span>
                      <span className="resource-value">{stats.stamina}</span>
                    </div>
                  )}
                  {character.classType === 'Caster' && (
                    <div className="resource-item">
                      <span className="resource-label">Mana</span>
                      <span className="resource-value">{stats.mana}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-tab">
            <div className="actions-section">
              <h2>Actions</h2>
              <div className="action-list">
                {getAvailableActions().map((action, index) => (
                  <div key={action.id || index} className="action-card">
                    <div className="action-header">
                      <h3>{action.name}</h3>
                      <span className="action-cost">{action.cost}</span>
                    </div>
                    <p className="action-desc">{action.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reactions-section">
              <h2>Reactions</h2>
              <div className="action-list">
                {getAvailableReactions().map((reaction, index) => (
                  <div key={reaction.id || index} className="action-card reaction-card">
                    <div className="action-header">
                      <h3>{reaction.name}</h3>
                      <span className="action-cost">{reaction.cost}</span>
                    </div>
                    <p className="action-desc">{reaction.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showLevelUpButton && (
        <div className="level-up-section">
          <button className="btn btn-primary btn-large" onClick={handleLevelUp}>
            Level Up to {character.level === 'Novice' ? 'Pre-Adventurer' : 'Level 0'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CharacterSheetPage;
