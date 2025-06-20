// Game variables
let soulGems = 0;
let baseClickPower = 1;
let clickPower = baseClickPower;
let arcaneEssence = 0;

let gems = [];
let fallingGems = [];
let piledGems = [];
const pileColumnWidth = 30; // Width per column for gem pile
let pileColumns = []; // Tracks pile height per column

// Track visible buildings and upgrades
let visibleBuildings = new Set();
let visibleUpgrades = new Set();

function calculateCost(base, amountOwned) {
  return Math.floor(base * Math.pow(1.15, amountOwned));
}

function applyUpgradeEffect(upgrade) {
  if (upgrade.effectId === 'increaseClickPower') {
    clickPower += 1;
  } else if (upgrade.effectId.startsWith('boostTower_')) {
    const towerId = upgrade.effectId.split('_')[1];
    const building = buildings.find(b => b.id === towerId);
    if (building) building.production *= 1.3;
  }
}

function loadGame() {
  const saved = localStorage.getItem('wizardClickerSave');
  if (saved) {
    const data = JSON.parse(saved);
    soulGems = data.soulGems || 0;
    arcaneEssence = data.arcaneEssence || 0;
    buildings.forEach(b => b.owned = data.buildings?.[b.id] || 0);
    upgrades.forEach(u => u.level = data.upgrades?.[u.id] || 0);
    visibleBuildings = new Set(data.visibleBuildings || []);
    visibleUpgrades = new Set(data.visibleUpgrades || []);
  }

  buildings.forEach(b => b.production = b.baseProduction || b.production);
  clickPower = baseClickPower;
  upgrades.forEach(u => { for (let i = 0; i < u.level; i++) applyUpgradeEffect(u); });
}

function saveGame() {
  const buildingsData = {};
  buildings.forEach(b => buildingsData[b.id] = b.owned);
  const upgradesData = {};
  upgrades.forEach(u => upgradesData[u.id] = u.level);
  localStorage.setItem('wizardClickerSave', JSON.stringify({
    soulGems,
    arcaneEssence,
    buildings: buildingsData,
    upgrades: upgradesData,
    visibleBuildings: Array.from(visibleBuildings),
    visibleUpgrades: Array.from(visibleUpgrades)
  }));
}

function calculateSPS() {
  return buildings.reduce((total, b) => total + b.production * b.owned, 0);
}

function updateUI() {
  document.getElementById('soulGemsDisplay').textContent = `Soul Gems: ${Math.floor(soulGems)}`;
  document.getElementById('arcaneEssenceDisplay').textContent = `Arcane Essence: ${arcaneEssence}`;
  document.getElementById('soulGemsPerSecond').textContent = `Soul Gems per second: ${calculateSPS().toFixed(1)}`;

  buildings.forEach(b => {
    const wrapper = document.getElementById(`building-wrapper-${b.id}`);
    const btn = document.getElementById(`buy-${b.id}`);
    const countSpan = document.getElementById(`${b.id}-count`);
    const spsSpan = document.getElementById(`${b.id}-sps`);
    const cost = calculateCost(b.baseCost, b.owned);
    const visible = b.owned > 0 || soulGems >= cost * 0.6 || visibleBuildings.has(b.id);

    if (visible) visibleBuildings.add(b.id);

    if (wrapper) {
      wrapper.style.display = visible ? 'block' : 'none';
    }

    if (btn) {
      btn.textContent = `Buy ${b.name} (Cost: ${cost} Soul Gems)`;
      btn.disabled = soulGems < cost;
    }
    if (countSpan) countSpan.textContent = b.owned;
    if (spsSpan) spsSpan.textContent = (b.production * b.owned).toFixed(1);
  });

  upgrades.forEach(u => {
    const wrapper = document.getElementById(`upgrade-wrapper-${u.id}`);
    const btn = document.getElementById(`upgrade-${u.id}`);
    const levelSpan = document.getElementById(`${u.id}-level`);
    const cost = calculateCost(u.baseCost, u.level);
    const visible = u.level > 0 || arcaneEssence >= cost * 0.6 || visibleUpgrades.has(u.id);

    if (visible) visibleUpgrades.add(u.id);

    if (wrapper) {
      wrapper.style.display = visible ? 'block' : 'none';
    }

    if (btn) {
      btn.textContent = u.level >= u.maxLevel ? `${u.name} (MAX)` : `${u.name} (Cost: ${cost} Arcane Essence)`;
      btn.disabled = u.level >= u.maxLevel || arcaneEssence < cost;
    }
    if (levelSpan) levelSpan.textContent = u.level;
  });

  const potentialEssence = Math.floor(Math.sqrt(soulGems / 1000));
  document.getElementById('prestigeInfo').textContent = `You will gain ${potentialEssence} Arcane Essence if you Ascend now.`;
  document.getElementById('prestigeButton').disabled = potentialEssence < 1;
}

