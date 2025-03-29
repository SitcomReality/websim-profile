// --- DOM Elements ---
const usernameEl = document.getElementById('username');
const descriptionEl = document.getElementById('description');
const avatarEl = document.getElementById('avatar');
const followersCountEl = document.getElementById('followers-count');
const followingCountEl = document.getElementById('following-count');
const likesCountEl = document.getElementById('likes-count');
const viewsCountEl = document.getElementById('views-count');
const projectsGridEl = document.getElementById('projects-grid');
// Add AI text elements
const aiPromptEl = document.getElementById('ai-prompt');
const aiResponseEl = document.getElementById('ai-response');
const refreshAiButtonEl = document.getElementById('refresh-ai-button');

// --- Project Display ---
function displayProjects(projectsData) {
    if (aiResponseEl) {
        aiResponseEl.innerHTML = 'Thinking...';
    }
    if (!projectsGridEl) return; // Exit if grid element doesn't exist
    projectsGridEl.innerHTML = ''; // Clear previous projects

    if (!projectsData || projectsData.length === 0) {
        projectsGridEl.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projectsData.forEach(({ project, project_revision, site }, index) => { // Added index
        if (!project || !project_revision) return; // Skip if essential data is missing

        const card = document.createElement('div');
        card.classList.add('project-card');
        card.dataset.projectId = project.id; // Store ID for potential interactions

        const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.ai/v1/site/${site.id}/600` : 'placeholder.png');
        const projectUrl = `https://websim.ai/p/${project.id}`;
        const siteUrl = site ? `https://websim.ai/c/${site.id}` : projectUrl; // Link to site if available, else project

        card.innerHTML = `
            <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: contents;">
                <img src="${thumbnailUrl}" alt="${project.title || 'Project Thumbnail'}" class="project-thumbnail" loading="lazy" onerror="this.onerror=null; this.src='placeholder.png';">
                <div class="project-info">
                    <div>
                      <h3>${project.title || 'Untitled Project'}</h3>
                      <p class="project-description">${project.description || 'No description available.'}</p>
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
            </a>
        `;

        // Add subtle entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        projectsGridEl.appendChild(card);

        // Trigger animation after append
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index); // Use index for stagger

        // Game interface style click handler
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.project-card.selected').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            // Optional: setTimeout(() => window.open(siteUrl, '_blank'), 200);
        });
    });

     // Add placeholder image and selected card CSS (if not already in style.css)
     // Check if style already exists to avoid duplicates
     if (!document.getElementById('project-card-styles')) {
        const style = document.createElement('style');
        style.id = 'project-card-styles';
        style.textContent = `
            img[src="placeholder.png"] {
                background-color: #eee; /* Placeholder background */
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23cccccc' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            }
            .project-card.selected {
                outline: 3px solid var(--secondary-color); /* Use CSS variable */
                outline-offset: -3px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); /* Enhanced shadow on select */
            }
        `;
        document.head.appendChild(style);
     }
}

function setAiResponse(content) {
    if (!aiResponseEl) return;
    
    // Create a temporary div to safely parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Clear existing content
    aiResponseEl.innerHTML = '';
    
    // Append all child nodes, which will render HTML tags
    while (tempDiv.firstChild) {
        aiResponseEl.appendChild(tempDiv.firstChild);
    }
}

// Add event listener for refresh AI button
import { generateAiText } from './api.js'; // Import generateAiText from api.js

function setupRefreshAiButton() {
    if (refreshAiButtonEl) {
        refreshAiButtonEl.addEventListener('click', async () => {
            try {
                await generateAiText(); // Now correctly referencing the imported function
            } catch (error) {
                console.error('Error refreshing AI text:', error);
                aiPromptEl.textContent = 'Refresh Failed';
                aiResponseEl.textContent = 'Could not generate new text.';
            }
        });
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', setupRefreshAiButton);

// Export necessary elements and functions
export {
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
    refreshAiButtonEl,
    setAiResponse,
    setupRefreshAiButton
};