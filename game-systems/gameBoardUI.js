import { getIcon } from './icons.js';
// Import the function to update player state
import { setSelectedBuilding } from './playerState.js';

// --- DOM Elements ---
const cityScapeEl = document.getElementById('city-scape');

// Helper to generate HTML for a project card within a city object
function createProjectCardHTML(project, project_revision, site) {
    const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.ai/v1/site/${site.id}/600` : 'placeholder.png');
    // Use project URL for the link, as site might not always exist
    const projectUrl = `https://websim.ai/p/${project.id}`;
    const displayUrl = site ? `https://websim.ai/c/${site.id}` : projectUrl;
    const views = project.stats?.views ?? 0;
    const likes = project.stats?.likes ?? 0;
    const comments = project.stats?.comments ?? 0;

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
                        ${views}
                    </span>
                    <span>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ${likes}
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                        ${comments}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Function to update the visual highlight based on selected ID
function updateBuildingSelectionHighlight(selectedId) {
    if (!cityScapeEl) return;
    const cityObjects = cityScapeEl.querySelectorAll('.city-object');
    cityObjects.forEach(obj => {
        const projectId = obj.dataset.projectId;
        if (projectId && projectId === selectedId) {
            obj.classList.add('selected');
        } else {
            obj.classList.remove('selected');
        }
    });
}
// Expose the highlight function globally for playerState to call
window.updateBuildingSelectionHighlight = updateBuildingSelectionHighlight;

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

    projectsData.forEach((projectItem, index) => {
        const { project, project_revision, site } = projectItem;

        if (!project || !project_revision || !project.stats) {
            console.warn(`Missing data or stats for project index ${index}. Skipping.`);
            return;
        }

        const cityObjectDiv = document.createElement('div');
        cityObjectDiv.classList.add('city-object');
        // Store project ID for selection logic
        cityObjectDiv.dataset.projectId = project.id;
        cityObjectDiv.innerHTML = createProjectCardHTML(project, project_revision, site);

        // --- Add Click Listener ---
        cityObjectDiv.addEventListener('click', (event) => {
            // Prevent selection if the link button itself was clicked
            if (event.target.closest('.project-link-button')) {
                return;
            }
            setSelectedBuilding(project.id); // Call playerState function
        });
        // --- End Click Listener ---

        const views = project.stats.views ?? 0;
        const baseHeightFactor = Math.log10(views + 1) / 2.5 + 0.5;
        const heightFactor = Math.max(0.6, Math.min(2.5, baseHeightFactor));
        cityObjectDiv.style.setProperty('--building-height-factor', heightFactor);
        cityObjectDiv.style.setProperty('--animation-delay', `${(index * 0.05)}s`);

        cityScapeEl.appendChild(cityObjectDiv);
    });

    // Initial highlight check in case state is loaded with a selection
    // This requires playerState to be initialized before displayCityScape runs
    // (Which it should be based on current initProfile logic)
    try {
        const { getPlayerState } = await import('./playerState.js');
        const initialState = getPlayerState();
        if (initialState.selectedBuildingId) {
            updateBuildingSelectionHighlight(initialState.selectedBuildingId);
        }
    } catch (e) {
        console.error("Could not get initial player state for selection highlight:", e);
    }
}

export { displayCityScape, updateBuildingSelectionHighlight };