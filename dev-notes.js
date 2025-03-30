/**
 * DEV NOTES - Project "SitcomReality: City Simulation" Refactor
 *
 * Goal: Transition the project display from a static "board game" grid
 *       to a dynamic, potentially interactive "city view" representation,
 *       while improving code modularity for future expansion.
 *
 * Date: 2024-07-26
 * Updated: 2024-08-04 (Phase 7.5 Complete)
 */

// --- Current State (Post-Phase 7.5 Complete) ---
// 1. All core game mechanics (HP, resources, basic actions, objectives, game over) are implemented.
// 2. Simulation systems (day/night, random events, passive income) are running.
// 3. Basic interactivity (selection, action buttons) is functional.
// 4. Visuals updated: Cityscape is a row of simple 3D cuboid buildings with variations, perspective ground plane, subtle roof details, and atmospheric effects (stars, haze, night overlay). Project content is on the front face.

// --- Implementation Progress ---
// Phase 1: Foundational Renaming & Restructuring (Completed)
// Phase 2: Basic City Layout (Completed)
// Phase 3: Introducing City Visual Metaphor (Completed - Basic 2D Cards)
// Phase 4: Improving Layout & Responsiveness (Completed)
// Phase 5: Interactivity & Simulation (Completed)
// Phase 6: Core Game Loop & Progression (Completed)
// Phase 7: Visual Enhancement - Cityscape
//    7.1 Basic 3D Building Shapes (Completed)
//    7.2 Improved Shading & Lighting (Completed)
//    7.3 Ground Plane/Street Level (Completed)
//    7.4 Subtle Building Variations (Completed)
//    7.5 Atmospheric Enhancements (Completed) - Added stars (via body::after), haze (via city-container::after), linked to day/night cycle.

// --- Next Steps ---

// **Focus for next step:** Address Layout/Navigation (Phase 8).
//   - Specifically tackle the scrollbar concern noted previously.
//   - **Goal:** Remove the need for the horizontal scrollbar in `#city-container` while keeping the cityscape metaphor.
//   - **Potential Approaches:**
//      a) **Fixed Viewport + Arrow Navigation:** Keep a fixed number of buildings visible (e.g., 3-5). Add clickable arrow buttons (or keyboard controls) to "pan" the view left/right, loading/unloading buildings outside the viewport dynamically or sliding the `#city-scape` element.
//      b) **Carousel/Paginated View:** Similar to (a), but perhaps with clearer pagination indicators.
//      c) **Camera Pan on Hover (More complex):** Implement a subtle camera pan effect when hovering near the edges of the `#city-container`.
//   - **Smallest Change:** Start with approach (a). Modify `gameBoardUI.js` to handle arrow clicks/keypresses to shift the `scrollLeft` property of `#city-container` by a calculated amount (e.g., width of one building + gap). Add arrow buttons overlaying the `#city-container`. Update CSS to style and position the arrows.
//   - Update `dev-notes.js`.

// **Deferred / Future Considerations:**
//    - Refine Investigation Feedback (5.6)
//    - Building Stats (5.11): Revisit adding unique stats/effects to buildings.
//    - More complex objectives/rewards.
//    - More varied random events.
//    - Sound effects.
//    - Dynamic lighting based on day/night cycle (more advanced).

console.log("Developer notes loaded. Phase 7.5 complete. Ready for Phase 8 (Layout/Navigation - Scrollbar Removal).");