
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// --- STAT MODIFIERS ---


export function setStat(unit, stat, value) {
  return {
    ...unit,
    stats: { ...unit.stats, [stat]: value }
  };
}

export function addStat(unit, stat, amount) {
  return {
    ...unit,
    stats: { ...unit.stats, [stat]: unit.stats[stat] + amount }
  };
}

export function setHp(unit, hp) {
  return { ...unit, hp, maxHp: hp };
}

export function setStamina(unit, stamina) {
  return { ...unit, stamina, maxStamina: stamina };
}

export function setGold(unit, gold) {
  return { ...unit, gold };
}

export function setLevel(unit, level) {
  return { ...unit, level, expToNextLevel: level * level * 100 };
}


// --- STAT MODIFIERS ---
//-- equip unequip--


// equip an item — moves it from inventory to equipment slot
export function equipItem(unit, item) {
  const currentlyEquipped = unit.equipment[item.slot];

  // put currently equipped item back in inventory if there is one
  const newInventory = currentlyEquipped
    ? [...unit.inventory.filter(i => i !== item), currentlyEquipped]
    : unit.inventory.filter(i => i !== item);

  // apply the new item's stat bonuses
  let result = { ...unit, inventory: newInventory, equipment: { ...unit.equipment, [item.slot]: item } };
  for (const [stat, bonus] of Object.entries(item.statBonus)) {
    result = addStat(result, stat, bonus);
  }

  // remove the old item's stat bonuses if there was one
  if (currentlyEquipped) {
    for (const [stat, bonus] of Object.entries(currentlyEquipped.statBonus)) {
      result = addStat(result, stat, -bonus);
    }
  }
  recalculate(result);
  return result;
}

// unequip an item — moves it back to inventory
export function unequipItem(unit, slot) {
  const item = unit.equipment[slot];
  if (!item) return unit;

  let result = { ...unit, inventory: [...unit.inventory, item], equipment: { ...unit.equipment, [slot]: null } };
  for (const [stat, bonus] of Object.entries(item.statBonus)) {
    result = addStat(result, stat, -bonus);
  }
  recalculate(result);
  return result;
}

// add item to inventory without equipping
export function addToInventory(unit, item) {
  return { ...unit, inventory: [...unit.inventory, item] };
}

// remove item from inventory
export function removeFromInventory(unit, item) {
  return { ...unit, inventory: unit.inventory.filter(i => i !== item) };
}


//--- equip unequip---
// --- units ---



export function Human(name) {
  return {
    name: name || "Human",
    type: "human",
    level: 1,
    experience: 0,
    expToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    stats: {
      Vitality: 25,
      strength: 18,
      agility: 15,
      dextery: 12,
      intelligence: 16,
    },
    statsGrowth: {
      classLVL: 8,
      VitalityGrowth: 2.0,
      strengthGrowth: 1.7,
      agilityGrowth: 1.4,
      dexteryGrowth: 1.4,
      intelligenceGrowth: 1.5,
    },
    equipment: {
      lefthand:  null,
      righthand: null,
      head:      null,
      chest:     null,
      legs:      null,
      feet:      null,
    },
    inventory: [],  // items not equipped yet

    gold: 0,
  };
}

export function Goblin(name) {
  return {
    name: name || "Goblin",
    type: "Goblin",
    level: 1,
    experience: 0,
    expToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    stats: {
      Vitality: 20,
      strength: 8,
      agility: 15,
      dextery: 12,
      intelligence: 8,
    },
    statsGrowth: {
      classLVL: 6,
      VitalityGrowth: 2,
      strengthGrowth: 0.8,
      agilityGrowth: 1.5,
      dexteryGrowth: 1.2,
      intelligenceGrowth: 0.5,
    },
    equipment: {
      lefthand:  null,
      righthand: null,
      head:      null,
      chest:     null,
      legs:      null,
      feet:      null,
    },
    inventory: [],  // items not equipped yet
    gold: 0,
  };
}

//--units--
// --- leveling up ---

export function levelUp(unit, lvl) {
  let result = { ...unit };

  for (let i = 1; i < lvl * 4; i++) {
    const g = result.statsGrowth;
    const total = g.VitalityGrowth + g.strengthGrowth + g.agilityGrowth + g.dexteryGrowth + g.intelligenceGrowth;
    const roll = Math.random() * total; // float between 0 and total

    let cursor = 0;
    if (roll < (cursor += g.VitalityGrowth))          result = addStat(result, "Vitality", 1);
    else if (roll < (cursor += g.strengthGrowth))     result = addStat(result, "strength", 1);
    else if (roll < (cursor += g.agilityGrowth))      result = addStat(result, "agility", 1);
    else if (roll < (cursor += g.dexteryGrowth))      result = addStat(result, "dextery", 1);
    else if (roll < (cursor += g.intelligenceGrowth)) result = addStat(result, "intelligence", 1);
  }

  setLevel(result, lvl);
  return recalculate(result);
}

//---


export function createHuman(name, lvl) {
  const unit = levelUp(Human(name), lvl);
  return { ...unit, hp: unit.maxHp, stamina: unit.maxStamina };
}

export function createGoblin(name, lvl) {
  const unit = levelUp(Goblin(name), lvl);
  return { ...unit, hp: unit.maxHp, stamina: unit.maxStamina };
}


// defines how stats translate to derived values
export function recalculate(unit) {
  const { Vitality, strength, agility, dextery, intelligence } = unit.stats;

  const maxHp      = Math.floor(Vitality * 10 + unit.level * 5);
  const maxStamina = Math.floor(unit.level * 2 + 100);

  // check if a weapon is equipped
  const weapon = unit.equipment?.righthand;
  const weaponAtk = weapon?.attackPower || 0;

  // base attack from stats + weapon
  const attackPower = Math.floor(strength * 1.5 + agility * 0.5 + dextery * 0.3 + weaponAtk);

  return {
    ...unit,
    maxHp,
    hp: unit.hp === null ? maxHp : Math.min(unit.hp, maxHp),
    maxStamina,
    stamina: unit.stamina === null ? maxStamina : Math.min(unit.stamina, maxStamina),
    attackPower,
  };
}