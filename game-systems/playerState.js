import { updateHUD, updateSelectedBuildingInfo } from './gameUI.js'; 

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

    if ('selectedBuildingId' in newState && previousState.selectedBuildingId !== currentState.selectedBuildingId) {
    }

     if ('selectedBuildingData' in newState && JSON.stringify(previousState.selectedBuildingData) !== JSON.stringify(currentState.selectedBuildingData)) {
         updateSelectedBuildingInfo(currentState.selectedBuildingData);
    } else if (changedKeys.some(key => ['coins', 'paint', 'grenades'].includes(key)) && currentState.selectedBuildingData) {
        updateSelectedBuildingInfo(currentState.selectedBuildingData);
    }
}

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
        return true; 
    }
    return false; 
}

function spendPaint(amount) {
    if (currentState.paint >= amount) {
        updatePlayerState({ paint: currentState.paint - amount });
        return true; 
    }
    return false; 
}

function spendGrenade(amount) {
    if (currentState.grenades >= amount) {
        updatePlayerState({ grenades: currentState.grenades - amount });
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
    setSelectedBuilding
};