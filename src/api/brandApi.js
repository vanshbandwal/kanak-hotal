import client from './client';
import { BRAND_ENDPOINTS } from './endpoint';

/**
 * API service for Brand related operations
 */
export const brandApi = {
    /**
     * Fetch all brands
     * @param {Object} params - Query parameters like search, page, limit, etc.
     */
    getAllBrands: async (params = {}) => {
        return await client.get(BRAND_ENDPOINTS.ALL, { params });
    },

    /**
     * Create a new brand
     * @param {FormData|Object} brandData 
     */
    createBrand: async (brandData) => {
        // Axios automatically sets multipart/form-data for FormData
        return await client.post(BRAND_ENDPOINTS.CREATE, brandData);
    },

    /**
     * Update an existing brand
     * @param {string} id 
     * @param {FormData|Object} brandData 
     */
    updateBrand: async (id, brandData) => {
        return await client.put(BRAND_ENDPOINTS.UPDATE(id), brandData);
    },

    /**
     * Delete a brand
     * @param {string} id 
     */
    deleteBrand: async (id) => {
        return await client.delete(BRAND_ENDPOINTS.DELETE(id));
    },

    /**
     * Toggle brand active status
     * @param {string} id 
     */
    toggleBrandStatus: async (id) => {
        return await client.patch(BRAND_ENDPOINTS.TOGGLE_STATUS(id));
    }
};

export default brandApi;
