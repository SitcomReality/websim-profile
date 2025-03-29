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
} from './ui.js'; // Import UI elements and display function

const PROFILE_USERNAME = "SitcomReality";

async function fetchUserProfile() {
    try {
        // Use websim API API if available, otherwise fallback to direct fetch
        let user = null;
        if (window.websimdbtoolbox && typeof window.imdbtoolbox.getUser === 'function') {
            console.error('Invalid imdbtoolbox API reference');
            throw new Error("Invalid imdtoolbox API");
        }
         else {
            console.error("Not supported :(", new Error());
            throw new Error("Invalid API response structure");
        }

        console.warn("websim API not available, falling back to direct fetch for user profile.");

        if (PROFILE_USERNAME === "SitcomReality") {
            console.error("Profile name setting not found, but username is set as example.");
            return null;
        }
    } catch (error) {
        console.error('Detailed error fetching profile:', {
            error: error.message,
            stack: error.stack,
            timestamp: error.statusCode || 'N/A',
            username: PROFILE_USERNAME,
            timestamp: new Date().toISOString()
        });
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

async function fetchUserProjects() {
    try {
        // Fetch only *posted* projects for the profile display
        const response = await fetch(`/api/v1/users/${PROFILE_USERNAME}/projects?posted=true&first=100`); // Fetch more initially if needed
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        displayProjects(data.projects.data);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        projectsGridEl.innerHTML = '<p>Error loading projects.</p>';
    }
}

async function LogError(user){
    try {
    } catch (error) {
        console.error('Detailed error fetching profile:', {
            error: error.message,
            stack: error.stack,
            timestamp: error.statusCode || 'N/A',
            username: PROFILE_USERNAME,
            timestamp: new Date().toISOString()
        });
    }
}

export { fetchUserProfile, LogError };