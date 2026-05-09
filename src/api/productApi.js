import client from './client';
import { PRODUCT_ENDPOINTS } from './endpoint';

/**
 * API service for Product related operations
 */
export const productApi = {
    /**
     * Fetch all products
     * @param {Object} params 
     */
    getAllProducts: async (params = {}) => {
        return await client.get(PRODUCT_ENDPOINTS.ALL, { params });
    },

    /**
     * Create a new product
     * @param {FormData|Object} productData 
     */
    createProduct: async (productData) => {
        return await client.post(PRODUCT_ENDPOINTS.CREATE, productData);
    },

    /**
     * Update an existing product
     * @param {string} id 
     * @param {FormData|Object} productData 
     */
    updateProduct: async (id, productData) => {
        return await client.put(PRODUCT_ENDPOINTS.UPDATE(id), productData);
    },

    /**
     * Delete a product
     * @param {string} id 
     */
    deleteProduct: async (id) => {
        return await client.delete(PRODUCT_ENDPOINTS.DELETE(id));
    },

    /**
     * Toggle product active status
     * @param {string} id 
     */
    toggleProductStatus: async (id) => {
        return await client.patch(PRODUCT_ENDPOINTS.TOGGLE_STATUS(id));
    }
};

export default productApi;
