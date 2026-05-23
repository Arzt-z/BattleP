export function createItem(name, slot, statBonus = {}, value = 0) {
  return {
    name,
    slot,       // which equipment slot it goes in
    statBonus,  // stats it adds when equipped
    value,      // gold value
  };
}

// --- ITEMS ---
export const IronSword = createItem("Iron Sword", "righthand", { strength: 5 }, 50);
export const WoodenShield = createItem("Wooden Shield", "lefthand", { defense: 3 }, 30);
export const LeatherHelmet = createItem("Leather Helmet", "head", { Vitality: 2 }, 20);
export const LeatherChest = createItem("Leather Chest", "chest", { Vitality: 4 }, 40);
export const LeatherLegs = createItem("Leather Legs", "legs", { Vitality: 2 }, 25);
export const LeatherBoots = createItem("Leather Boots", "feet", { agility: 2 }, 15);