/* New file */
import { getIcon } from './icons.js';

// --- DOM Elements ---
const cityScapeEl = document.getElementById('city-scape'); // Renamed from gameBoardEl

// --- City/Project Display ---

// Helper to generate HTML for a project card within a city object
function createProjectCardHTML(project, project_revision, site) {
    const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.ai/v1/site/${site.id}/600` : 'placeholder.png');
    // Use project URL for the link, as site might not always exist
    const projectUrl = `https://websim.ai/p/${project.id}`;
    const displayUrl = site ? `https://websim.ai/c/${site.id}` : projectUrl;

    return `
        <div class="project-card" data-project-id="${project.id}">
            <img src="${thumbnailUrl}" alt="${project.title || 'Project Thumbnail'}" class="project-thumbnail" loading="lazy" onerror="this.onerror=null; this.src='placeholder.png';">
            <a href="${displayUrl}" target="_blank" class="project-link-button" title="Open Project/Site">
                ${getIcon('externalLink')}
            </a>
            <div class="project-info">
                <div>
                    <h3>${project.title || 'Untitled Project'}</h3>
                    <p class="project-description">${project.description || 'No description.'}</p>
                </div>
                <div class="project-stats">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        ${project.stats?.views ?? 0}
                    </span>
                    <span>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ${project.stats?.likes ?? 0}
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                        ${project.stats?.comments ?? 0}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Renamed function to reflect new purpose
function displayCityScape(projectsData) {
    if (!cityScapeEl) {
        console.error("City scape element not found!");
        return;
    }
    cityScapeEl.innerHTML = ''; // Clear previous content

    if (!projectsData || projectsData.length === 0) {
        cityScapeEl.innerHTML = '<p>No city objects to display.</p>'; // Handle empty data
        return;
    }

    // Remove board distribution logic - simply iterate and append
    projectsData.forEach((projectItem, index) => {
        const { project, project_revision, site } = projectItem;

        if (!project || !project_revision) {
            console.warn(`Missing data for project index ${index}. Skipping.`);
            // Optionally render an error placeholder object
            // const errorDiv = document.createElement('div');
            // errorDiv.classList.add('city-object', 'error-object'); // Add specific error class if needed
            // errorDiv.innerHTML = `<p>Data Error</p>`;
            // errorDiv.style.setProperty('--animation-delay', `${(index * 0.05)}s`);
            // cityScapeEl.appendChild(errorDiv);
            return; // Skip this iteration
        }

        const cityObjectDiv = document.createElement('div');
        cityObjectDiv.classList.add('city-object');
        cityObjectDiv.innerHTML = createProjectCardHTML(project, project_revision, site);
        // Set animation delay based on index for staggered entry
        cityObjectDiv.style.setProperty('--animation-delay', `${(index * 0.05)}s`);

        cityScapeEl.appendChild(cityObjectDiv);
    });

    // Remove the style injection - ensure styles are in CSS
}

// Export necessary functions
export { displayCityScape }; // Updated export name