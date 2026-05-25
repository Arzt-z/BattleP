import "./App.css";
import { useState } from "react";
import { createHuman, createGoblin } from "./utils/Units";
import { equipItem, addToInventory } from "./utils/units";
import { IronSword, LeatherChest } from "./utils/items";
import { recalculate } from "./utils/Units";


function App() {
  const [player, setPlayer] = useState(createHuman("Hero", 10));
  const [enemy, setEnemy] = useState(createGoblin("Grak", 5));

  return (
    <div className="game-layout">

      {/* PLAYER - LEFT */}
      <aside className="stats-panel">
        <h2>{player.name}</h2>
        <p>Level {player.level}</p>

        <div className="bar-label">HP</div>
        <div className="bar-track">
          <div className="bar-fill hp" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} />
        </div>
        <p>{player.hp.toFixed(0)} / {player.maxHp.toFixed(0)}</p>

        <div className="bar-label">Stamina</div>
        <div className="bar-track">
          <div className="bar-fill mp" style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }} />
        </div>
        <p>{player.stamina.toFixed(0)} / {player.maxStamina.toFixed(0)}</p>

        <h3>Stats</h3>
        <p>VIT: {player.stats.Vitality.toFixed(1)}</p>
        <p>STR: {player.stats.strength.toFixed(1)}</p>
        <p>AGI: {player.stats.agility.toFixed(1)}</p>
        <p>DEX: {player.stats.dextery.toFixed(1)}</p>
        <p>INT: {player.stats.intelligence.toFixed(1)}</p>

        <p>Gold: {player.gold}</p>
        <p>EXP: {player.experience} / {player.expToNextLevel}</p>
      </aside>





      {/* MIDDLE */}
      <main className="main-content">
        {/* rest of your game here */}
      </main>





      {/* ENEMY - RIGHT */}
      <aside className="stats-panel enemy-panel">
        <h2>{enemy.name}</h2>
        <p>Level {enemy.level}</p>

        <div className="bar-label">HP</div>
        <div className="bar-track">
          <div className="bar-fill hp" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
        </div>
        <p>{enemy.hp.toFixed(0)} / {enemy.maxHp.toFixed(0)}</p>

        <div className="bar-label">Stamina</div>
        <div className="bar-track">
          <div className="bar-fill mp" style={{ width: `${(enemy.stamina / enemy.maxStamina) * 100}%` }} />
        </div>
        <p>{enemy.stamina.toFixed(0)} / {enemy.maxStamina.toFixed(0)}</p>

        <h3>Stats</h3>
        <p>VIT: {enemy.stats.Vitality.toFixed(1)}</p>
        <p>STR: {enemy.stats.strength.toFixed(1)}</p>
        <p>AGI: {enemy.stats.agility.toFixed(1)}</p>
        <p>DEX: {enemy.stats.dextery.toFixed(1)}</p>
        <p>INT: {enemy.stats.intelligence.toFixed(1)}</p>
      </aside>

    </div>
  );
}

export default App;