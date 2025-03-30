import { updateHUD } from './gameUI.js'; // Correct the import name

const initialState = {
    score: 0,
    hp: 100,
    coins: 0,
    gems: 0,
    grenades: 3,
    paint: 1000, // Assuming mL
    limbs: 4,
    existentialInertia: 50,
    selectedBuildingId: null, // Track the selected building ID
};

// For now, we just expose the initial state.
// Later, this could involve loading from localStorage or an API.
let currentState = { ...initialState };

function getPlayerState() {
    // In the future, this might fetch from a server or local storage
    return { ...currentState }; // Return a copy to prevent direct mutation
}

function updatePlayerState(newState) {
    // Basic merge update
    const previousState = { ...currentState };
    currentState = { ...currentState, ...newState };

    // Here, you might add logic to:
    // - Validate the new state
    // - Persist changes (localStorage, API call)
    // - Trigger events or updates in other modules (like gameUI)

    console.log("Player state updated:", currentState); // For debugging

    // Notify HUD if relevant stats changed
    // Check which keys changed to avoid unnecessary HUD updates
    const changedKeys = Object.keys(newState).filter(key => previousState[key] !== currentState[key]);
    const hudStats = ['score', 'hp', 'coins', 'gems', 'grenades', 'paint', 'limbs', 'existentialInertia'];
    if (changedKeys.some(key => hudStats.includes(key))) {
        // Use the imported function directly instead of the global window property
        updateHUD(currentState);
    }

    // Notify City View if selected building changed
    if ('selectedBuildingId' in newState && previousState.selectedBuildingId !== currentState.selectedBuildingId) {
        if (window.updateBuildingSelectionHighlight) {
            window.updateBuildingSelectionHighlight(currentState.selectedBuildingId);
        } else {
            console.warn("window.updateBuildingSelectionHighlight not found. Cannot update selection visually.");
        }
    }
}

// Example of how a specific stat might be updated
function addScore(points) {
    updatePlayerState({ score: currentState.score + points });
}

function changeHp(delta) {
    const newHp = Math.max(0, currentState.hp + delta); // Ensure HP doesn't go below 0
    updatePlayerState({ hp: newHp });
}

// --- Add more specific update functions as needed ---
function spendCoins(amount) {
    if (currentState.coins >= amount) {
        updatePlayerState({ coins: currentState.coins - amount });
        return true; // Transaction successful
    }
    return false; // Not enough coins
}

// --- Function to update selected building ---
function setSelectedBuilding(projectId) {
    // Allow toggling off selection by clicking the same building again
    const newSelectedId = currentState.selectedBuildingId === projectId ? null : projectId;
    updatePlayerState({ selectedBuildingId: newSelectedId });
    console.log("Selected Building ID set to:", newSelectedId);
}

// Export functions for external use
export {
    getPlayerState,
    updatePlayerState,
    addScore,
    changeHp,
    spendCoins,
    setSelectedBuilding // Export the new function
    // Export other specific updaters here
};