import { getPlayerState } from './playerState.js';
import { updateHUD, setupIcons } from './gameUI.js';
import { startDayNightCycle, startRandomEvents, startResourceGeneration } from './simulation.js';

function initGame() {
    console.log("Initializing game systems...");

    // Set up the icons in the HUD
    setupIcons();

    // Get initial state
    const initialState = getPlayerState();

    // Update the HUD with initial state
    updateHUD(initialState);

    // Start the day/night cycle simulation
    startDayNightCycle();

    // Start the random event checks
    startRandomEvents();

    // Start passive resource generation
    startResourceGeneration();

    // Start game loop, event listeners, etc. here later
    console.log("Game systems initialized.");
}

export { initGame };