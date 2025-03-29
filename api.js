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

async function fetchUserProfile(username) {
    try {
        let user = null;
         if (window.websim && typeof window.websim.getUser === 'function') {
             const currentContextUser = await window.websim.getCreatedBy();
             if (currentContextUser && currentContextUser.username === username) {
                 user = currentContextUser;
             } else {
                 const response = await fetch(`/api/v1/users/${username}`);
                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                 const data = await response.json();
                 user = data.user;
             }
        } else {
             console.warn("websim API not available, falling back to direct fetch for user profile.");
             const response = await fetch(`/api/v1/users/${username}`);
             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
             const data = await response.json();
             user = data.user;
        }

        if (!user) {
            console.error('User data not found.');
            if (usernameEl) usernameEl.textContent = 'User Not Found';
            return null;
        }

        if (usernameEl) usernameEl.textContent = `@${user.username}`;
        if (descriptionEl) descriptionEl.textContent = user.description || 'No description provided.';
        if (avatarEl) {
            avatarEl.src = user.avatar_url || `https://images.websim.ai/avatar/${user.username}`;
            avatarEl.alt = `${user.username}'s avatar`;
        }

        // Set links
        const profileLink = `https://websim.ai/@${user.username}`;
        if (usernameEl) usernameEl.innerHTML = `<a href="${profileLink}" target="_blank" style="text-decoration:none; color:inherit;">@${user.username}</a>`;
        if (avatarEl && avatarEl.parentElement) avatarEl.parentElement.innerHTML = `<a href="${profileLink}" target="_blank">${avatarEl.outerHTML}</a>`;


        // Fetch stats separately
        fetchUserStats(user.id || user.username);
        fetchFollowCounts(user.id || user.username);


        return user;

    } catch (error) {
        console.error('Error fetching user profile:', error);
        if (usernameEl) usernameEl.textContent = 'Error Loading Profile';
        return null;
    }
}


async function fetchUserStats(userIdOrUsername) {
    try {
        const response = await fetch(`/api/v1/users/${userIdOrUsername}/stats`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (likesCountEl) likesCountEl.textContent = data.stats.total_likes || 0;
        if (viewsCountEl) viewsCountEl.textContent = data.stats.total_views || 0;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        if (likesCountEl) likesCountEl.textContent = 'N/A';
        if (viewsCountEl) viewsCountEl.textContent = 'N/A';
    }
}

async function fetchFollowCounts(userIdOrUsername) {
     try {
        const followersResponse = await fetch(`/api/v1/users/${userIdOrUsername}/followers?count=true`);
        if (!followersResponse.ok) throw new Error(`Followers fetch error! status: ${followersResponse.status}`);
        const followersData = await followersResponse.json();
       if (followersCountEl) followersCountEl.textContent = followersData.followers.meta.count || 0;

        const followingResponse = await fetch(`/api/v1/users/${userIdOrUsername}/following?count=true`);
         if (!followingResponse.ok) throw new Error(`Following fetch error! status: ${followingResponse.status}`);
        const followingData = await followingResponse.json();
        if (followingCountEl) followingCountEl.textContent = followingData.following.meta.count || 0;

    } catch (error) {
        console.error('Error fetching follow counts:', error);
        if (followersCountEl) followersCountEl.textContent = 'N/A';
        if (followingCountEl) followingCountEl.textContent = 'N/A';
    }
}


async function fetchUserProjects(username) {
    try {
        const response = await fetch(`/api/v1/users/${username}/projects?posted=true&first=100`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        displayProjects(data.projects.data); // Call display function from ui.js
    } catch (error) {
        console.error('Error fetching user projects:', error);
       if (projectsGridEl) projectsGridEl.innerHTML = '<p>Error loading projects.</p>';
    }
}

export { fetchUserProfile, fetchUserStats, fetchFollowCounts, fetchUserProjects };