// EXPLOSION VARIABLES
let explodingGems = [];
let explosionActive = false;
let explosionStartTime = 0;
const explosionDuration = 2000; // milliseconds

function clickOrb() {
  soulGems += clickPower;
  spawnFallingGem();
  updateUI();
  saveGame();
}

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

function buyUpgrade(id) {
  const u = upgrades.find(x => x.id === id);
  if (!u || u.level >= u.maxLevel) return;
  const cost = calculateCost(u.baseCost, u.level);
  if (arcaneEssence >= cost) {
    arcaneEssence -= cost;
    u.level++;
    buildings.forEach(b => b.production = b.baseProduction || b.production);
    clickPower = baseClickPower;
    upgrades.forEach(up => { for (let i = 0; i < up.level; i++) applyUpgradeEffect(up); });
    updateUI();
    saveGame();
  }
}

function prestige() {
  const essenceGain = Math.floor(Math.sqrt(soulGems / 1000));
  if (essenceGain < 1) return;
  arcaneEssence += essenceGain;
  soulGems = 0;

  // Trigger gem explosion
  if (piledGems.length > 0) {
    startGemExplosion();
  }

  piledGems = [];
  pileColumns.fill(0);

  // Reset buildings owned but NOT upgrades
  buildings.forEach(b => b.owned = 0);
  // Keep upgrades as is (do NOT reset u.level here)

  // Reset building production to base values
  buildings.forEach(b => b.production = b.baseProduction || b.production);

  // Reset click power base, then reapply all upgrade effects from current upgrade levels
  clickPower = baseClickPower;
  upgrades.forEach(up => { for (let i = 0; i < up.level; i++) applyUpgradeEffect(up); });

  updateUI();
  saveGame();
}

function startGemExplosion() {
  explosionActive = true;
  explosionStartTime = performance.now();

  explodingGems = piledGems.map(gem => {
    const angle = Math.random() * 2 * Math.PI;
    const speed = 2 + Math.random() * 3;
    return {
      x: gem.pileCol * pileColumnWidth + (pileColumnWidth - gem.size) / 2,
      y: gemCanvas.height - (gem.pileRow + 1) * gem.size,
      size: gem.size,
      opacity: 1,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    };
  });

  piledGems = [];
  pileColumns.fill(0);
}

function passiveIncome() {
  soulGems += calculateSPS();
  updateUI();
  saveGame();
}

