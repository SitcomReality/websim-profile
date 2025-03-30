import { changeHp, addCoins } from './playerState.js'; 
import { triggerVisualEffect, showNotification } from '../ui.js'; 

const CYCLE_DURATION = 30000; 
const MAX_OPACITY = 0.4; 
const EVENT_CHECK_INTERVAL = 15000; 
const REALITY_TREMOR_CHANCE = 0.15; 
const HP_LOSS_AMOUNT = -2; 
const COIN_GENERATION_INTERVAL = 10000; 
const COIN_GENERATION_AMOUNT = 5; 

let cycleInterval = null;
let eventInterval = null;
let resourceInterval = null; 

function updateSkyOpacity() {
    const now = Date.now();
    const cyclePosition = (now % CYCLE_DURATION) / CYCLE_DURATION;
    const opacityFactor = Math.sin(cyclePosition * Math.PI);
    const opacity = opacityFactor * MAX_OPACITY;

    document.body.style.setProperty('--sky-overlay-opacity', opacity.toFixed(3));
}

function checkForRandomEvents() {
    console.log("Checking for random events..."); 
    if (Math.random() < REALITY_TREMOR_CHANCE) {
        console.log("Reality Tremor triggered!");
        changeHp(HP_LOSS_AMOUNT);
        triggerVisualEffect('screenShake'); 
        showNotification(`Reality Tremor! ${HP_LOSS_AMOUNT} HP`); 
    }
}

function generatePassiveIncome() {
    console.log(`Generating ${COIN_GENERATION_AMOUNT} coins.`);
    addCoins(COIN_GENERATION_AMOUNT);
}

function startDayNightCycle() {
    console.log("Starting day/night cycle simulation...");
    if (cycleInterval) {
        clearInterval(cycleInterval); 
    }
    updateSkyOpacity();
    cycleInterval = setInterval(updateSkyOpacity, 60);
}

function stopDayNightCycle() {
    if (cycleInterval) {
        clearInterval(cycleInterval);
        cycleInterval = null;
        console.log("Day/night cycle stopped.");
    }
}

function startRandomEvents() {
    console.log("Starting random event checks...");
    if (eventInterval) {
        clearInterval(eventInterval);
    }
    eventInterval = setInterval(checkForRandomEvents, EVENT_CHECK_INTERVAL);
}

function stopRandomEvents() {
    if (eventInterval) {
        clearInterval(eventInterval);
        eventInterval = null;
        console.log("Random event checks stopped.");
    }
}

function startResourceGeneration() {
    console.log("Starting passive resource generation...");
    if (resourceInterval) {
        clearInterval(resourceInterval);
    }
    resourceInterval = setInterval(generatePassiveIncome, COIN_GENERATION_INTERVAL);
}

function stopResourceGeneration() {
    if (resourceInterval) {
        clearInterval(resourceInterval);
        resourceInterval = null;
        console.log("Passive resource generation stopped.");
    }
}

export {
    startDayNightCycle,
    stopDayNightCycle,
    startRandomEvents,
    stopRandomEvents,
    startResourceGeneration, 
    stopResourceGeneration 
};