import client from './client';
import { ROLE_ENDPOINTS } from './endpoint';

/**
 * API service for Role related operations
 */
export const roleApi = {
    /**
     * Get all roles
     */
    getAllRoles: async () => {
        return await client.get(ROLE_ENDPOINTS.ALL);
    },

    /**
     * Get role by ID
     */
    getRoleById: async (id) => {
        return await client.get(ROLE_ENDPOINTS.BY_ID(id));
    },

    /**
     * Create a new role
     */
    createRole: async (roleData) => {
        return await client.post(ROLE_ENDPOINTS.CREATE, roleData);
    },

    /**
     * Update an existing role
     */
    updateRole: async (id, roleData) => {
        return await client.put(ROLE_ENDPOINTS.UPDATE(id), roleData);
    },

    /**
     * Delete a role
     */
    deleteRole: async (id) => {
        return await client.delete(ROLE_ENDPOINTS.DELETE(id));
    }
};

export default roleApi;
