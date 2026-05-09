import client from './client';

/**
 * API service for User related operations
 */
export const userApi = {
    /**
     * Get all users
     * @param {Object} params 
     */
    getUsers: async (params = {}) => {
        return await client.get('/v1/users', { params });
    },

    /**
     * Get user by ID
     * @param {string} id 
     */
    getUserById: async (id) => {
        return await client.get(`/v1/users/${id}`);
    },

    /**
     * Update user profile
     * @param {string} id 
     * @param {Object} userData 
     */
    updateUser: async (id, userData) => {
        return await client.put(`/v1/users/${id}`, userData);
    },

    /**
     * Delete user
     * @param {string} id 
     */
    deleteUser: async (id) => {
        return await client.delete(`/v1/users/${id}`);
    }
};

export default userApi;
