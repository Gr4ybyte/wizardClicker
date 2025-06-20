// Game variables
let soulGems = 0;
let baseClickPower = 1;
let clickPower = baseClickPower;
let arcaneEssence = 0;

// Cost calculation
function calculateCost(base, amountOwned) {
  return Math.floor(base * Math.pow(1.15, amountOwned));
}

// Apply upgrades
function applyUpgradeEffect(upgrade) {
  switch (upgrade.effectId) {
    case 'increaseClickPower':
      clickPower += 1;
      break;
    case 'boostTowerProduction':
      buildings.forEach(b => b.production *= 1.2);
      break;
  }
}

// Load saved game
function loadGame() {
  const saved = localStorage.getItem('wizardClickerSave');
  if (saved) {
    const data = JSON.parse(saved);
    soulGems = data.soulGems || 0;
    arcaneEssence = data.arcaneEssence || 0;

    if (data.buildings) {
      buildings.forEach(b => {
        if (data.buildings[b.id] !== undefined) b.owned = data.buildings[b.id];
      });
    }
    if (data.upgrades) {
      upgrades.forEach(u => {
        if (data.upgrades[u.id] !== undefined) u.level = data.upgrades[u.id];
      });
    }
  }

  // Reset base values
  clickPower = baseClickPower;
  buildings.forEach(b => {
    switch (b.id) {
      case 'enchantedTower': b.production = 1; break;
      case 'magicFamiliar': b.production = 5; break;
      case 'arcaneLibrary': b.production = 20; break;
      case 'mysticPortal': b.production = 75; break;
      case 'celestialObelisk': b.production = 300; break;
    }
  });

  // Apply upgrades
  upgrades.forEach(u => {
    for(let i=0; i<u.level; i++) {
      applyUpgradeEffect(u);
    }
  });
}

// Save game
function saveGame() {
  const buildingsData = {};
  buildings.forEach(b => buildingsData[b.id] = b.owned);

  const upgradesData = {};
  upgrades.forEach(u => upgradesData[u.id] = u.level);

  const data = {
    soulGems,
    arcaneEssence,
    buildings: buildingsData,
    upgrades: upgradesData
  };

  localStorage.setItem('wizardClickerSave', JSON.stringify(data));
}

// Calculate soul gems per second
function calculateSPS() {
  return buildings.reduce((total, b) => total + b.production * b.owned, 0);
}

// Update UI
function updateUI() {
  document.getElementById('soulGemsDisplay').textContent = `Soul Gems: ${Math.floor(soulGems)}`;
  document.getElementById('arcaneEssenceDisplay').textContent = `Arcane Essence: ${arcaneEssence}`;

  document.getElementById('soulGemsPerSecond').textContent = `Soul Gems per second: ${calculateSPS().toFixed(1)}`;

  buildings.forEach(b => {
    const btn = document.getElementById(`buy-${b.id}`);
    const countSpan = document.getElementById(`${b.id}-count`);
    if (btn) {
      const cost = calculateCost(b.baseCost, b.owned);
      btn.textContent = `Buy ${b.name} (Cost: ${cost} Soul Gems)`;
      btn.disabled = soulGems < cost;
    }
    if (countSpan) {
      countSpan.textContent = b.owned;
    }
  });

  upgrades.forEach(u => {
    const btn = document.getElementById(`upgrade-${u.id}`);
    const levelSpan = document.getElementById(`${u.id}-level`);
    if (btn) {
      if (u.level >= u.maxLevel) {
        btn.textContent = `${u.name} (MAX)`;
        btn.disabled = true;
      } else {
        const cost = calculateCost(u.baseCost, u.level);
        btn.textContent = `${u.name} (Cost: ${cost} Arcane Essence)`;
        btn.disabled = arcaneEssence < cost;
      }
    }
    if (levelSpan) {
      levelSpan.textContent = u.level;
    }
  });

  const potentialEssence = Math.floor(Math.sqrt(soulGems / 1000));
  const prestigeInfo = document.getElementById('prestigeInfo');
  prestigeInfo.textContent = `You will gain ${potentialEssence} Arcane Essence if you Ascend now.`;
  document.getElementById('prestigeButton').disabled = potentialEssence < 1;
}

