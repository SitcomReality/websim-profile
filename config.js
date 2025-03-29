// User configuration
export const PROFILE_USERNAME = "SitcomReality"; // Replace with the actual target username

// Add API timeout constant
export const API_TIMEOUT = 5000; // 5 seconds

// --- Aesthetics ---

// Background Canvas Configuration
export const BACKGROUND_COLOR = 0xf0e4f2; // A soft, slightly surreal pale lavender/pink

// Colors for the 3D objects in the background
export const OBJECT_COLORS = [
    0xff6b6b, // Light Coral
    0xfeca57, // Saffron Mango
    0x48dbfb, // Light Sky Blue
    0x1dd1a1, // Light Sea Green
    0xff9ff3, // Jigglypuff Pink
    0x54a0ff, // Clear Blue
    0x5f27cd, // Medium Purple
    0xced6e0, // Light Grey Blue
];

// Bloom Effect Parameters (adjust for desired surreal glow)
export const BLOOM_PARAMS = {
    strength: 1.2,    // Intensity of the bloom effect
    radius: 0.6,      // Radius of the bloom glow
    threshold: 0.8    // Luminosity threshold to trigger bloom (lower = more bloom)
};