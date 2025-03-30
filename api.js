import {
    usernameEl,
    descriptionEl,
    avatarEl,
    followersCountEl,
    followingCountEl,
    likesCountEl,
    viewsCountEl,
    aiPromptEl,
    aiResponseEl,
    setAiResponse,
    setupRefreshAiButton
} from './ui.js';
import { displayProjects } from './game-systems/gameBoardUI.js';
import { PROFILE_USERNAME, API_TIMEOUT } from './config.js';
import { CONTEXT_TERMS } from './context_terms.js';
import { ADJECTIVE_TERMS } from './adjective_terms.js';
import { NOUN_TERMS } from './noun_terms.js';

function getRandomElement(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generateAiText() {
    if (!aiPromptEl || !aiResponseEl) {
        console.error("AI text elements not found.");
        return;
    }

    try {
        const context = getRandomElement(CONTEXT_TERMS);
        const adjective = getRandomElement(ADJECTIVE_TERMS);
        const noun = getRandomElement(NOUN_TERMS);

        const userPrompt = `${context} ${adjective} ${noun}`;
        aiPromptEl.textContent = `AI Prompt: "${userPrompt}"`;
        aiResponseEl.textContent = 'Thinking...';

        const systemPrompt = `Provide a short response to the following concept. Be concise: Your response must not be more than ~50 words or ~400 characters at maximum (shorter is ideal). You can use <h3>, <br>, <ul>/<ol> & <li> and <b>/<i> for formatting (these tags are to be ignored when it comes to the length of your response - they are excluded from word/character count). Most requests will expect text responses but always respond in an appropriate format for the request: a maths formula should look like an example from a textbook with brackets and operation symbols (eg. "f(x) = comedy²"), a recipe should include fraction symbols (eg. "¼ of a cupboard of flowers")`;

        let conversationHistory = [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }];

        const completion = await window.websim.chat.completions.create({
            messages: conversationHistory,
        });

        if (completion && completion.content) {
            setAiResponse(completion.content);
        } else {
            throw new Error("AI did not return content.");
        }

    } catch (error) {
        console.error('Error generating AI text:', error);
        logError(error);
        aiResponseEl.textContent = 'Error generating response.';
        if (aiPromptEl.textContent === 'Generating prompt...') {
            aiPromptEl.textContent = 'Failed to generate prompt.';
        }
    }
}

async function fetchUserProfile(username) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
        const response = await fetch(`/api/v1/users/${username}`, {
            signal: controller.signal
        });
        clearTimeout(timer);
        if (response.status === 408 || controller.signal.aborted) {
           throw new Error('API request timed out or aborted');
        }
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const { user } = await response.json();
        if (!user) throw new Error('no user data returned');
        return user;
    } catch (error) {
        logError(error);
        throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
}

async function fetchUserStats(userIdOrUsername) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
        const response = await fetch(`/api/v1/users/${userIdOrUsername}/stats`, {
            signal: controller.signal
        });
        clearTimeout(timer);
        if (response.status === 408 || controller.signal.aborted) {
           throw new Error('API request timed out or aborted');
        }
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (likesCountEl) likesCountEl.textContent = data.stats.total_likes || 0;
        if (viewsCountEl) viewsCountEl.textContent = data.stats.total_views || 0;
    } catch (err) {
        logError(err);
        if (likesCountEl) likesCountEl.textContent = 'N/A';
        if (viewsCountEl) viewsCountEl.textContent = 'N/A';
        throw new Error(`Failed to fetch user stats: ${err.message}`);
    }
}

