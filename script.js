import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // If needed for debugging/interaction
import {
    PROFILE_USERNAME,
    BACKGROUND_COLOR,
    OBJECT_COLORS,
    BLOOM_PARAMS
} from './config.js';

// --- DOM Elements ---
const usernameEl = document.getElementById('username');
const descriptionEl = document.getElementById('description');
const avatarEl = document.getElementById('avatar');
const followersCountEl = document.getElementById('followers-count');
const followingCountEl = document.getElementById('following-count');
const likesCountEl = document.getElementById('likes-count');
const viewsCountEl = document.getElementById('views-count');
const projectsGridEl = document.getElementById('projects-grid');
const canvasContainer = document.getElementById('background-canvas');

// --- API Fetching ---

async function fetchUserProfile(username) {
    try {
        // Use websim API if available, otherwise fallback to direct fetch
        let user = null;
        if (window.websim && typeof window.websim.getUser === 'function') {
            // Check if the websim context is for the target user
            const currentContextUser = await window.websim.getCreatedBy();
            if (currentContextUser && currentContextUser.username === username) {
                user = currentContextUser; // Use the context user directly
            } else {
                // Fetch specific user if context doesn't match (less common for own profile)
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

// --- Project Display ---

function displayProjects(projectsData) {
    projectsGridEl.innerHTML = ''; // Clear previous projects

    if (!projectsData || projectsData.length === 0) {
        projectsGridEl.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projectsData.forEach(({ project, project_revision, site }) => {
        if (!project || !project_revision) return; // Skip if essential data is missing

        const card = document.createElement('div');
        card.classList.add('project-card');
        card.dataset.projectId = project.id; // Store ID for potential interactions

        const thumbnailUrl = project_revision.current_screenshot_url || (site ? `https://images.websim.ai/v1/site/${site.id}/600` : 'placeholder.png'); // Use placeholder if no screenshot/site image
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
        }, 100 * (projectsData.indexOf({ project, project_revision, site })) ); // Stagger animation

        // Game interface style click handler (optional visual feedback)
        card.addEventListener('click', (e) => {
            // Prevent default if we handle navigation purely via JS (unlikely needed here)
            // e.preventDefault();
            // Add a visual "selected" effect (example)
            document.querySelectorAll('.project-card.selected').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            // Could add more complex game-like interactions here if desired
            // setTimeout(() => window.open(siteUrl, '_blank'), 200); // slight delay for effect
        });
    });

    // Add placeholder image CSS if needed
    const style = document.createElement('style');
    style.textContent = `
        img[src="placeholder.png"] {
            background-color: #eee; /* Placeholder background */
            /* Optional: add an icon or pattern */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23cccccc' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .project-card.selected {
            outline: 3px solid var(--secondary-color);
            outline-offset: -3px;
        }
    `;
    document.head.appendChild(style);
}

// --- Three.js Background ---

let scene, camera, renderer, composer;
const objects = [];

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(BACKGROUND_COLOR, 1); // Set solid background color initially
    canvasContainer.appendChild(renderer.domElement);

    // Post-processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), BLOOM_PARAMS.strength, BLOOM_PARAMS.radius, BLOOM_PARAMS.threshold);

    const outputPass = new OutputPass(); // Corrects colors after bloom

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Add Surreal Objects
    const geometryTypes = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
        new THREE.ConeGeometry(0.4, 0.8, 32),
        new THREE.DodecahedronGeometry(0.5, 0),
        new THREE.TorusGeometry(0.4, 0.1, 16, 100),
    ];

    for (let i = 0; i < 25; i++) { // Add more objects
        const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
        const material = new THREE.MeshStandardMaterial({
            color: OBJECT_COLORS[Math.floor(Math.random() * OBJECT_COLORS.length)],
            roughness: Math.random() * 0.5 + 0.2, // Vary roughness
            metalness: Math.random() * 0.3 // Subtle metalness
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Random positions within a larger volume
        mesh.position.x = (Math.random() - 0.5) * 15;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = (Math.random() - 0.5) * 10 - 5; // Spread them out in Z too

        // Random initial rotation
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;

        // Store random rotation speed/axis
        mesh.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        };
        // Store random drift speed
        mesh.userData.driftSpeed = {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.002
        };

        scene.add(mesh);
        objects.push(mesh);
    }

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Resize composer too
}

// Mouse interaction (subtle camera movement)
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 5; // Reduced sensitivity
    mouseY = (event.clientY - windowHalfY) / 5;
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

function animate() {
    requestAnimationFrame(animate);

    // Gently move camera based on mouse position
    camera.position.x += (mouseX / 500 - camera.position.x) * 0.05; // Smooth interpolation
    camera.position.y += (-mouseY / 500 - camera.position.y) * 0.05;
    camera.lookAt(scene.position); // Always look at the center

    // Animate objects
    objects.forEach(obj => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;

        obj.position.x += obj.userData.driftSpeed.x;
        obj.position.y += obj.userData.driftSpeed.y;
        obj.position.z += obj.userData.driftSpeed.z;

        // Boundary check - gently push back if they go too far
        const boundary = 10;
        if (Math.abs(obj.position.x) > boundary) obj.userData.driftSpeed.x *= -1;
        if (Math.abs(obj.position.y) > boundary) obj.userData.driftSpeed.y *= -1;
        if (Math.abs(obj.position.z) > boundary) obj.userData.driftSpeed.z *= -1;

    });

    // renderer.render(scene, camera); // Use composer instead
    composer.render();
}

// --- Initialization ---
async function initPage() {
    // Fetch user data first to populate profile info
    const user = await fetchUserProfile(PROFILE_USERNAME);

    // Fetch projects only if user data was successfully fetched
    if (user) {
        await fetchUserProjects(PROFILE_USERNAME);
    } else {
        // Handle case where user profile couldn't load (e.g., display message in projects area)
        if (projectsGridEl) {
            projectsGridEl.innerHTML = '<p>Could not load user profile. Projects cannot be displayed.</p>';
        }
    }

    // Initialize the background animation regardless of profile load success
    initThreeJS();
}

// --- Start the application ---
initPage();