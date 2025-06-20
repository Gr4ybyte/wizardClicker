// Contains all data about buildings and upgrades

const buildings = [
  { id: 'enchantedTower', name: 'Enchanted Tower', baseCost: 10, owned: 0, production: 1, baseProduction: 1 },
  { id: 'magicFamiliar', name: 'Magic Familiar', baseCost: 100, owned: 0, production: 5, baseProduction: 5 },
  { id: 'arcaneLibrary', name: 'Arcane Library', baseCost: 500, owned: 0, production: 20, baseProduction: 20 },
  { id: 'mysticPortal', name: 'Mystic Portal', baseCost: 2000, owned: 0, production: 75, baseProduction: 75 },
  { id: 'celestialObelisk', name: 'Celestial Obelisk', baseCost: 10000, owned: 0, production: 300, baseProduction: 300 },
  { id: 'runeSanctum', name: 'Rune Sanctum', baseCost: 50000, owned: 0, production: 1500, baseProduction: 1500 },
  { id: 'manaWell', name: 'Mana Well', baseCost: 250000, owned: 0, production: 7000, baseProduction: 7000 },
  { id: 'wizardTower', name: 'Wizard Tower', baseCost: 1000000, owned: 0, production: 30000, baseProduction: 30000 },
  { id: 'phantasmGate', name: 'Phantasm Gate', baseCost: 5000000, owned: 0, production: 125000, baseProduction: 125000 },
  { id: 'eternalSpire', name: 'Eternal Spire', baseCost: 20000000, owned: 0, production: 500000, baseProduction: 500000 }
];

const upgrades = [
  { id: 'clickPower', name: 'Focus Crystal', baseCost: 5, level: 0, maxLevel: 10, effectId: 'increaseClickPower' },

  // Enchanted Tower
  { id: 'enchantedTowerUpgrade1', name: 'Sparkle Polish', baseCost: 10, level: 0, maxLevel: 1, effectId: 'boostTower_enchantedTower' },
  { id: 'enchantedTowerUpgrade2', name: 'Mana Duct Tape', baseCost: 20, level: 0, maxLevel: 1, effectId: 'boostTower_enchantedTower' },
  { id: 'enchantedTowerUpgrade3', name: 'Lightning Rod Hat', baseCost: 30, level: 0, maxLevel: 1, effectId: 'boostTower_enchantedTower' },

  // Magic Familiar
  { id: 'magicFamiliarUpgrade1', name: 'Snack Training', baseCost: 50, level: 0, maxLevel: 1, effectId: 'boostTower_magicFamiliar' },
  { id: 'magicFamiliarUpgrade2', name: 'Mystic Leash', baseCost: 75, level: 0, maxLevel: 1, effectId: 'boostTower_magicFamiliar' },
  { id: 'magicFamiliarUpgrade3', name: 'Fur Conditioner', baseCost: 100, level: 0, maxLevel: 1, effectId: 'boostTower_magicFamiliar' },

  // Arcane Library
  { id: 'arcaneLibraryUpgrade1', name: 'Librarian’s Coffee', baseCost: 125, level: 0, maxLevel: 1, effectId: 'boostTower_arcaneLibrary' },
  { id: 'arcaneLibraryUpgrade2', name: 'Scroll Organizer', baseCost: 175, level: 0, maxLevel: 1, effectId: 'boostTower_arcaneLibrary' },
  { id: 'arcaneLibraryUpgrade3', name: 'Book Levitation Charm', baseCost: 250, level: 0, maxLevel: 1, effectId: 'boostTower_arcaneLibrary' },

  // Mystic Portal
  { id: 'mysticPortalUpgrade1', name: 'Portal Polish', baseCost: 400, level: 0, maxLevel: 1, effectId: 'boostTower_mysticPortal' },
  { id: 'mysticPortalUpgrade2', name: 'Void Navigator', baseCost: 600, level: 0, maxLevel: 1, effectId: 'boostTower_mysticPortal' },
  { id: 'mysticPortalUpgrade3', name: 'Eldritch Air Freshener', baseCost: 900, level: 0, maxLevel: 1, effectId: 'boostTower_mysticPortal' },

  // Celestial Obelisk
  { id: 'celestialObeliskUpgrade1', name: 'Stargazer’s Lens', baseCost: 1200, level: 0, maxLevel: 1, effectId: 'boostTower_celestialObelisk' },
  { id: 'celestialObeliskUpgrade2', name: 'Obelisk Tuning Fork', baseCost: 1500, level: 0, maxLevel: 1, effectId: 'boostTower_celestialObelisk' },
  { id: 'celestialObeliskUpgrade3', name: 'Cosmic Wi-Fi', baseCost: 2000, level: 0, maxLevel: 1, effectId: 'boostTower_celestialObelisk' },

  // Rune Sanctum
  { id: 'runeSanctumUpgrade1', name: 'Rune Wax', baseCost: 3000, level: 0, maxLevel: 1, effectId: 'boostTower_runeSanctum' },
  { id: 'runeSanctumUpgrade2', name: 'Sigil Recharger', baseCost: 5000, level: 0, maxLevel: 1, effectId: 'boostTower_runeSanctum' },
  { id: 'runeSanctumUpgrade3', name: 'Parchment Blower', baseCost: 8000, level: 0, maxLevel: 1, effectId: 'boostTower_runeSanctum' },

  // Mana Well
  { id: 'manaWellUpgrade1', name: 'Bucket Brigade', baseCost: 10000, level: 0, maxLevel: 1, effectId: 'boostTower_manaWell' },
  { id: 'manaWellUpgrade2', name: 'Well Whisperer', baseCost: 15000, level: 0, maxLevel: 1, effectId: 'boostTower_manaWell' },
  { id: 'manaWellUpgrade3', name: 'Essence Chlorinator', baseCost: 20000, level: 0, maxLevel: 1, effectId: 'boostTower_manaWell' },

  // Wizard Tower
  { id: 'wizardTowerUpgrade1', name: 'Wizard HOA Membership', baseCost: 30000, level: 0, maxLevel: 1, effectId: 'boostTower_wizardTower' },
  { id: 'wizardTowerUpgrade2', name: 'Cloud Elevator', baseCost: 40000, level: 0, maxLevel: 1, effectId: 'boostTower_wizardTower' },
  { id: 'wizardTowerUpgrade3', name: 'Scrying Mirror WiFi', baseCost: 50000, level: 0, maxLevel: 1, effectId: 'boostTower_wizardTower' },

  // Phantasm Gate
  { id: 'phantasmGateUpgrade1', name: 'Echo Suppressant', baseCost: 75000, level: 0, maxLevel: 1, effectId: 'boostTower_phantasmGate' },
  { id: 'phantasmGateUpgrade2', name: 'Illusion Optimizer', baseCost: 100000, level: 0, maxLevel: 1, effectId: 'boostTower_phantasmGate' },
  { id: 'phantasmGateUpgrade3', name: 'Gate Grease', baseCost: 150000, level: 0, maxLevel: 1, effectId: 'boostTower_phantasmGate' },

  // Eternal Spire
  { id: 'eternalSpireUpgrade1', name: 'Clockstopper Charm', baseCost: 250000, level: 0, maxLevel: 1, effectId: 'boostTower_eternalSpire' },
  { id: 'eternalSpireUpgrade2', name: 'Infinity Wax', baseCost: 400000, level: 0, maxLevel: 1, effectId: 'boostTower_eternalSpire' },
  { id: 'eternalSpireUpgrade3', name: 'Endless Ladder', baseCost: 600000, level: 0, maxLevel: 1, effectId: 'boostTower_eternalSpire' }
];
