import { getIcon } from './icons.js';
// Import the function to update player state
import { setSelectedBuilding, getPlayerState } from './playerState.js'; 
import { updateSelectedBuildingInfo } from './gameUI.js'; 

// --- DOM Elements ---
const cityScapeEl = document.getElementById('city-scape');
const selectedBuildingInfoPanelEl = document.getElementById('selected-building-info-panel');

// Helper to generate HTML for a 3D building based on project data
function createBuildingHTML(project, project_revision, site) {
    const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.ai/v1/site/${site.id}/600` : 'placeholder.png');
    const projectUrl = `https://websim.ai/p/${project.id}`;
    const displayUrl = site ? `https://websim.ai/c/${site.id}` : projectUrl;
    const views = project.stats?.views ?? 0;
    const likes = project.stats?.likes ?? 0;
    const comments = project.stats?.comments ?? 0;
    const buildingId = project.id;

    // Calculate a subtle color variation based on project ID for visual diversity
    // Simple hash function to get a value between 0 and 1
    let hash = 0;
    for (let i = 0; i < buildingId.length; i++) {
        hash = buildingId.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }
    const colorVariation = Math.abs(hash % 100) / 100; // Value 0 to 0.99

    // Base color for sides/top - slightly darker than the board space bg
    const baseSideColor = 'hsl(240, 10%, 15%)';
    // Vary lightness based on hash
    const sideLightness = 12 + (colorVariation * 10); // Range 12% to 22%
    const topLightness = 20 + (colorVariation * 15); // Range 20% to 35%

    const sideColor = `hsl(240, 10%, ${sideLightness.toFixed(0)}%)`;
    const topColor = `hsl(240, 10%, ${topLightness.toFixed(0)}%)`;

    // Calculate width variation factor (Phase 7.4)
    const widthVariationFactor = 0.85 + (colorVariation * 0.3); // Range 0.85 to 1.15


    return `
        <div class="building-face building-face-front">
            <img src="${thumbnailUrl}" alt="${project.title || 'Project Thumbnail'}" class="project-thumbnail" loading="lazy" onerror="this.onerror=null; this.src='placeholder.png';">
             <a href="${displayUrl}" target="_blank" class="project-link-button" title="Open Project/Site" data-building-link="${buildingId}">
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
        <div class="building-face building-face-top" style="background-color: ${topColor};"></div>
        <div class="building-face building-face-left" style="background-color: ${sideColor};"></div>
    `;
}

// Function to update the visual highlight based on selected ID
function updateBuildingSelectionHighlight(selectedId) {
    if (!cityScapeEl) return;
    const cityObjects = cityScapeEl.querySelectorAll('.city-object');
    let selectedElement = null;

    cityObjects.forEach(obj => {
        const projectId = obj.dataset.projectId;
        if (projectId && projectId === selectedId) {
            obj.classList.add('selected');
            selectedElement = obj; 
        } else {
            obj.classList.remove('selected');
        }
    });

    // --- Scroll into View ---
    if (selectedElement) {
        selectedElement.scrollIntoView({
            behavior: 'smooth', 
            block: 'nearest',   
            inline: 'center'    
        });
        console.log(`Scrolled to center building: ${selectedId}`);
    }
    // --- End Scroll into View ---
}

async function displayCityScape(projectsData) {
    if (!cityScapeEl) {
        console.error("City scape element not found!");
        return;
    }
    cityScapeEl.innerHTML = ''; 

    if (!projectsData || projectsData.length === 0) {
        cityScapeEl.innerHTML = '<p>No city objects to display.</p>'; 
        if (selectedBuildingInfoPanelEl) selectedBuildingInfoPanelEl.innerHTML = ''; 
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
        cityObjectDiv.dataset.projectId = project.id;
        cityObjectDiv.dataset.title = project.title || 'Untitled Project';
        cityObjectDiv.dataset.description = project.description || 'No description.';
        cityObjectDiv.dataset.views = project.stats.views ?? 0;
        cityObjectDiv.dataset.likes = project.stats.likes ?? 0;
        cityObjectDiv.dataset.comments = project.stats.comments ?? 0;
        cityObjectDiv.dataset.link = site ? `https://websim.ai/c/${site.id}` : `https://websim.ai/p/${project.id}`;

        // Generate the 3D building HTML
        cityObjectDiv.innerHTML = createBuildingHTML(project, project_revision, site);

        // Add click listener to the main city object, not just the card
        cityObjectDiv.addEventListener('click', (event) => {
            // Prevent selection if the external link button was clicked
             if (event.target.closest('.project-link-button')) {
                console.log("Link button clicked, preventing selection.");
                return;
            }

            const clickedProjectId = cityObjectDiv.dataset.projectId;
            const projectData = {
                id: clickedProjectId,
                title: cityObjectDiv.dataset.title,
                description: cityObjectDiv.dataset.description,
                views: parseInt(cityObjectDiv.dataset.views, 10),
                likes: parseInt(cityObjectDiv.dataset.likes, 10),
                comments: parseInt(cityObjectDiv.dataset.comments, 10),
                link: cityObjectDiv.dataset.link
            };

            setSelectedBuilding(clickedProjectId, projectData); 

            updateBuildingSelectionHighlight(getPlayerState().selectedBuildingId);
        });

        const views = project.stats.views ?? 0;
        // Keep height calculation based on views for now
        const baseHeightFactor = Math.log10(views + 1) / 2.5 + 0.5;
        const heightFactor = Math.max(0.6, Math.min(2.5, baseHeightFactor));
        cityObjectDiv.style.setProperty('--building-height-factor', heightFactor);
        cityObjectDiv.style.setProperty('--animation-delay', `${(index * 0.05)}s`);

        cityScapeEl.appendChild(cityObjectDiv);
    });

    const initialState = getPlayerState();
    if (initialState.selectedBuildingId) {
        updateBuildingSelectionHighlight(initialState.selectedBuildingId);
    }
    // Use the globally available update function
    updateSelectedBuildingInfo(initialState.selectedBuildingData);
}

export { displayCityScape, updateBuildingSelectionHighlight };