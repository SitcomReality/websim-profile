import {
    usernameEl,
    descriptionEl,
    avatarEl,
    followersCountEl,
    followingCountEl,
    likesCountEl,
    viewsCountEl,
    projectsGridEl,
    displayProjects,
    aiPromptEl, 
    aiResponseEl,
    setAiResponse
} from './ui.js';
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

        const systemPrompt = `Provide a short response to the following concept. Be concise: Your response must not be more than ~50 words or ~400 characters at maximum (shorter is ideal). You can use <h3>, <ul>/<ol> & <li> and <b>/<i> for formatting (these tags are to be ignored when it comes to the length of your response - they are excluded from word/character count). Most requests will expect text responses but always respond in an appropriate format for the request: a maths formula should look like an example from a textbook with brackets and operation symbols (eg. "f(x) = comedy²"), a recipe should include fraction symbols (eg. "¼ of a cupboard of flowers")`;

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
        if (response.status === 408 || response.statusText === 'AbortError') {
           throw new Error('API request timed out');
        }
        if (response.status >= 400) throw new Error(`Status: ${response.status}`);
        const { user } = await response.json();
        if (!user) throw new Error('no user data returned');
        return user;
    } catch (error) {
        logError(error);
        throw error;
    }
}

async function fetchUserStats(userIdOrUsername) {
    try {
        const response = await fetch(`/api/v1/users/${userIdOrUsername}/stats`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        likesCountEl.textContent = data.stats.total_likes || 0;
        viewsCountEl.textContent = data.stats.total_views || 0;
    } catch (err) {
        console.error('Uncaught error in fetchStats:', {
            error: err.message,
            username: PROFILE_USERNAME,
            timestamp: new Date().toISOString()
        });
    }
}

async function fetchFollowCounts(userIdOrUsername) {
    try {
        const followersResponse = await fetch(`/api/v1/users/${userIdOrUsername}/followers?count=true`);
        if (!followersResponse.ok) throw new Error(`Followers fetch error! status: ${followersResponse.status}`);
        const followersData = await followersResponse.json();
        followersCountEl.textContent = followersData.followers.meta.count || 0;

        const followingResponse = await fetch(`/api/v1/users/${userIdOrUsername}/following?count=true`);
        if (!followingResponse.ok) throw new Error(`Following fetch error! status: ${followingResponse.status}`);
        const followingData = await followingResponse.json();
        followingCountEl.textContent = followingData.following.meta.count || 0;
    } catch (error) {
        console.error('Error fetching follow counts:', error);
        followersCountEl.textContent = 'N/A';
        followingCountEl.textContent = 'N/A';
    }
}

async function fetchUserProjects(username) {
    try {
        const response = await fetch(`/api/v1/users/${username}/projects?posted=true&first=100`); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        displayProjects(data.projects.data);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        projectsGridEl.innerHTML = '<p>Error loading projects.</p>';
    }
}

async function initProfile() {
    try {
        console.log('Initializing profile...');
        const user = await fetchUserProfile(PROFILE_USERNAME);
        usernameEl.textContent = user.username || 'Anonymous';
        descriptionEl.textContent = user.description || 'Face the farce.';

        await Promise.all([
            fetchUserStats(user.id || PROFILE_USERNAME),
            fetchFollowCounts(user.username || PROFILE_USERNAME),
            fetchUserProjects(user.username || PROFILE_USERNAME),
            generateAiText() 
        ]);

    } catch (error) {
        console.error('Profile initialization error', error);
        if (!error.message.includes('API request') && !error.message.includes('HTTP error') && !error.message.includes('Status:')) {
            logError(error);
        }
        if (usernameEl.textContent === 'Loading...') {
            usernameEl.textContent = 'Error';
            descriptionEl.textContent = 'Could not load profile data.';
        }
        if (aiResponseEl && aiResponseEl.textContent === 'Thinking...') {
            aiPromptEl.textContent = 'AI Unavailable';
            aiResponseEl.textContent = 'Could not connect.';
        }

    } finally {
        console.info('Profile initialization attempted');
    }
}

async function logError(error) {
    if (error instanceof Error) {
        console.error(`[${new Date().toISOString()}] ${error.message}`);
    } else {
        console.error(...arguments);
    }
}

export {
    initProfile,
    logError
}