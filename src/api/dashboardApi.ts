import client from './client';
import { DASHBOARD_ENDPOINTS } from './endpoint';

/**
 * API service for Dashboard related operations
 */
export const dashboardApi = {
    /**
     * Get aggregate dashboard statistics, charts, and recent tables
     */
    getDashboardStats: async () => {
        return await client.get(DASHBOARD_ENDPOINTS.STATS);
    }
};

export default dashboardApi;