async function fetchFollowCounts(userIdOrUsername) {
    try {
        const followersController = new AbortController();
        const followersTimer = setTimeout(() => followersController.abort(), API_TIMEOUT);
        const followersResponse = await fetch(`/api/v1/users/${userIdOrUsername}/followers?count=true`, {
             signal: followersController.signal
        });
        clearTimeout(followersTimer);
        if (followersResponse.status === 408 || followersController.signal.aborted) {
           throw new Error('Followers API request timed out or aborted');
        }
        if (!followersResponse.ok) throw new Error(`Followers fetch error! status: ${followersResponse.status}`);
        const followersData = await followersResponse.json();
        if (followersCountEl) followersCountEl.textContent = followersData.followers.meta.count || 0;

        const followingController = new AbortController();
        const followingTimer = setTimeout(() => followingController.abort(), API_TIMEOUT);
        const followingResponse = await fetch(`/api/v1/users/${userIdOrUsername}/following?count=true`, {
             signal: followingController.signal
        });
        clearTimeout(followingTimer);
         if (followingResponse.status === 408 || followingController.signal.aborted) {
           throw new Error('Following API request timed out or aborted');
        }
        if (!followingResponse.ok) throw new Error(`Following fetch error! status: ${followingResponse.status}`);
        const followingData = await followingResponse.json();
        if (followingCountEl) followingCountEl.textContent = followingData.following.meta.count || 0;

    } catch (error) {
        logError(error);
        if (followersCountEl) followersCountEl.textContent = 'N/A';
        if (followingCountEl) followingCountEl.textContent = 'N/A';
        throw new Error(`Failed to fetch follow counts: ${error.message}`);
    }
}

async function fetchUserProjects(username) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_TIMEOUT + 2000);
        const response = await fetch(`/api/v1/users/${username}/projects?posted=true&first=50`, {
            signal: controller.signal
        });
        clearTimeout(timer);
         if (response.status === 408 || controller.signal.aborted) {
           throw new Error('Projects API request timed out or aborted');
        }
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const validProjects = data.projects.data.filter(p => p.project && p.project_revision);
        displayProjects(validProjects);
    } catch (error) {
        logError(error);
        console.error("Error rendering game board through gameBoardUI.js");
        throw new Error(`Failed to fetch user projects: ${error.message}`);
    }
}

async function initProfile() {
    const gameBoardEl = document.getElementById('city-scape');
    try {
        console.log('Initializing profile...');
        if (!usernameEl || !descriptionEl) {
           throw new Error("Core profile UI elements not found.");
        }
        usernameEl.textContent = 'Loading...';
        if (gameBoardEl) gameBoardEl.innerHTML = '<p>Loading board...</p>';

        const user = await fetchUserProfile(PROFILE_USERNAME);
        usernameEl.textContent = user.username || 'Anonymous';
        descriptionEl.textContent = user.description || 'Face the farce.';
        const userIdForStats = user.id || PROFILE_USERNAME;
        const usernameForProjects = user.username || PROFILE_USERNAME;

        await Promise.allSettled([
            fetchUserStats(userIdForStats),
            fetchFollowCounts(usernameForProjects),
            fetchUserProjects(usernameForProjects),
            generateAiText()
        ]);

        console.log('Profile initialized successfully.');

    } catch (error) {
        console.error('Profile initialization failed:', error.message);
        logError(error);

        if (usernameEl && usernameEl.textContent === 'Loading...') {
            usernameEl.textContent = 'Error Loading Profile';
        }
         if (descriptionEl) descriptionEl.textContent = 'Could not load profile data. Please try refreshing.';
         if (followersCountEl) followersCountEl.textContent = 'N/A';
         if (followingCountEl) followingCountEl.textContent = 'N/A';
         if (likesCountEl) likesCountEl.textContent = 'N/A';
         if (viewsCountEl) viewsCountEl.textContent = 'N/A';
         if (gameBoardEl && gameBoardEl.innerHTML.includes('Loading board...')) {
             gameBoardEl.innerHTML = '<p>Failed to load game board.</p>';
         }
         if (aiResponseEl && aiResponseEl.textContent === 'Thinking...') {
             if (aiPromptEl) aiPromptEl.textContent = 'AI Unavailable';
             aiResponseEl.textContent = 'Could not connect.';
         }
    }
}

async function logError(error) {
    const timestamp = new Date().toISOString();
    if (error instanceof Error) {
        console.error(`[${timestamp}] Error: ${error.message}\nStack: ${error.stack}`);
    } else if (typeof error === 'string') {
        console.error(`[${timestamp}] Error: ${error}`);
    } else {
        console.error(`[${timestamp}] Unknown Error:`, error);
    }
}

export {
    initProfile,
    logError,
    generateAiText
}