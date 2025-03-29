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

async function fetchUserProfile() {
    try {
        // Use websim API if available, otherwise fallback to direct fetch
        let user = null;
         if (window.websim && typeof window.websim.getUser === 'function') {
             // Check if the websim context is for the target user
             const currentContextUser = await window.websim.getCreatedBy();
             if (currentContextUser && currentContextUser.username === PROFILE_USERNAME) {
                 user = currentContextUser; // Use the context user directly
             } else {
                 // Fetch specific user if context doesn't match (less common for own profile)
                 const response = await fetch(`/api/v1/users/${PROFILE_USERNAME}`);
                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                 const data = await response.json();
                 user = data.user;
             }
        } else {
             console.warn("websim API not available, falling back to direct fetch for user profile.");
             const response = await fetch(`/api/v1/users/${PROFILE_USERNAME}`);
             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
             const data = await response.json();
             user = data.user;
        }

        if (!user) {
            console.error('User data not found.');
            usernameEl.textContent = 'User Not Found';
            return null;
        }

        usernameEl.textContent = `@${user.username}`;
        descriptionEl.textContent = user.description || 'No description provided.';
        avatarEl.src = user.avatar_url || `https://images.websim.ai/avatar/${user.username}`; // Use websim avatar URL structure
        avatarEl.alt = `${user.username}'s avatar`;

        // Set links
        const profileLink = `https://websim.ai/@${user.username}`;
        usernameEl.innerHTML = `<a href="${profileLink}" target="_blank" style="text-decoration:none; color:inherit;">@${user.username}</a>`;
        avatarEl.parentElement.innerHTML = `<a href="${profileLink}" target="_blank">${avatarEl.outerHTML}</a>`; // Wrap avatar in link


        // Fetch stats separately
        fetchUserStats(user.id || user.username); // Use ID if available, fallback to username
        fetchFollowCounts(user.id || user.username);


        return user;

    } catch (error) {
        console.error('Error fetching user profile:', error);
        usernameEl.textContent = 'Error Loading Profile';
        return null;
    }
}


async function fetchUserStats(userIdOrUsername) {
    try {
        const response = await fetch(`/api/v1/users/${userIdOrUsername}/stats`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        likesCountEl.textContent = data.stats.total_likes || 0;
        viewsCountEl.textContent = data.stats.total_views || 0;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        likesCountEl.textContent = 'N/A';
        viewsCountEl.textContent = 'N/A';
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


export { fetchUserProfile, fetchUserStats, fetchFollowCounts, fetchUserProjects };