import client from './client';
import { TAX_ENDPOINTS } from './endpoint';

/**
 * API service for Tax related operations
 */
export const taxApi = {
    getAllTaxes: async (params = {}) => {
        return await client.get(TAX_ENDPOINTS.ALL, { params });
    },
    createTax: async (data) => {
        return await client.post(TAX_ENDPOINTS.CREATE, data);
    },
    updateTax: async (id, data) => {
        return await client.put(TAX_ENDPOINTS.UPDATE(id), data);
    },
    deleteTax: async (id) => {
        return await client.delete(TAX_ENDPOINTS.DELETE(id));
    }
};

export default taxApi;
