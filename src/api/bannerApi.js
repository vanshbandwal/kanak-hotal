import client from './client';
import { BANNER_ENDPOINTS } from './endpoint';

/**
 * API service for Banner related operations
 */
export const bannerApi = {
    /**
     * Fetch all banners
     * @param {Object} params - Query parameters like isActive, type, etc.
     */
    getAllBanners: async (params = {}) => {
        return await client.get(BANNER_ENDPOINTS.ALL, { params });
    },

    /**
     * Fetch banner stats
     */
    getBannerStats: async () => {
        return await client.get(BANNER_ENDPOINTS.STATS);
    },

    /**
     * Create a new banner
     * @param {FormData|Object} bannerData 
     */
    createBanner: async (bannerData) => {
        return await client.post(BANNER_ENDPOINTS.CREATE, bannerData);
    },

    /**
     * Update an existing banner
     * @param {string} id 
     * @param {FormData|Object} bannerData 
     */
    updateBanner: async (id, bannerData) => {
        return await client.put(BANNER_ENDPOINTS.UPDATE(id), bannerData);
    },

    /**
     * Delete a banner
     * @param {string} id 
     */
    deleteBanner: async (id) => {
        return await client.delete(BANNER_ENDPOINTS.DELETE(id));
    }
};

export default bannerApi;
