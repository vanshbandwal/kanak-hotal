import client from './client';
import { CATEGORY_ENDPOINTS } from './endpoint';

/**
 * API service for Category related operations
 */
export const categoryApi = {
    // Category
    getAllCategories: async (params = {}) => {
        return await client.get(CATEGORY_ENDPOINTS.CATEGORY.ALL, { params });
    },
    createCategory: async (data) => {
        return await client.post(CATEGORY_ENDPOINTS.CATEGORY.CREATE, data);
    },
    updateCategory: async (id, data) => {
        return await client.put(CATEGORY_ENDPOINTS.CATEGORY.UPDATE(id), data);
    },
    deleteCategory: async (id) => {
        return await client.delete(CATEGORY_ENDPOINTS.CATEGORY.DELETE(id));
    },

    // Subcategory
    getAllSubcategories: async (params = {}) => {
        return await client.get(CATEGORY_ENDPOINTS.SUBCATEGORY.ALL, { params });
    },
    createSubcategory: async (data) => {
        return await client.post(CATEGORY_ENDPOINTS.SUBCATEGORY.CREATE, data);
    },
    updateSubcategory: async (id, data) => {
        return await client.put(CATEGORY_ENDPOINTS.SUBCATEGORY.UPDATE(id), data);
    },
    deleteSubcategory: async (id) => {
        return await client.delete(CATEGORY_ENDPOINTS.SUBCATEGORY.DELETE(id));
    },

    // Sub-Subcategory
    getAllSubSubcategories: async (params = {}) => {
        return await client.get(CATEGORY_ENDPOINTS.SUBSUBCATEGORY.ALL, { params });
    },
    createSubSubcategory: async (data) => {
        return await client.post(CATEGORY_ENDPOINTS.SUBSUBCATEGORY.CREATE, data);
    },
    updateSubSubcategory: async (id, data) => {
        return await client.put(CATEGORY_ENDPOINTS.SUBSUBCATEGORY.UPDATE(id), data);
    },
    deleteSubSubcategory: async (id) => {
        return await client.delete(CATEGORY_ENDPOINTS.SUBSUBCATEGORY.DELETE(id));
    }
};

export default categoryApi;