function createDynamicUI() {
  const buildingsContainer = document.getElementById('buildingsContainer');
  buildingsContainer.innerHTML = '';
  buildings.forEach(b => {
    const wrapper = document.createElement('div');
    wrapper.id = `building-wrapper-${b.id}`;

    const btn = document.createElement('button');
    btn.id = `buy-${b.id}`;
    btn.addEventListener('click', () => buyBuilding(b.id));
    wrapper.appendChild(btn);

    const count = document.createElement('div');
    count.innerHTML = `Owned: <span id="${b.id}-count">0</span> | Production: <span id="${b.id}-sps">0.0</span> SPS`;
    wrapper.appendChild(count);

    buildingsContainer.appendChild(wrapper);
  });

  const upgradesContainer = document.getElementById('upgradesContainer');
  upgradesContainer.innerHTML = '';
  upgrades.forEach(u => {
    const wrapper = document.createElement('div');
    wrapper.id = `upgrade-wrapper-${u.id}`;

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

// GEM CANVAS SETUP
const gemCanvas = document.getElementById('gemCanvas');
const gemCtx = gemCanvas.getContext('2d');
let gemImg = new Image();
gemImg.src = 'gem.png';

// For piled gems
pileColumns = [];
function initPileColumns() {
  const columns = Math.floor(window.innerWidth / pileColumnWidth);
  pileColumns = new Array(columns).fill(0);
}
initPileColumns();

window.addEventListener('resize', () => {
  resizeCanvas();
  initPileColumns();
});

// GEM CANVAS SIZE
function resizeCanvas() {
  gemCanvas.width = window.innerWidth;
  gemCanvas.height = window.innerHeight;
}
resizeCanvas();

// SPAWN FALLING GEMS BASED ON SOUL GEMS
function spawnFallingGem() {
  // Spawn at least one, plus more if you have more soul gems spent (scaled)
  const baseCount = 1;
  const extraCount = Math.floor(soulGems / 200);
  const totalCount = baseCount + extraCount;

  for (let i = 0; i < totalCount; i++) {
    fallingGems.push({
      x: Math.random() * gemCanvas.width,
      y: -20,
      size: 16 + Math.random() * 10,
      speed: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      piled: false
    });
  }
}

function drawGems() {
  gemCtx.clearRect(0, 0, gemCanvas.width, gemCanvas.height);

  if (explosionActive) {
    const elapsed = performance.now() - explosionStartTime;
    const progress = elapsed / explosionDuration;

    if (progress >= 1) {
      explosionActive = false;
      explodingGems = [];
    } else {
      for (let i = explodingGems.length - 1; i >= 0; i--) {
        const gem = explodingGems[i];
        gem.x += gem.vx;
        gem.y += gem.vy;
        gem.vy += 0.1; // gravity
        gem.rotation += gem.rotationSpeed;
        gem.opacity = 1 - progress;

        if (gemImg.complete) {
          gemCtx.save();
          gemCtx.globalAlpha = gem.opacity;
          gemCtx.translate(gem.x + gem.size / 2, gem.y + gem.size / 2);
          gemCtx.rotate(gem.rotation);
          gemCtx.drawImage(gemImg, -gem.size / 2, -gem.size / 2, gem.size, gem.size);
          gemCtx.restore();
          gemCtx.globalAlpha = 1;
        }
      }
    }
  } else {
    // Draw falling gems and handle piling logic
    for (let i = fallingGems.length - 1; i >= 0; i--) {
      const gem = fallingGems[i];
      gem.y += gem.speed;
      gem.rotation += gem.rotationSpeed;

      const colIndex = Math.floor(gem.x / pileColumnWidth);
      const pileHeight = pileColumns[colIndex] || 0;
      const pileY = gemCanvas.height - pileHeight;

      if (gem.y + gem.size >= pileY) {
        // Snap to pile position
        gem.y = pileY - gem.size;
        gem.piled = true;
        gem.pileCol = colIndex;
        gem.pileRow = pileHeight / gem.size;
        pileColumns[colIndex] = pileHeight + gem.size;
        piledGems.push(gem);
        fallingGems.splice(i, 1);
        continue;
      }

      if (gemImg.complete) {
        gemCtx.save();
        gemCtx.globalAlpha = gem.opacity;
        gemCtx.translate(gem.x + gem.size / 2, gem.y + gem.size / 2);
        gemCtx.rotate(gem.rotation);
        gemCtx.drawImage(gemImg, -gem.size / 2, -gem.size / 2, gem.size, gem.size);
        gemCtx.restore();
        gemCtx.globalAlpha = 1;
      }
    }

    // Draw piled gems
    piledGems.forEach(gem => {
      const x = gem.pileCol * pileColumnWidth + (pileColumnWidth - gem.size) / 2;
      const y = gemCanvas.height - (gem.pileRow + 1) * gem.size;

      if (gemImg.complete) {
        gemCtx.drawImage(gemImg, x, y, gem.size, gem.size);
      }
    });
  }

  requestAnimationFrame(drawGems);
}

function setup() {
  document.getElementById('clickOrb').addEventListener('click', clickOrb);
  document.getElementById('prestigeButton').addEventListener('click', prestige);
  createDynamicUI();
  loadGame();
  updateUI();
  setInterval(passiveIncome, 1000);
  initPileColumns();
  resizeCanvas();
  requestAnimationFrame(drawGems);
}

setup();
