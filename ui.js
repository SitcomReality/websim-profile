import { getIcon } from './game-systems/icons.js'; 
import { generateAiText } from './api.js'; 

// --- DOM Elements ---
const usernameEl = document.getElementById('username');
const descriptionEl = document.getElementById('description');
const avatarEl = document.getElementById('avatar');
const followersCountEl = document.getElementById('followers-count');
const followingCountEl = document.getElementById('following-count');
const likesCountEl = document.getElementById('likes-count');
const viewsCountEl = document.getElementById('views-count');
// Add AI text elements
const aiPromptEl = document.getElementById('ai-prompt');
const aiResponseEl = document.getElementById('ai-response');
const refreshAiButtonEl = document.getElementById('refresh-ai-button');

function setAiResponse(content) {
    if (!aiResponseEl) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    aiResponseEl.innerHTML = '';
    while (tempDiv.firstChild) {
        aiResponseEl.appendChild(tempDiv.firstChild);
    }
}

function setupRefreshAiButton() {
    if (refreshAiButtonEl) {
        refreshAiButtonEl.addEventListener('click', async () => {
            try {
                await generateAiText(); 
            } catch (error) {
                console.error('Error refreshing AI text:', error);
                if (aiPromptEl) aiPromptEl.textContent = 'Refresh Failed';
                if (aiResponseEl) aiResponseEl.textContent = 'Could not generate new text.';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', setupRefreshAiButton);

export {
    usernameEl,
    descriptionEl,
    avatarEl,
    followersCountEl,
    followingCountEl,
    likesCountEl,
    viewsCountEl,
    aiPromptEl,
    aiResponseEl,
    refreshAiButtonEl,
    setAiResponse,
    setupRefreshAiButton
};