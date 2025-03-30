/**
 * DEV NOTES - Project "SitcomReality: City Simulation" Refactor
 *
 * Goal: Transition the project display from a static "board game" grid
 *       to a dynamic, potentially interactive "city view" representation,
 *       while improving code modularity for future expansion.
 *
 * Date: 2024-07-26
 * Updated: 2024-07-29 (Phase 4 Complete)
 */

// --- Current State (Post-Phase 4 - Flexbox Layout) ---
// 1. CSS (`city-view.css`):
//    - `#city-scape` now uses `display: flex; align-items: flex-end; gap: ...;` for layout.
//    - Removed `white-space: nowrap;` from container and `inline-block` etc. from items.
//    - Added `flex-shrink: 0;` to `.city-object`.
//    - Adjusted padding on `#city-container` and `#city-scape`.
// 2. CSS (`responsive.css`):
//    - Updated media queries to adjust `.city-object` width, `--base-height`, and `#city-scape` gap.
//    - Maintained horizontal scrolling behavior via flexbox.
// 3. Related files (`api.js`, `gameBoardUI.js`, `index.html`) unchanged.

// --- Implementation Progress ---
// Phase 1: Foundational Renaming & Restructuring (Completed)
// Phase 2: Basic City Layout (Completed)
// Phase 3: Introducing City Visual Metaphor (Completed)
// Phase 4: Improving Layout & Responsiveness (Completed)
//    *Objective: Create a more deliberate city layout and ensure usability on different screen sizes.*
//    *Action: Switched to Flexbox layout, adjusted responsive styles.*

// --- Next Steps ---

// **Phase 5: Interactivity & Simulation (Beginnings)**
//    *Objective: Start adding player interaction and basic simulated elements.*
//    1.  **Click/Hover Interactions:**
//        -   *Current:* Hover slightly lifts the building (`.city-object`). Link button works.
//        -   *Proposal:* Add distinct visual feedback when a building is 'selected' or interacted with beyond just hover/linking. Could involve changing border color, adding an overlay, or triggering a small animation on the `.project-card` itself.
//        -   *Action (Example):* Add a `.selected` class in CSS. In JS (`gameBoardUI.js` or a new interaction module), add event listeners to `.city-object` or `.project-card` to toggle this class on click. Prevent the link click if a different interaction is intended.
//    2.  **Player Representation & Movement (Conceptual):**
//        -   How will the player be represented? (An avatar? A highlighted focus? A separate element?)
//        -   How will they move? (Clicking buildings? Arrow keys? Dragging the view?)
//        -   *Action (Minimal Start):* Introduce a concept of a 'current location' or 'selected building' in the player state (`playerState.js`) and update it based on interaction (e.g., clicking a building). The UI (`gameUI.js` or `gameBoardUI.js`) can then visually reflect this state (e.g., highlighting the selected building).
//    3.  **Simulated Elements (Conceptual):**
//        -   What kind of simulation? (Time passing? NPCs? Resource generation based on projects?)
//        -   *Action (Minimal Start):* Add a simple time cycle (e.g., update something in `gameManager.js` using `setInterval`) that perhaps modifies a global visual element (like background gradient) or triggers a very simple log message.

// **Focus for next step:** Implement basic 'selection' state (Phase 5.1). Add a `selectedBuildingId` to `playerState.js`. Update `gameBoardUI.js` to add click listeners to city objects that call a new function in `playerState.js` to set the selected ID. Update `gameBoardUI.js` or `gameUI.js` to visually reflect the selected state (e.g., adding/removing a CSS class).

console.log("Developer notes loaded. Phase 4 Flexbox layout implemented. Ready for Phase 5 interaction beginnings.");