import client from './client';
import { PERMISSION_ENDPOINTS } from './endpoint';

/**
 * API service for Permission related operations
 */
export const permissionApi = {
    /**
     * Get all permissions
     */
    getAllPermissions: async () => {
        return await client.get(PERMISSION_ENDPOINTS.ALL);
    }
};

export default permissionApi;
