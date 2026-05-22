import { useState, useEffect, useRef } from "react";

const PLAYER = {
  name: "Aldric",
  hp: 800, maxHp: 800,
  atk: 70, def: 50, sta: 500, maxSta: 500,
};

const ENEMY = {
  name: "Orco Feral",
  hp: 500, maxHp: 500,
  atk: 90, def: 30, sta: 300, maxSta: 300,
};

function calcMitigation(def) {
  return def / (def + 100);
}

function calcDamage(atk, def, modifier = 1.0) {
  const rng = 0.85 + Math.random() * 0.15;
  const mit = calcMitigation(def);
  const raw = atk * modifier * rng;
  const final = Math.round(raw * (1 - mit));
  const minDamage = Math.round(atk * 0.05);
  return Math.max(final, minDamage);
}

export default function App() {
  const [player, setPlayer] = useState({ ...PLAYER });
  const [enemy, setEnemy] = useState({ ...ENEMY });
  const [log, setLog] = useState([]);
  const [round, setRound] = useState(1);
  const [fatigue, setFatigue] = useState(0);
  const [phase, setPhase] = useState("player"); // player | enemy | result
  const [qteActive, setQteActive] = useState(false);
  const [qteTimer, setQteTimer] = useState(3);
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const timerRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  function addLog(entry) {
    setLog(prev => [...prev, entry]);
  }

  function startRound() {
    if (result) return;
    const fatiguePenalty = 1 - (fatigue * 0.005);
    const staDelta = player.sta - enemy.sta;
    const playerFirst = staDelta >= 0;

    setGenerating(true);
    setQteActive(false);

    if (playerFirst) {
      addLog({ type: "info", text: `— Ronda ${round} — (Tienes prioridad)` });
      setTimeout(() => playerAttackAuto(fatiguePenalty), 800);
    } else {
      addLog({ type: "info", text: `— Ronda ${round} — (Orco tiene prioridad)` });
      startEnemyQTE(fatiguePenalty);
    }
  }

  function playerAttackAuto(fatiguePenalty = 1) {
    const dmg = Math.round(calcDamage(player.atk, enemy.def) * fatiguePenalty);
    addLog({ type: "player", text: `Aldric ataca — ATK(${player.atk}) × RNG × DEF_mit = ${dmg} daño` });

    setEnemy(prev => {
      const newHp = prev.hp - dmg;
      if (newHp <= 0) {
        setResult("win");
        setGenerating(false);
        return { ...prev, hp: 0 };
      }
      setTimeout(() => startEnemyQTE(fatiguePenalty), 1000);
      return { ...prev, hp: newHp };
    });
  }

  function startEnemyQTE(fatiguePenalty = 1) {
    const staDelta = player.sta - enemy.sta;
    const timeLimit = staDelta >= 100 ? 4 : staDelta >= 0 ? 3 : 1.5;

    addLog({ type: "enemy", text: `${enemy.name} carga su ataque... [${timeLimit}s para reaccionar]` });
    setPhase("enemy");
    setQteActive(true);
    setQteTimer(timeLimit);

    let t = timeLimit;
    timerRef.current = setInterval(() => {
      t -= 0.1;
      setQteTimer(Math.max(t, 0));
      if (t <= 0) {
        clearInterval(timerRef.current);
        resolveEnemyAttack(1.0, fatiguePenalty); // sin defensa
      }
    }, 100);
  }

  function resolveEnemyAttack(defModifier = 1.0, fatiguePenalty = 1) {
    clearInterval(timerRef.current);
    setQteActive(false);
    setPhase("player");

    const baseDmg = calcDamage(enemy.atk, player.def) * fatiguePenalty;
    const finalDmg = Math.round(baseDmg * defModifier);

    const logText = defModifier < 1
      ? `Esquivas — daño reducido a ${finalDmg}`
      : `Recibes el golpe completo — ${finalDmg} daño`;

    addLog({ type: defModifier < 1 ? "defend" : "hit", text: logText });

    setPlayer(prev => {
      const newHp = prev.hp - finalDmg;
      if (newHp <= 0) {
        setResult("lose");
        setGenerating(false);
        return { ...prev, hp: 0 };
      }
      return { ...prev, hp: newHp };
    });

    setRound(prev => prev + 1);
    setFatigue(prev => prev + 1);
    setGenerating(false);
  }

  function handleDodge() {
    if (!qteActive) return;
    const cost = 60;
    if (player.sta < cost) {
      addLog({ type: "info", text: "Sin estamina para esquivar" });
      return;
    }
    setPlayer(prev => ({ ...prev, sta: prev.sta - cost }));
    resolveEnemyAttack(0.2);
  }

  function handleHeavyAttack() {
    if (phase !== "player" || generating) return;
    const cost = 80;
    if (player.sta < cost) {
      addLog({ type: "info", text: "Sin estamina para Golpe Fuerte" });
      return;
    }
    const success = Math.random() < (player.sta / player.maxSta);
    setPlayer(prev => ({ ...prev, sta: prev.sta - cost }));

    if (success) {
      addLog({ type: "player", text: "Golpe Fuerte — éxito, multiplicador ×1.2" });
      const dmg = Math.round(calcDamage(player.atk, enemy.def, 1.2));
      addLog({ type: "player", text: `Daño final: ${dmg}` });
      setEnemy(prev => {
        const newHp = prev.hp - dmg;
        if (newHp <= 0) { setResult("win"); return { ...prev, hp: 0 }; }
        return { ...prev, hp: newHp };
      });
    } else {
      addLog({ type: "hit", text: "Golpe Fuerte — fallo, próximo ataque -20%" });
    }
    setRound(prev => prev + 1);
    setFatigue(prev => prev + 1);
  }

  function handleConcentrate() {
    if (phase !== "player" || generating) return;
    const recover = Math.round(player.maxSta * 0.4);
    const minDmg = Math.round(enemy.atk * 0.05);
    addLog({ type: "info", text: `Concentración — recuperas ${recover} STA, recibes ${minDmg} daño físico mínimo` });
    setPlayer(prev => ({
      ...prev,
      sta: Math.min(prev.maxSta, prev.sta + recover),
      hp: prev.hp - minDmg,
    }));
    setRound(prev => prev + 1);
    setFatigue(prev => prev + 1);
  }

  function handleFlee() {
    const chance = player.sta / player.maxSta;
    if (Math.random() < chance) {
      addLog({ type: "info", text: "Huiste del combate." });
      setResult("flee");
    } else {
      addLog({ type: "hit", text: "Fallo al huir — el orco ataca gratis" });
      resolveEnemyAttack(1.0);
    }
  }

  function resetGame() {
    setPlayer({ ...PLAYER });
    setEnemy({ ...ENEMY });
    setLog([]);
    setRound(1);
    setFatigue(0);
    setPhase("player");
    setQteActive(false);
    setQteTimer(3);
    setResult(null);
    setGenerating(false);
    clearInterval(timerRef.current);
  }

  const playerHpPct = (player.hp / player.maxHp) * 100;
  const enemyHpPct = (enemy.hp / enemy.maxHp) * 100;
  const playerStaPct = (player.sta / player.maxSta) * 100;
  const fatiguePct = Math.min((fatigue / 20) * 100, 100);

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#e0e0e0", fontFamily: "monospace", padding: "20px", maxWidth: "700px", margin: "0 auto" }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#c9a84c", margin: 0, fontSize: "1.4rem" }}>⚔️ COMBATE</h1>
        <span style={{ color: "#666", fontSize: "0.8rem" }}>Ronda {round} | Fatiga {fatigue} ({fatiguePct.toFixed(0)}%)</span>
      </div>

      {/* BARRAS DE VIDA */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#4fc3f7" }}>🧍 {player.name}</span>
            <span>{player.hp}/{player.maxHp} HP</span>
          </div>
          <div style={{ background: "#333", height: "12px", borderRadius: "4px" }}>
            <div style={{ background: "#4fc3f7", width: `${playerHpPct}%`, height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ color: "#aaa", fontSize: "0.75rem" }}>STA {player.sta}/{player.maxSta}</span>
          </div>
          <div style={{ background: "#333", height: "6px", borderRadius: "4px" }}>
            <div style={{ background: "#f9a825", width: `${playerStaPct}%`, height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#ef5350" }}>👹 {enemy.name}</span>
            <span>{enemy.hp}/{enemy.maxHp} HP</span>
          </div>
          <div style={{ background: "#333", height: "12px", borderRadius: "4px" }}>
            <div style={{ background: "#ef5350", width: `${enemyHpPct}%`, height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* QTE TIMER */}
      {qteActive && (
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <div style={{ color: "#ff7043", fontWeight: "bold", marginBottom: "4px" }}>⚡ REACCIONA — {qteTimer.toFixed(1)}s</div>
          <div style={{ background: "#333", height: "10px", borderRadius: "4px" }}>
            <div style={{ background: "#ff7043", width: `${(qteTimer / 3) * 100}%`, height: "100%", borderRadius: "4px", transition: "width 0.1s linear" }} />
          </div>
        </div>
      )}

      {/* LOG */}
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "12px", height: "220px", overflowY: "auto", marginBottom: "16px", fontSize: "0.85rem" }}>
        {log.length === 0 && <span style={{ color: "#555" }}>Presiona ATACAR para comenzar...</span>}
        {log.map((entry, i) => (
          <div key={i} style={{ marginBottom: "4px", color: entry.type === "player" ? "#4fc3f7" : entry.type === "enemy" ? "#ef5350" : entry.type === "hit" ? "#ff7043" : entry.type === "defend" ? "#66bb6a" : "#aaa" }}>
            {entry.text}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* BOTONES */}
      {!result && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <button onClick={startRound} disabled={generating} style={btnStyle("#c9a84c", generating)}>
            ⚔️ Atacar
          </button>
          <button onClick={handleHeavyAttack} disabled={generating || qteActive} style={btnStyle("#e53935", generating || qteActive)}>
            💥 Golpe Fuerte (-80 STA)
          </button>
          <button onClick={handleDodge} disabled={!qteActive} style={btnStyle("#66bb6a", !qteActive)}>
            🛡️ Esquivar (-60 STA)
          </button>
          <button onClick={handleConcentrate} disabled={generating || qteActive} style={btnStyle("#7e57c2", generating || qteActive)}>
            🎯 Concentrar (+STA)
          </button>
          <button onClick={handleFlee} disabled={generating} style={{ ...btnStyle("#888", generating), gridColumn: "span 2" }}>
            💨 Huir
          </button>
        </div>
      )}

      {/* RESULTADO */}
      {result && (
        <div style={{ textAlign: "center", padding: "20px", background: "#1a1a1a", borderRadius: "8px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
            {result === "win" ? "🏆 VICTORIA" : result === "lose" ? "💀 DERROTA" : "🏃 HUISTE"}
          </div>
          <div style={{ color: "#aaa", marginBottom: "16px", fontSize: "0.85rem" }}>
            Rondas: {round} | Fatiga acumulada: {fatigue}
          </div>
          <button onClick={resetGame} style={btnStyle("#c9a84c", false)}>
            🔄 Reintentar
          </button>
        </div>
      )}
    </div>
  );
}

function btnStyle(color, disabled) {
  return {
    background: disabled ? "#222" : color + "22",
    border: `1px solid ${disabled ? "#333" : color}`,
    color: disabled ? "#444" : color,
    padding: "12px",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    fontWeight: "bold",
  };
}