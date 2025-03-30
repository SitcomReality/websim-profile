import { getIcon } from './icons.js';

// References to HUD elements
const scoreEl = document.querySelector('#stat-score .value');
const hpEl = document.querySelector('#stat-hp .value');
const coinsEl = document.querySelector('#stat-coins .value');
const gemsEl = document.querySelector('#stat-gems .value');
const grenadesEl = document.querySelector('#stat-grenades .value');
const paintEl = document.querySelector('#stat-paint .value');
const limbsEl = document.querySelector('#stat-limbs .value');
const inertiaEl = document.querySelector('#stat-inertia .value');

// References to icon containers
const scoreIconEl = document.querySelector('#stat-score .icon');
const hpIconEl = document.querySelector('#stat-hp .icon');
const coinsIconEl = document.querySelector('#stat-coins .icon');
const gemsIconEl = document.querySelector('#stat-gems .icon');
const grenadesIconEl = document.querySelector('#stat-grenades .icon');
const paintIconEl = document.querySelector('#stat-paint .icon');
const limbsIconEl = document.querySelector('#stat-limbs .icon');
const inertiaIconEl = document.querySelector('#stat-inertia .icon');

function updateHUD(playerState) {
    console.log("Updating HUD with state:", playerState);
    if (scoreEl) scoreEl.textContent = playerState.score ?? 0;
    if (hpEl) hpEl.textContent = playerState.hp ?? 0;
    if (coinsEl) coinsEl.textContent = playerState.coins ?? 0;
    if (gemsEl) gemsEl.textContent = playerState.gems ?? 0;
    if (grenadesEl) grenadesEl.textContent = playerState.grenades ?? 0;
    if (paintEl) paintEl.textContent = playerState.paint ?? 0;
    if (limbsEl) limbsEl.textContent = playerState.limbs ?? 0;
    if (inertiaEl) inertiaEl.textContent = playerState.existentialInertia ?? 0;
}

function setupIcons() {
    if (scoreIconEl) scoreIconEl.innerHTML = getIcon('score');
    if (hpIconEl) hpIconEl.innerHTML = getIcon('hp');
    if (coinsIconEl) coinsIconEl.innerHTML = getIcon('coins');
    if (gemsIconEl) gemsIconEl.innerHTML = getIcon('gems');
    if (grenadesIconEl) grenadesIconEl.innerHTML = getIcon('grenades');
    if (paintIconEl) paintIconEl.innerHTML = getIcon('paint');
    if (limbsIconEl) limbsIconEl.innerHTML = getIcon('limbs');
    if (inertiaIconEl) inertiaIconEl.innerHTML = getIcon('existentialInertia');
}

export { updateHUD, setupIcons };