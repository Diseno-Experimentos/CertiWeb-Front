export const environment = {
    production: true,
    //serverBasePath: 'http://localhost:3000',
    api_key_imgbb: '5e8520a4a581822f7aef6ae42d2e407b',
    serverBasePath: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_BASE_PATH) || "https://certiweb-backend.onrender.com/api/v1"
};