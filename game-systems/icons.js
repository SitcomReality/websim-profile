// Central repository for SVG icons used in the game UI

const icons = {
    score: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    hp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`, // Re-using like icon for HP
    coins: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2zm0-4H7v2h5v2h2V8h-2z"/><path fill="none" d="M0 0h24v24H0z"/></svg>`, // Using a generic coin/info icon
    gems: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1.9l-9 4.5v9l9 4.5 9-4.5v-9L12 1.9zm0 2.23l6.58 3.29L12 10.7 5.42 7.42 12 4.13zM4 9.86l7 3.5v7.28l-7-3.5V9.86zm9 10.78v-7.28l7-3.5v7.28l-7 3.5z"/></svg>`, // Diamond icon
    grenades: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C9.79 2 8 3.79 8 6v2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-2V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2zm-4 8h8v2H8zm0 4h8v2H8z"/></svg>`, // Using a bomb/capsule like icon
    paint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 4V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2zm-5 14H7v-2h6v2zm3-4H7v-2h9v2zm0-4H7V8h9v2z"/></svg>`, // Using a paint bucket/can icon
    limbs: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c-2.7 0-5.8 1.29-6 2.01V20h12v-1.99c-.2-.72-3.3-2.01-6-2.01M4.06 7.78L3 8.5l1.42 2.84.94-.47L4.06 7.78zM21 8.5l-.94-.72L18.64 10.87l.94.47L21 8.5zM7.5 12c1.1 0 2 .9 2 2H14.5c1.1 0 2-.9 2-2S15.6 10 14.5 10H9.5c-1.1 0-2 .9-2 2z"/></svg>`, // Generic person/body icon
    existentialInertia: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3C6.486 3 2 7.486 2 13c0 5.514 4.486 10 10 10s10-4.486 10-10c0-5.514-4.486-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M11 7h2v6h-2zm0 8h2v2h-2z"/></svg>`, // Question/Info circle, symbolizing the abstract
    externalLink: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`
};

export function getIcon(statName) {
    return icons[statName] || icons.existentialInertia; // Default to something if not found
}