// New file
const CYCLE_DURATION = 30000; // 30 seconds for a full day-night cycle
const MAX_OPACITY = 0.4; // How dark the overlay gets at night

let cycleInterval = null;

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

export { startDayNightCycle, stopDayNightCycle };