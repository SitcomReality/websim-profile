import { updateHUD, updateSelectedBuildingInfo, updateObjectivesDisplay } from './gameUI.js';
// Import objective functions
import { applyObjectiveReward } from './objectives.js';

const initialState = {
    score: 0,
    hp: 100,
    coins: 0,
    gems: 0,
    grenades: 3,
    paint: 1000,
    limbs: 4,
    existentialInertia: 50,
    selectedBuildingId: null,
    selectedBuildingData: null,
    completedObjectives: [], // New: Track completed objective IDs
};

let currentState = { ...initialState };

function getPlayerState() {
    return { ...currentState };
}

function updatePlayerState(newState) {
    const previousState = { ...currentState };
    currentState = { ...currentState, ...newState };

    console.log("Player state updated:", currentState);

    const changedKeys = Object.keys(newState).filter(key => previousState[key] !== currentState[key]);
    const hudStats = ['score', 'hp', 'coins', 'gems', 'grenades', 'paint', 'limbs', 'existentialInertia'];
    if (changedKeys.some(key => hudStats.includes(key))) {
        updateHUD(currentState);
    }

    // Update selected building info if relevant stats change or selection changes
    if ('selectedBuildingId' in newState || 'selectedBuildingData' in newState || changedKeys.some(key => ['coins', 'paint', 'grenades'].includes(key))) {
         updateSelectedBuildingInfo(currentState.selectedBuildingData);
    }

    // New: Update objectives display if completed objectives change
    if ('completedObjectives' in newState && JSON.stringify(previousState.completedObjectives) !== JSON.stringify(currentState.completedObjectives)) {
        updateObjectivesDisplay(currentState.completedObjectives);
    }
}

// --- Objective Completion ---
function completeObjective(objectiveId) {
    if (!currentState.completedObjectives.includes(objectiveId)) {
        console.log(`Completing objective: ${objectiveId}`);
        const newCompletedObjectives = [...currentState.completedObjectives, objectiveId];
        updatePlayerState({ completedObjectives: newCompletedObjectives });
        applyObjectiveReward(objectiveId); // Apply reward
        // Potentially show a notification here later
    } else {
        console.log(`Objective ${objectiveId} already completed.`);
    }
}
// --- End Objective Completion ---


function addScore(points) {
    updatePlayerState({ score: currentState.score + points });
}

function changeHp(delta) {
    const newHp = Math.max(0, currentState.hp + delta);
    updatePlayerState({ hp: newHp });
}

function addCoins(amount) {
    updatePlayerState({ coins: currentState.coins + amount });
}

function spendCoins(amount) {
    if (currentState.coins >= amount) {
        updatePlayerState({ coins: currentState.coins - amount });
        // Check if this action completes an objective (e.g., spend X coins) - future enhancement
        return true;
    }
    return false;
}

function spendPaint(amount) {
    if (currentState.paint >= amount) {
        updatePlayerState({ paint: currentState.paint - amount });
        completeObjective('paint1'); // Check paint1 objective completion
        return true;
    }
    return false;
}

function spendGrenade(amount) {
    if (currentState.grenades >= amount) {
        updatePlayerState({ grenades: currentState.grenades - amount });
        completeObjective('sabotage1'); // Check sabotage1 objective completion
        return true;
    }
    return false;
}

function setSelectedBuilding(projectId, projectData = null) {
    const isTogglingOff = currentState.selectedBuildingId === projectId;
    const newSelectedId = isTogglingOff ? null : projectId;
    const newSelectedData = isTogglingOff ? null : projectData;

    updatePlayerState({
        selectedBuildingId: newSelectedId,
        selectedBuildingData: newSelectedData
    });
    console.log("Selected Building ID set to:", newSelectedId);
    console.log("Selected Building Data:", newSelectedData);

    // Note: Investigation objective is checked in api.js after successful AI call
    // to ensure the action was fully completed.
}

export {
    getPlayerState,
    updatePlayerState,
    addScore,
    addCoins,
    changeHp,
    spendCoins,
    spendPaint,
    spendGrenade,
    setSelectedBuilding,
    completeObjective // Export for use in api.js
};