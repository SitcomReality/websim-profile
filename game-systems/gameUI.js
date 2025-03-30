import { getIcon } from './icons.js';
import { getPlayerState, spendCoins } from './playerState.js';
import { generateBuildingInvestigationText } from '../api.js';

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

// Reference to Selected Building Info Panel element
const selectedBuildingInfoPanelEl = document.getElementById('selected-building-info-panel');

// --- Constants ---
const INVESTIGATION_COST = 10; // Define the cost here

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

// Function to setup listener for the investigation button
function setupInvestigationButtonListener() {
    const investigateButton = document.getElementById('investigate-button');
    if (investigateButton) {
        investigateButton.addEventListener('click', async () => {
            const currentState = getPlayerState();
            if (!currentState.selectedBuildingData) {
                console.warn("Investigate clicked but no building selected.");
                return;
            }

            if (currentState.coins >= INVESTIGATION_COST) {
                // Disable button temporarily to prevent spamming
                investigateButton.disabled = true;
                investigateButton.textContent = 'Investigating...';

                // Spend coins
                spendCoins(INVESTIGATION_COST);

                try {
                    // Call the API function
                    await generateBuildingInvestigationText(currentState.selectedBuildingData);
                    // Re-enable button or change text on success if needed
                    investigateButton.textContent = `Investigate (${INVESTIGATION_COST} Coins)`;
                    investigateButton.disabled = false; // Re-enable after successful investigation
                } catch (error) {
                    console.error("Investigation failed:", error);
                    // Handle error - maybe show a message in AI text?
                    // Give coins back? Or just log error? For now, just log.
                    investigateButton.textContent = `Error (${INVESTIGATION_COST} Coins)`;
                    // Optionally re-enable after a delay on error
                    setTimeout(() => {
                        investigateButton.disabled = false;
                        updateSelectedBuildingInfo(currentState.selectedBuildingData); // Refresh panel to show correct state
                    }, 1500);
                }
            } else {
                // Not enough coins feedback
                const originalText = investigateButton.textContent;
                investigateButton.textContent = 'Not Enough Coins!';
                investigateButton.classList.add('error'); // Add class for styling
                setTimeout(() => {
                    investigateButton.textContent = originalText;
                    investigateButton.classList.remove('error');
                    // Re-evaluate disabled state based on current coins
                    updateSelectedBuildingInfo(currentState.selectedBuildingData);
                }, 1500); // Show message for 1.5 seconds
            }
        });
    }
}

// Function to update the Selected Building Info Panel
function updateSelectedBuildingInfo(projectData) {
    if (!selectedBuildingInfoPanelEl) return;

    if (projectData) {
        const currentCoins = getPlayerState().coins;
        const canAfford = currentCoins >= INVESTIGATION_COST;
        selectedBuildingInfoPanelEl.innerHTML = `
            <h4>${projectData.title || 'Untitled Building'}</h4>
            <p class="description">${projectData.description || 'No details available.'}</p>
            <div class="stats">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    ${projectData.views ?? 'N/A'}
                </span>
                <span>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ${projectData.likes ?? 'N/A'}
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                    ${projectData.comments ?? 'N/A'}
                </span>
            </div>
            <div class="actions">
                <button id="investigate-button" ${!canAfford ? 'disabled' : ''} title="${!canAfford ? 'Not enough coins' : 'Investigate this building'}">
                    Investigate (${INVESTIGATION_COST} Coins)
                </button>
                 <!-- More actions can be added here -->
            </div>
        `;
        selectedBuildingInfoPanelEl.classList.add('visible');
        setupInvestigationButtonListener(); // Set up listener after adding the button
    } else {
        selectedBuildingInfoPanelEl.innerHTML = '<p>Select a building to see details.</p>';
        selectedBuildingInfoPanelEl.classList.remove('visible');
    }
}

export { updateHUD, setupIcons, updateSelectedBuildingInfo, INVESTIGATION_COST }; // Export cost if needed elsewhere