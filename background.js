import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
// OrbitControls might be needed later for interaction, keep the import commented or remove if unused
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
    BACKGROUND_COLOR,
    OBJECT_COLORS,
    BLOOM_PARAMS
} from './config.js';

const canvasContainer = document.getElementById('background-canvas');
let scene, camera, renderer, composer;
const objects = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let animationFrameId = null; // To potentially stop the animation loop if needed

function initThreeJS() {
    if (!canvasContainer) {
        console.error("Background canvas container not found!");
        return;
    }
    // Clear previous canvas if re-initializing (optional)
    // while (canvasContainer.firstChild) {
    //     canvasContainer.removeChild(canvasContainer.firstChild);
    // }
     // If animation is already running, stop it before re-initializing
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    objects.length = 0; // Clear objects array


    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
        console.error("WebGL Renderer initialization failed:", error);
        canvasContainer.innerHTML = "<p style='color: white; text-align: center;'>WebGL is not supported or enabled in your browser.</p>";
        return; // Stop initialization if renderer fails
    }
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(BACKGROUND_COLOR, 1);
    canvasContainer.appendChild(renderer.domElement);


    // Post-processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), BLOOM_PARAMS.strength, BLOOM_PARAMS.radius, BLOOM_PARAMS.threshold);
    const outputPass = new OutputPass();

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);


    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Slightly increased ambient
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 150); // Adjusted intensity and distance
    pointLight.position.set(8, 8, 8); // Moved light source
    scene.add(pointLight);
     const pointLight2 = new THREE.PointLight(0xaaccff, 0.5, 100); // Add a cool light source
    pointLight2.position.set(-8, -5, -5);
    scene.add(pointLight2);


    // Add Surreal Objects
    const geometryTypes = [
        new THREE.IcosahedronGeometry(0.6, 0), // Slightly larger base size
        new THREE.TorusKnotGeometry(0.5, 0.18, 100, 16),
        new THREE.ConeGeometry(0.5, 0.9, 32),
        new THREE.DodecahedronGeometry(0.65, 0),
        new THREE.TorusGeometry(0.5, 0.12, 16, 100),
        new THREE.OctahedronGeometry(0.6, 0),
    ];

    for (let i = 0; i < 30; i++) { // Slightly more objects
        const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
        const material = new THREE.MeshStandardMaterial({
            color: OBJECT_COLORS[Math.floor(Math.random() * OBJECT_COLORS.length)],
            roughness: Math.random() * 0.4 + 0.1, // Adjusted range
            metalness: Math.random() * 0.4 + 0.1 // Slightly more metallic range
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Random positions within a slightly larger volume, pushing some further back
        mesh.position.x = (Math.random() - 0.5) * 18;
        mesh.position.y = (Math.random() - 0.5) * 18;
        mesh.position.z = (Math.random() - 0.5) * 15 - 7; // Start further back on average

        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;

        mesh.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.008, // Slightly slower rotation
            y: (Math.random() - 0.5) * 0.008,
            z: (Math.random() - 0.5) * 0.008
        };
         mesh.userData.driftSpeed = {
            x: (Math.random() - 0.5) * 0.006,
            y: (Math.random() - 0.5) * 0.006,
            z: (Math.random() - 0.5) * 0.003
        };

        scene.add(mesh);
        objects.push(mesh);
    }

    // Clean up old listeners before adding new ones
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onDocumentMouseMove);

    // Add Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    animate(); // Start the animation loop
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
    }
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX); // Keep raw difference
    mouseY = (event.clientY - windowHalfY);
}


function animate() {
    animationFrameId = requestAnimationFrame(animate); // Store the frame ID

     // Smooth camera movement based on mouse
     if (camera && scene) {
        const targetX = (mouseX * 0.001); // Control sensitivity
        const targetY = (-mouseY * 0.001);
        camera.position.x += (targetX - camera.position.x) * 0.03; // Smoothing factor
        camera.position.y += (targetY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
     }


    // Animate objects
    const boundary = 12; // Increased boundary slightly
    objects.forEach(obj => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;

        obj.position.x += obj.userData.driftSpeed.x;
        obj.position.y += obj.userData.driftSpeed.y;
        obj.position.z += obj.userData.driftSpeed.z;

         // Boundary check - reverse direction smoothly if needed
         if (Math.abs(obj.position.x) > boundary && Math.sign(obj.position.x) === Math.sign(obj.userData.driftSpeed.x)) {
            obj.userData.driftSpeed.x *= -1;
         }
         if (Math.abs(obj.position.y) > boundary && Math.sign(obj.position.y) === Math.sign(obj.userData.driftSpeed.y)) {
             obj.userData.driftSpeed.y *= -1;
         }
         if (obj.position.z > boundary * 0.5 && obj.userData.driftSpeed.z > 0) { // Prevent going too far forward
             obj.userData.driftSpeed.z *= -0.5 - Math.random() * 0.5; // Push back more randomly
         } else if (obj.position.z < -boundary * 1.5 && obj.userData.driftSpeed.z < 0) { // Prevent going too far back
             obj.userData.driftSpeed.z *= -0.5 - Math.random() * 0.5; // Pull forward
         }

    });

    // Render using composer
    if (composer) {
        composer.render();
    }
}

export { initThreeJS };