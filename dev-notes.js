/**
 * DEV NOTES - Project "SitcomReality: City Simulation" Refactor
 *
 * Goal: Transition the project display from a static "board game" grid
 *       to a dynamic, potentially interactive "city view" representation,
 *       while improving code modularity for future expansion.
 *
 * Date: 2024-07-26
 */

// --- Analysis of Current State (as of Board Game Implementation) ---
// 1.  **Project Display:** Uses `gameBoardUI.js` to render projects fetched via `api.js`
//     into a CSS grid (`#game-board`) styled by `game-board.css`. Projects are spaced
//     out across 32 fixed slots. Responsiveness is handled by horizontal scrolling
//     of the grid container (`#game-board-container`).
// 2.  **Game HUD:** Managed by `gameUI.js` (icons via `icons.js`) and `game-hud.css`.
//     Displays player stats from `playerState.js`. Initialized by `gameManager.js`.
// 3.  **API & Core Logic:** `api.js` handles fetching user data, projects, and AI text.
//     `config.js` holds configuration. `playerState.js` manages basic stats.
// 4.  **Modularity:** CSS has been split (`base.css`, `profile.css`, `ai-text.css`,
//     `game-board.css`, `game-hud.css`, `responsive.css`). JS logic for board
//     display is separated (`gameBoardUI.js`).
// 5.  **Limitations for City View:**
//     - The rigid grid layout is unsuitable for a fluid city representation.
//     - Horizontal scrolling might not feel natural for a top-down city view.
//     - Current rendering logic creates uniform "spaces", not distinct city "objects".
//     - Lack of structure for player interaction within the "world" space or
//       simulated elements.

// --- Proposed Refactoring & Implementation Steps (Incremental) ---

// **Phase 1: Foundational Renaming & Restructuring**
//    *Objective: Align file names and structure with the new "city" concept.*
//    1.  **Rename Files:**
//        -   `game-systems/gameBoardUI.js` -> `game-systems/ui/cityViewUI.js`
//        -   `game-systems/gameUI.js` -> `game-systems/ui/hudUI.js`
//        -   `styles/game-board.css` -> `styles/city-view.css`
//        -   (Optional) `game-systems/gameManager.js` -> `game-systems/core/gameManager.js`
//        -   (Optional) `game-systems/playerState.js` -> `game-systems/core/playerState.js`
//    2.  **Create Directories:**
//        -   `game-systems/core/`
//        -   `game-systems/ui/`
//        -   (Optional) `data/` (for `context_terms.js`, `noun_terms.js`, `adjective_terms.js`)
//    3.  **Update Imports/References:** Modify paths in `index.html`, `style.css`, `api.js`, `gameManager.js` (or its new path), etc., to reflect the new file locations and names.
//    4.  **HTML ID Changes:**
//        -   `#game-board-container` -> `#city-container`
//        -   `#game-board` -> `#city-scape` (or similar)
//        -   Update relevant JS/CSS selectors.

// **Phase 2: Basic City Layout**
//    *Objective: Remove the grid layout and render projects as distinct block elements.*
//    1.  **Modify CSS (`city-view.css`):**
//        -   Remove `display: grid` from `#city-scape`.
//        -   Remove fixed `grid-template-columns` and `min-width` related to the grid.
//        -   Style the new `#city-container` (e.g., `position: relative`, `overflow: auto` initially).
//        -   Style the project elements (formerly `.board-space`, perhaps rename class to `.city-object` or `.building`) as simple blocks (`display: inline-block` or `block`, basic width/height/margin). Remove `aspect-ratio`.
//        -   Remove the `.empty-space` class and related styling/logic.
//    2.  **Modify Rendering Logic (`cityViewUI.js`):**
//        -   Update `displayProjects` (or rename `renderCityScape`).
//        -   Remove the logic for distributing projects across 32 slots and creating empty spaces.
//        -   Loop directly through `projectsData` and append each project element (`.city-object`) to `#city-scape`.
//        -   Remove the `popIn` animation tied to grid index (can add different entrance later).

// **Phase 3: Introducing City Visual Metaphor**
//    *Objective: Start making the project elements look less like cards and more like city features.*
//    1.  **CSS Enhancements (`city-view.css`):**
//        -   Experiment with basic 3D perspective on `#city-container` and transforms on `.city-object` (e.g., `transform: skewX/Y`, `perspective`).
//        -   Use pseudo-elements (`::before`, `::after`) on `.city-object` to simulate building tops or depth.
//        -   Vary dimensions (width/height) of `.city-object` based on project stats (requires passing stats data or calculating in JS). Start simply (e.g., height proportional to views).
//        -   Adjust layout within `.city-object` (thumbnail, info) to fit the new visual style. Maybe thumbnail becomes the "roof"?
//    2.  **JS Enhancements (`cityViewUI.js`):**
//        -   Pass necessary stats to CSS via inline styles or data attributes if varying dimensions/styles per project.

