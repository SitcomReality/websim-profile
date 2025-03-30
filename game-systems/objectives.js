// New file: Defines the game objectives
import { addScore, addCoins } from './playerState.js';

// Define simple objectives
// Structure: { id: uniqueId, description: text, reward: { type: 'score'|'coins'|..., amount: number } }
export const OBJECTIVES = [
    {
        id: 'investigate1',
        description: 'Perform your first building investigation.',
        reward: { type: 'score', amount: 25 }
    },
    {
        id: 'paint1',
        description: 'Paint your first building.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'sabotage1',
        description: 'Sabotage your first building.',
        reward: { type: 'score', amount: 15 }
    }
    // Add more objectives later
];

export function applyObjectiveReward(objectiveId) {
    const objective = OBJECTIVES.find(obj => obj.id === objectiveId);
    if (!objective || !objective.reward) {
        console.warn(`No reward defined for objective: ${objectiveId}`);
        return;
    }

    console.log(`Applying reward for objective: ${objectiveId}`, objective.reward);
    switch (objective.reward.type) {
        case 'score':
            addScore(objective.reward.amount);
            break;
        case 'coins':
            addCoins(objective.reward.amount);
            break;
        // Add other reward types later (gems, items, etc.)
        default:
            console.warn(`Unknown reward type: ${objective.reward.type}`);
    }
}
