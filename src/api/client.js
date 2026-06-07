import axios from 'axios';
import { BASE_URL } from './endpoint';

/**
 * Reusable API client instance
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Add a request interceptor to inject the token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Centralized request handler to handle all API calls
 * @param {Function} request - A function that returns an axios promise
 * @returns {Promise<{data: any, error: string|null}>}
 */
const requestHandler = async (request) => {
    try {
        const response = await request();
        return { data: response.data, error: null };
    } catch (error) {
        let errorMessage = 'Something went wrong';
        
        if (error.response) {
            // Server responded with a status code out of 2xx range
            const status = error.response.status;
            if (status === 401) {
                const isLoginRequest = error.config?.url?.includes('/login');
                if (!isLoginRequest) {
                    errorMessage = 'Session expired. Please login again.';
                    localStorage.removeItem('token');
                    localStorage.removeItem('admin_user');
                    window.location.href = '/login';
                } else {
                    errorMessage = error.response.data?.message || 'Invalid credentials. Please try again.';
                }
            } else if (status === 403) {
                errorMessage = 'You do not have permission to perform this action.';
            } else if (status === 404) {
                errorMessage = 'The requested resource was not found.';
            } else if (status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else {
                errorMessage = error.response.data?.message || errorMessage;
            }
        } else if (error.request) {
            // Request was made but no response was received
            errorMessage = 'Network error. Please check your internet connection.';
        } else {
            // Something happened in setting up the request
            errorMessage = error.message;
        }

        return { data: null, error: errorMessage };
    }
};

const client = {
    get: (url, config = {}) => requestHandler(() => apiClient.get(url, config)),
    post: (url, data = {}, config = {}) => requestHandler(() => apiClient.post(url, data, config)),
    put: (url, data = {}, config = {}) => requestHandler(() => apiClient.put(url, data, config)),
    patch: (url, data = {}, config = {}) => requestHandler(() => apiClient.patch(url, data, config)),
    delete: (url, config = {}) => requestHandler(() => apiClient.delete(url, config)),
};

export default client;
