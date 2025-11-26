export const environment = {
    production: true,
    // Vite exposes env vars prefixed with VITE_ at build time via import.meta.env
    serverBasePath: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_BASE_PATH) || "https://certiweb-backend.onrender.com/api/v1"
};