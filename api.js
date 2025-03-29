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

export function initProfile() {
    usernameEl.textContent = 'aL';
    descriptionEl.textContent = "Face of the farce";
    avatarEl.src = 'SITCOMREALITY LO.jpg';
    followersCountEl.textContent = '17';
    followingCountEl.textContent = '0';
    likesCountEl.textContent = '42';
    viewsCountEl.textContent = '153';

    const mockProjects = [
        {
            id: 'mock',
            title: "Untitled",
            project_id: {
                tid: Math.random() ? "My" : "Pro",
                description: null,
                project_revision: 2,
            },
            stats: Math.random() ? "Like" : "Dislike",
        }
    ];

    displayProjects(mockProjects);
}