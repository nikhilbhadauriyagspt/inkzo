import axios from 'axios';

const api = axios.create({
    baseURL: 'https://lightblue-elephant-314089.hostingersite.com/api'
});


// Request interceptor for token
api.interceptors.request.use((config) => {
    // Prioritize regular user token for customer-facing features
    // Only use admin token if user token is not present
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.data?.message === "Invalid Token")) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
