import client from './client';
import { AUTH_ENDPOINTS } from './endpoint';

/**
 * API service for Authentication related operations
 */
export const authApi = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     */
    loginUser: async (credentials) => {
        return await client.post(AUTH_ENDPOINTS.LOGIN, credentials);
    },

    /**
     * Get current user profile
     */
    getUserProfile: async () => {
        return await client.get(AUTH_ENDPOINTS.PROFILE);
    },

    /**
     * Request password reset
     * @param {string} email 
     */
    forgotPassword: async (email) => {
        return await client.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    },

    /**
     * Reset password with token
     * @param {Object} data - { token, newPassword }
     */
    resetPassword: async (data) => {
        return await client.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    },

    /**
     * Change password
     * @param {Object} data - { oldPassword, newPassword }
     */
    changePassword: async (data) => {
        return await client.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
    },

    /**
     * Logout user
     */
    logoutUser: async () => {
        return await client.post(AUTH_ENDPOINTS.LOGOUT);
    }
};

export default authApi;
