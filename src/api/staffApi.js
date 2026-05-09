import client from './client';
import { STAFF_ENDPOINTS } from './endpoint';

/**
 * API service for Staff related operations
 */
export const staffApi = {
    /**
     * Get all staff members
     */
    getAllStaff: async () => {
        return await client.get(STAFF_ENDPOINTS.ALL);
    },

    /**
     * Create a new staff member
     */
    createStaff: async (staffData) => {
        return await client.post(STAFF_ENDPOINTS.CREATE, staffData);
    },

    /**
     * Delete a staff member
     */
    deleteStaff: async (id) => {
        return await client.delete(STAFF_ENDPOINTS.DELETE(id));
    }
};

export default staffApi;
