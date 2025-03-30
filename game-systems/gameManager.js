import { getPlayerState } from './playerState.js';
import { updateHUD, setupIcons } from './gameUI.js';

function initGame() {
    console.log("Initializing game systems...");

    // Set up the icons in the HUD
    setupIcons();

    // Get initial state
    const initialState = getPlayerState();

    // Update the HUD with initial state
    updateHUD(initialState);

    // Start game loop, event listeners, etc. here later
    console.log("Game systems initialized.");
}

export { initGame };