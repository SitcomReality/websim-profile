/**
 * DEV NOTES - Project "SitcomReality: City Simulation" Refactor
 *
 * Goal: Transition the project display from a static "board game" grid
 *       to a dynamic, potentially interactive "city view" representation,
 *       while improving code modularity for future expansion.
 *
 * Date: 2024-07-26
 * Updated: 2024-07-27 (Phase 1)
 * Updated: 2024-07-28 (Phase 2)
 */

// --- Current State (Post-Phase 2 Implementation) ---
// 1. HTML IDs and CSS selectors updated to "city" theme (`#city-container`, `#city-scape`, `.city-object`).
// 2. CSS (`city-view.css`) updated:
//    - Removed grid layout from `#city-scape`.
//    - `.city-object` styled as `inline-block` with fixed dimensions.
//    - Removed `.empty-space` styles.
// 3. Rendering Logic (`gameBoardUI.js`):
//    - Renamed `displayProjects` to `displayCityScape`.
//    - Removed board distribution logic (32 slots, empty spaces).
//    - Now iterates directly through project data and appends `.city-object` elements.
//    - Removed dependency on grid index for animations (using simple iteration index).
// 4. Related files (`api.js`, `responsive.css`, `index.html`) updated to reflect changes.

// --- Implementation Progress ---
// Phase 1: Foundational Renaming & Restructuring (Completed)
// Phase 2: Basic City Layout (Completed)
//    *Objective: Remove grid layout, render projects as distinct block elements.*
//    *Status: Done. Projects render horizontally as simple blocks.*

// --- Next Steps ---

// **Phase 3: Introducing City Visual Metaphor**
//    *Objective: Start making the project elements look less like cards and more like city features.*
//    1.  **CSS Enhancements (`city-view.css`):**
//        -   Experiment with basic 3D perspective on `#city-container` and transforms on `.city-object` (e.g., `transform: skewX/Y`, `perspective`, `rotateX`).
//        -   Use pseudo-elements (`::before`, `::after`) on `.city-object` to simulate building tops, depth, or roads/foundations.
//        -   Vary dimensions (width/height) or styles of `.city-object` based on project stats (requires passing stats data or calculating in JS). Start simply (e.g., height proportional to views/likes).
//        -   Adjust layout *within* `.city-object` (thumbnail, info) to fit the new visual style. Maybe thumbnail becomes the "roof"? Info could overlay or be a "lower floor".
//    2.  **JS Enhancements (`gameBoardUI.js`):**
//        -   Pass necessary stats to CSS via inline styles (e.g., `--project-height-factor`) or data attributes if varying dimensions/styles per project.

// **Phase 4: Improving Layout & Responsiveness**
//    *Objective: Create a more deliberate city layout and ensure usability on different screens.*
//    1.  **Layout Strategy:** Choose a layout method for `#city-scape`:
//        -   **Flexbox/Grid (Rows):** Arrange buildings into rows with wrapping.
//        -   **Absolute Positioning:** Calculate X/Y coordinates for each `.city-object` based on project data (date, stats) or a packing algorithm. Requires careful handling of overlaps and container sizing. Introduces need for pan/zoom.
//        -   **SVG:** Render the city within an SVG for scaling/zooming. Larger refactor.
//    2.  **Responsiveness (`responsive.css`):**
//        -   Adapt layout strategy for different screen sizes. Pan/zoom might become necessary.

// **Phase 5 & Beyond: Interactivity & Simulation**
//    *Objective: Add player interaction, movement, simulated elements.*
//    1.  Click/Hover Interactions on `.city-object`.
//    2.  Player Representation & Movement.
//    3.  Simulated Entities (NPCs, vehicles).
//    4.  Refined State Management.

// --- Proposed File/Directory Structure (Still relevant for future phases) ---
/*
/
├── index.html
├── style.css
├── config.js
├── script.js
├── api.js
├── ui.js
├── dev-notes.js          # This file
├── assets/
│   └── SITCOMREALITYLOGO.jpg
├── styles/
│   ├── base.css
│   ├── profile.css
│   ├── ai-text.css
│   ├── city-view.css
│   ├── game-hud.css
│   └── responsive.css
├── game-systems/
│   ├── core/
│   │   ├── gameManager.js
│   │   └── playerState.js
│   ├── ui/
│   │   ├── gameBoardUI.js   # <-- Renders city scape (consider renaming folder/file later?)
│   │   ├── gameUI.js        # <-- Updates HUD
│   │   └── icons.js
│   ├── entities/           # (Future)
│   ├── interactions/       # (Future)
│   └── utilities/          # (Future)
├── data/
│   ├── context_terms.js
│   ├── noun_terms.js
│   └── adjective_terms.js
└── lib/                  # (Future)

*/

console.log("Developer notes loaded. Review the proposed changes and structure. Phase 2 completed, ready for Phase 3.");