// Click orb
function clickOrb() {
  soulGems += clickPower;
  updateUI();
  saveGame();
}

// Buy building
function buyBuilding(id) {
  const b = buildings.find(x => x.id === id);
  if (!b) return;
  const cost = calculateCost(b.baseCost, b.owned);
  if (soulGems >= cost) {
    soulGems -= cost;
    b.owned++;
    updateUI();
    saveGame();
  }
}

// Buy upgrade
function buyUpgrade(id) {
  const u = upgrades.find(x => x.id === id);
  if (!u || u.level >= u.maxLevel) return;

  const cost = calculateCost(u.baseCost, u.level);
  if (arcaneEssence >= cost) {
    arcaneEssence -= cost;
    u.level++;

    // Reset stats
    clickPower = baseClickPower;
    buildings.forEach(b => {
      switch (b.id) {
        case 'enchantedTower': b.production = 1; break;
        case 'magicFamiliar': b.production = 5; break;
        case 'arcaneLibrary': b.production = 20; break;
        case 'mysticPortal': b.production = 75; break;
        case 'celestialObelisk': b.production = 300; break;
      }
    });

    upgrades.forEach(up => {
      for(let i=0; i<up.level; i++) {
        applyUpgradeEffect(up);
      }
    });

    updateUI();
    saveGame();
  }
}

// Prestige
function prestige() {
  const essenceGain = Math.floor(Math.sqrt(soulGems / 1000));
  if (essenceGain < 1) return;

  arcaneEssence += essenceGain;

  soulGems = 0;
  buildings.forEach(b => b.owned = 0);
  upgrades.forEach(u => u.level = 0);

  clickPower = baseClickPower;
  buildings.forEach(b => {
    switch (b.id) {
      case 'enchantedTower': b.production = 1; break;
      case 'magicFamiliar': b.production = 5; break;
      case 'arcaneLibrary': b.production = 20; break;
      case 'mysticPortal': b.production = 75; break;
      case 'celestialObelisk': b.production = 300; break;
    }
  });

  updateUI();
  saveGame();
}

// Passive income per second
function passiveIncome() {
  soulGems += calculateSPS();
  updateUI();
  saveGame();
}

// Create dynamic UI for buildings and upgrades
function createDynamicUI() {
  const buildingsContainer = document.getElementById('buildingsContainer');
  buildingsContainer.innerHTML = '';
  buildings.forEach(b => {
    const wrapper = document.createElement('div');

    const btn = document.createElement('button');
    btn.id = `buy-${b.id}`;
    btn.addEventListener('click', () => buyBuilding(b.id));
    wrapper.appendChild(btn);

    const count = document.createElement('div');
    count.innerHTML = `Owned: <span id="${b.id}-count">0</span>`;
    wrapper.appendChild(count);

    buildingsContainer.appendChild(wrapper);
  });

  const upgradesContainer = document.getElementById('upgradesContainer');
  upgradesContainer.innerHTML = '';
  upgrades.forEach(u => {
    const wrapper = document.createElement('div');

    const btn = document.createElement('button');
    btn.id = `upgrade-${u.id}`;
    btn.addEventListener('click', () => buyUpgrade(u.id));
    wrapper.appendChild(btn);

    const level = document.createElement('div');
    level.innerHTML = `Level: <span id="${u.id}-level">0</span>`;
    wrapper.appendChild(level);

    upgradesContainer.appendChild(wrapper);
  });
}

// Setup
function setup() {
  document.getElementById('clickOrb').addEventListener('click', clickOrb);
  document.getElementById('prestigeButton').addEventListener('click', prestige);

  createDynamicUI();

  loadGame();
  updateUI();

  setInterval(passiveIncome, 1000);
}

setup();
