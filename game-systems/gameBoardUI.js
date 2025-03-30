/* New file */
import { getIcon } from './icons.js';

// --- DOM Elements ---
const gameBoardEl = document.getElementById('city-scape');

// --- Board/Project Display ---

// Helper to generate HTML for a project card within a board space
function createProjectCardHTML(project, project_revision, site) {
    const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.ai/v1/site/${site.id}/600` : 'placeholder.png');
    const projectUrl = `https://websim.ai/p/${project.id}`;
    const siteUrl = site ? `https://websim.ai/c/${site.id}` : projectUrl;

    return `
        <div class="project-card" data-project-id="${project.id}">
            <img src="${thumbnailUrl}" alt="${project.title || 'Project Thumbnail'}" class="project-thumbnail" loading="lazy" onerror="this.onerror=null; this.src='placeholder.png';">
            <a href="${siteUrl}" target="_blank" class="project-link-button" title="Open Project/Site">
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
                        ${project.stats.views || 0}
                    </span>
                    <span>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ${project.stats.likes || 0}
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                        ${project.stats.comments || 0}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function displayProjects(projectsData) {
    if (!gameBoardEl) {
        console.error("Game board element not found!");
        return;
    }
    gameBoardEl.innerHTML = '';

    const numProjects = projectsData ? projectsData.length : 0;
    const numSpaces = 32;
    const projectIndices = new Array(numSpaces).fill(null);

    if (numProjects > 0) {
        const step = numSpaces / numProjects;
        let projectsPlaced = 0;
        for (let i = 0; i < numProjects && projectsPlaced < numSpaces; i++) {
            let targetIndex = Math.floor(i * step);

            for (let j = 0; j < numSpaces; j++) {
                let checkIndex = (targetIndex + j) % numSpaces;
                if (projectIndices[checkIndex] === null) {
                    projectIndices[checkIndex] = i;
                    projectsPlaced++;
                    break;
                }
            }
            if (!projectsPlaced) console.warn(`Could not place project ${i} on the board.`);
        }
    }

    for (let spaceIndex = 0; spaceIndex < numSpaces; spaceIndex++) {
        const spaceDiv = document.createElement('div');
        spaceDiv.classList.add('board-space');
        spaceDiv.dataset.spaceIndex = spaceIndex;

        const projectIndex = projectIndices[spaceIndex];

        if (projectIndex !== null && projectIndex < numProjects) {
            const { project, project_revision, site } = projectsData[projectIndex];
            if (!project || !project_revision) {
                spaceDiv.classList.add('empty-space');
                spaceDiv.innerHTML = `<span class="space-number">${spaceIndex + 1}</span><span class="error-text">Data Error</span>`;
                console.warn(`Missing data for project index ${projectIndex} on space ${spaceIndex}`);
            } else {
                spaceDiv.innerHTML = createProjectCardHTML(project, project_revision, site);
                spaceDiv.classList.add('occupied-space');
                spaceDiv.style.setProperty('--animation-delay', `${(spaceIndex * 0.05)}s`);
            }
        } else {
            spaceDiv.classList.add('empty-space');
            spaceDiv.innerHTML = `<span class="space-number">${spaceIndex + 1}</span>`;
        }
        gameBoardEl.appendChild(spaceDiv);
    }

    // Ensure placeholder and animation styles exist (could be moved to CSS eventually)
    if (!document.getElementById('placeholder-style')) {
        const style = document.createElement('style');
        style.id = 'placeholder-style';
        style.textContent = `
            img[src="placeholder.png"] {
                background-color: #eee;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23cccccc' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                display: flex;
                align-items: center;
                justify-content: center;
                color: #aaa;
                font-size: 0.8em;
            }
            img[src="placeholder.png"]::after {
                content: 'No Image';
            }
            .board-space.occupied-space {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                animation: popIn 0.5s ease forwards;
                animation-delay: var(--animation-delay, 0s);
            }
            @keyframes popIn {
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Export necessary functions
export { displayProjects };