import { changeHp } from './playerState.js'; // Add import for changeHp
import { triggerVisualEffect, showNotification } from '../ui.js'; // Import visual effect trigger & notification

const CYCLE_DURATION = 30000; // 30 seconds for a full day-night cycle
const MAX_OPACITY = 0.4; // How dark the overlay gets at night
const EVENT_CHECK_INTERVAL = 15000; // Check for random events every 15 seconds
const REALITY_TREMOR_CHANCE = 0.15; // 15% chance per interval
const HP_LOSS_AMOUNT = -2; // HP lost during a tremor

let cycleInterval = null;
let eventInterval = null;

function updateSkyOpacity() {
    const now = Date.now();
    // Calculate position in the cycle (0 to 1)
    const cyclePosition = (now % CYCLE_DURATION) / CYCLE_DURATION;
    // Use Math.sin to create a smooth rise and fall (0 -> 1 -> 0)
    const opacityFactor = Math.sin(cyclePosition * Math.PI);
    const opacity = opacityFactor * MAX_OPACITY;

    // Set the CSS variable on the body
    document.body.style.setProperty('--sky-overlay-opacity', opacity.toFixed(3));
}

function checkForRandomEvents() {
    console.log("Checking for random events..."); // Debug log
    if (Math.random() < REALITY_TREMOR_CHANCE) {
        console.log("Reality Tremor triggered!");
        changeHp(HP_LOSS_AMOUNT);
        triggerVisualEffect('screenShake'); // Use the imported function
        showNotification(`Reality Tremor! ${HP_LOSS_AMOUNT} HP`); // Show notification
    }
}

function startDayNightCycle() {
    console.log("Starting day/night cycle simulation...");
    if (cycleInterval) {
        clearInterval(cycleInterval); // Clear existing interval if any
    }
    // Initial update
    updateSkyOpacity();
    // Update every ~60ms for smooth transition
    cycleInterval = setInterval(updateSkyOpacity, 60);
}

function stopDayNightCycle() {
    if (cycleInterval) {
        clearInterval(cycleInterval);
        cycleInterval = null;
        console.log("Day/night cycle stopped.");
        // Optionally reset opacity
        // document.body.style.removeProperty('--sky-overlay-opacity');
    }
}

function startRandomEvents() {
    console.log("Starting random event checks...");
    if (eventInterval) {
        clearInterval(eventInterval);
    }
    // Don't check immediately, wait for the first interval
    eventInterval = setInterval(checkForRandomEvents, EVENT_CHECK_INTERVAL);
}

function stopRandomEvents() {
    if (eventInterval) {
        clearInterval(eventInterval);
        eventInterval = null;
        console.log("Random event checks stopped.");
    }
}

export { startDayNightCycle, stopDayNightCycle, startRandomEvents, stopRandomEvents };