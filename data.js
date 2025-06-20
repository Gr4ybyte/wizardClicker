// Contains all data about buildings and upgrades

const buildings = [
  { id: 'enchantedTower', name: 'Enchanted Tower', baseCost: 10, owned: 0, production: 1 },
  { id: 'magicFamiliar', name: 'Magic Familiar', baseCost: 100, owned: 0, production: 5 },
  { id: 'arcaneLibrary', name: 'Arcane Library', baseCost: 500, owned: 0, production: 20 },
  { id: 'mysticPortal', name: 'Mystic Portal', baseCost: 2000, owned: 0, production: 75 },
  { id: 'celestialObelisk', name: 'Celestial Obelisk', baseCost: 10000, owned: 0, production: 300 }
];

const upgrades = [
  { id: 'clickPower', name: 'Focus Crystal', baseCost: 5, level: 0, maxLevel: 10, effectId: 'increaseClickPower' },
  { id: 'towerBoost', name: 'Tower Amplifier', baseCost: 10, level: 0, maxLevel: 5, effectId: 'boostTowerProduction' }
];
