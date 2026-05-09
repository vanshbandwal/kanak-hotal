import client from './client';
import { UNIT_ENDPOINTS } from './endpoint';

/**
 * API service for Unit related operations
 */
export const unitApi = {
    getAllUnits: async (params = {}) => {
        return await client.get(UNIT_ENDPOINTS.ALL, { params });
    },
    createUnit: async (data) => {
        return await client.post(UNIT_ENDPOINTS.CREATE, data);
    },
    updateUnit: async (id, data) => {
        return await client.put(UNIT_ENDPOINTS.UPDATE(id), data);
    },
    deleteUnit: async (id) => {
        return await client.delete(UNIT_ENDPOINTS.DELETE(id));
    },
    toggleUnitStatus: async (id) => {
        return await client.patch(UNIT_ENDPOINTS.TOGGLE_STATUS(id));
    }
};

export default unitApi;
