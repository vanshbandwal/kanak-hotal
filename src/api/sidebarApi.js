import client from './client';
import { SIDEBAR_ENDPOINTS } from './endpoint';

/**
 * API service for Sidebar related operations
 */
export const sidebarApi = {
    /**
     * Get the dynamic sidebar menu for the current user
     */
    getSidebarMenu: async () => {
        return await client.get(SIDEBAR_ENDPOINTS.MENU);
    },

    /**
     * Get all possible sidebar items (for admin management)
     */
    getAllSidebarItems: async () => {
        return await client.get(SIDEBAR_ENDPOINTS.ALL);
    }
};

export default sidebarApi;
