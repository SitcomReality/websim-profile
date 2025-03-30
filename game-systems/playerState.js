// Manages the player's stats and resources

const initialState = {
    score: 0,
    hp: 100,
    coins: 0,
    gems: 0,
    grenades: 3,
    paint: 1000, // Assuming mL
    limbs: 4,
    existentialInertia: 50,
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
    currentState = { ...currentState, ...newState };

    // Here, you might add logic to:
    // - Validate the new state
    // - Persist changes (localStorage, API call)
    // - Trigger events or updates in other modules (like gameUI)

    console.log("Player state updated:", currentState); // For debugging
    // Notify UI (this link could be improved with events/observers)
    if (window.updateGameHUD) {
         window.updateGameHUD(currentState);
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

// Export functions for external use
export {
    getPlayerState,
    updatePlayerState,
    addScore,
    changeHp,
    spendCoins
    // Export other specific updaters here
};