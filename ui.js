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
// Add Notification Area Element
const notificationAreaEl = document.getElementById('notification-area');

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

// Function to trigger visual effects (like screen shake)
function triggerVisualEffect(effectClass, duration = 500) {
    const targetElement = document.body; // Apply to body for screen shake
    if (!targetElement) return;

    targetElement.classList.add(effectClass);
    setTimeout(() => {
        targetElement.classList.remove(effectClass);
    }, duration);
}

// Function to show temporary notifications
function showNotification(message, duration = 3000) { // Default 3 seconds visibility
    if (!notificationAreaEl) {
        console.warn("Notification area element not found.");
        return;
    }

    notificationAreaEl.textContent = message;
    notificationAreaEl.classList.add('visible');
    notificationAreaEl.classList.remove('fade-out'); // Ensure fade-out isn't stuck

    // Clear any existing timeouts to handle rapid notifications
    if (notificationAreaEl.fadeTimeout) clearTimeout(notificationAreaEl.fadeTimeout);
    if (notificationAreaEl.clearTimeout) clearTimeout(notificationAreaEl.clearTimeout);

    // Set timeout to start fading out
    // Fade duration is 0.5s, starts after (duration - 500ms)
    const fadeStartDelay = Math.max(0, duration - 500);
    notificationAreaEl.fadeTimeout = setTimeout(() => {
        notificationAreaEl.classList.add('fade-out');
    }, fadeStartDelay);

    // Set timeout to clear content and hide completely after fade finishes
    notificationAreaEl.clearTimeout = setTimeout(() => {
        notificationAreaEl.textContent = '';
        notificationAreaEl.classList.remove('visible');
        notificationAreaEl.classList.remove('fade-out');
    }, duration);
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
    setupRefreshAiButton,
    triggerVisualEffect,
    showNotification // Export the new function
};