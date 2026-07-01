import client from './client';
import { QUERY_ENDPOINTS } from './endpoint';

/**
 * API service for Customer Query Management operations
 */
export const queryApi = {
    /**
     * Fetch all queries with pagination and filters
     * @param {Object} params 
     */
    getAllQueries: async (params = {}) => {
        return await client.get(QUERY_ENDPOINTS.ALL, { params });
    },

    /**
     * Fetch query stats
     */
    getQueryStats: async () => {
        return await client.get(QUERY_ENDPOINTS.STATS);
    },

    /**
     * Get single query details with conversation history
     * @param {string} id 
     */
    getQueryById: async (id) => {
        return await client.get(QUERY_ENDPOINTS.BY_ID(id));
    },

    /**
     * Update the status of a query
     * @param {string} id 
     * @param {string} status 
     */
    updateStatus: async (id, status) => {
        return await client.patch(QUERY_ENDPOINTS.STATUS(id), { status });
    },

    /**
     * Assign a query to a staff member
     * @param {string} id 
     * @param {string} assignedTo 
     */
    assignQuery: async (id, assignedTo) => {
        return await client.patch(QUERY_ENDPOINTS.ASSIGN(id), { assignedTo });
    },

    /**
     * Admin reply to a customer query
     * @param {string} id 
     * @param {Object} data 
     */
    adminReply: async (id, data) => {
        return await client.post(QUERY_ENDPOINTS.ADMIN_REPLY(id), data);
    },

    /**
     * Delete a query permanently
     * @param {string} id 
     */
    deleteQuery: async (id) => {
        return await client.delete(QUERY_ENDPOINTS.DELETE(id));
    },

    // 🌍 PUBLIC CUSTOMER METHODS
    createQuery: async (data) => await client.post(QUERY_ENDPOINTS.CREATE, data),
    getMyQueries: async () => await client.get(QUERY_ENDPOINTS.MY_QUERIES),
    customerReply: async (id, data) => await client.post(QUERY_ENDPOINTS.CUSTOMER_REPLY(id), data),
};

export default queryApi;
