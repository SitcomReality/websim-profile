import { updateHUD, updateSelectedBuildingInfo } from './gameUI.js'; // Correct the import name and add new import

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
    selectedBuildingData: null, // Store data of the selected building
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

    // Notify City View highlight if selected building ID changed
    if ('selectedBuildingId' in newState && previousState.selectedBuildingId !== currentState.selectedBuildingId) {
        // The visual highlight update is now handled directly in gameBoardUI.js's listener
        // and via the exposed window function if needed elsewhere, but primarily driven by the click
        // No need to call window.updateBuildingSelectionHighlight here anymore as it's tied to the UI event
    }

     // Notify Selected Building Info Panel if data changed
    if ('selectedBuildingData' in newState && JSON.stringify(previousState.selectedBuildingData) !== JSON.stringify(currentState.selectedBuildingData)) {
        // Also update the panel if relevant resources (coins, paint, grenades etc.) changed,
        // as button disabled states might need refreshing
         updateSelectedBuildingInfo(currentState.selectedBuildingData);
    } else if (changedKeys.some(key => ['coins', 'paint', 'grenades'].includes(key)) && currentState.selectedBuildingData) {
        // Refresh panel if coins, paint or grenades changed while a building is selected
        updateSelectedBuildingInfo(currentState.selectedBuildingData);
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

// --- Add function to spend paint ---
function spendPaint(amount) {
    if (currentState.paint >= amount) {
        updatePlayerState({ paint: currentState.paint - amount });
        return true; // Transaction successful
    }
    return false; // Not enough paint
}

// --- Add function to spend grenades ---
function spendGrenade(amount) {
    if (currentState.grenades >= amount) {
        updatePlayerState({ grenades: currentState.grenades - amount });
        return true; // Transaction successful
    }
    return false; // Not enough grenades
}

// --- Function to update selected building ---
function setSelectedBuilding(projectId, projectData = null) {
    // Allow toggling off selection by clicking the same building again
    const isTogglingOff = currentState.selectedBuildingId === projectId;
    const newSelectedId = isTogglingOff ? null : projectId;
    const newSelectedData = isTogglingOff ? null : projectData;

    updatePlayerState({
        selectedBuildingId: newSelectedId,
        selectedBuildingData: newSelectedData
    });
    console.log("Selected Building ID set to:", newSelectedId);
    console.log("Selected Building Data:", newSelectedData);
}

// Export functions for external use
export {
    getPlayerState,
    updatePlayerState,
    addScore,
    changeHp,
    spendCoins,
    spendPaint, 
    spendGrenade, 
    setSelectedBuilding 
    // Export other specific updaters here
};