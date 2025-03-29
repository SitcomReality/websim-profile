import {
    usernameEl,
    descriptionEl,
    avatarEl,
    followersCountEl,
    followingCountEl,
    likesCountEl,
    viewsCountEl,
    projectsGridEl,
    displayProjects
} from './ui.js';
import { PROFILE_USERNAME, API_TIMEOUT } from './config.js';

async function fetchUserProfile(username) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
        const response = await fetch(`/api/v1/users/${username}`, {
            signal: controller.signal
        });
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
        // Fetch followers count
        const followersResponse = await fetch(`/api/v1/users/${userIdOrUsername}/followers?count=true`);
        if (!followersResponse.ok) throw new Error(`Followers fetch error! status: ${followersResponse.status}`);
        const followersData = await followersResponse.json();
        followersCountEl.textContent = followersData.followers.meta.count || 0;

        // Fetch following count
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
        // Fetch only *posted* projects for the profile display
        const response = await fetch(`/api/v1/users/${username}/projects?posted=true&first=100`); // Fetch more initially if needed
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

      /*
        if (user.avatar_url && avatarEl) {
            avatarEl.src = `https://images.websim.ai/avatar/${user.username}`;
            avatarEl.alt = `${user.username}'s avatar`;
        }
*/
        await fetchUserStats(user.id || PROFILE_USERNAME);
        await fetchFollowCounts(user.username || PROFILE_USERNAME);
        await fetchUserProjects(user.username || PROFILE_USERNAME);
    } catch (error) {
        console.error('Profile initialization error', error);
        logError(error);
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