// **Phase 4: Improving Layout & Responsiveness**
//    *Objective: Create a more deliberate city layout and ensure usability on different screens.*
//    1.  **Layout Strategy:** Choose a layout method for `#city-scape`:
//        -   **Flexbox/Grid (again):** Could create rows/columns of buildings, perhaps with wrapping. Simpler initially.
//        -   **Absolute Positioning:** Calculate X/Y coordinates for each `.city-object` in JS based on some algorithm (e.g., packing, spiral, based on project date/stats). More complex, more "map-like". Requires careful handling of overlaps and container sizing.
//        -   **SVG:** Render the city within an SVG element for easier scaling, zooming, and potentially more complex shapes. A bigger leap.
//    2.  **Responsiveness (`responsive.css`):**
//        -   Adjust `#city-container` size and overflow handling.
//        -   Modify the layout strategy or object scaling at different breakpoints. Zoom/pan might become necessary on small screens if using absolute positioning or SVG.

// **Phase 5 & Beyond: Interactivity & Simulation**
//    *Objective: Add player interaction, movement, simulated elements.*
//    1.  **Click/Hover Interactions:** Add event listeners to `.city-object` elements (in `cityViewUI.js` or a dedicated `interactions/` module). Trigger actions (display info panel, initiate minigame, spend resources).
//    2.  **Player Representation:** Add a player marker/avatar to the city view, controlled via input.
//    3.  **Entities:** Create classes/factories (`entities/`) for NPCs, vehicles, etc., and add them to the city view.
//    4.  **State Management:** Refine `playerState.js` and potentially add world state management.
//    5.  **Backend Integration:** Implement saving/loading state if persistence is required.

// --- Proposed File/Directory Structure ---
/*
/
├── index.html
├── style.css             # Main CSS import file
├── config.js             # User config, constants
├── script.js             # General top-level script (if needed)
├── api.js                # API interaction logic
├── ui.js                 # General UI element references/helpers (Profile header, AI text)
├── dev-notes.js          # This file
├── assets/
│   └── SITCOMREALITYLOGO.jpg
├── styles/               # CSS Modules
│   ├── base.css
│   ├── profile.css
│   ├── ai-text.css
│   ├── city-view.css     # <-- Styles for the city/project area
│   ├── game-hud.css      # <-- Styles for the bottom HUD
│   └── responsive.css
├── game-systems/         # Core game logic and systems
│   ├── core/
│   │   ├── gameManager.js  # Initializes game systems, main loop (if any)
│   │   └── playerState.js  # Manages player stats and resources
│   ├── ui/
│   │   ├── cityViewUI.js   # Renders projects as city elements, handles city layout
│   │   ├── hudUI.js        # Updates the bottom HUD elements
│   │   └── icons.js        # SVG icon definitions
│   ├── entities/           # (Future) For NPCs, vehicles, interactive objects
│   │   # ├── entityFactory.js
│   │   # └── baseEntity.js
│   ├── interactions/       # (Future) Handling user input within the city view
│   │   # └── clickHandler.js
│   │   # └── playerController.js
│   └── utilities/          # (Future) Shared helper functions
│       # └── mathUtils.js
│       # └── layoutUtils.js # (If using complex positioning)
├── data/                 # Static data lists
│   ├── context_terms.js
│   ├── noun_terms.js
│   └── adjective_terms.js
└── lib/                  # (Future) External libs if needed beyond import maps

*/

// --- Rationale for Structure ---
// - **Separation of Concerns:** Divides UI rendering (`game-systems/ui`), core state/logic (`game-systems/core`), future simulation (`entities`, `interactions`), static data (`data`), and base configuration/API interaction.
// - **Scalability:** Makes it easier to add new systems (e.g., inventory, quests, minigames) by creating new modules/directories within `game-systems`.
// - **Maintainability:** Smaller, focused files are easier to understand, debug, and modify. CSS is componentized.
// - **Clear Naming:** File and directory names reflect their purpose within the "city simulation" concept.

console.log("Developer notes loaded. Review the proposed changes and structure.");