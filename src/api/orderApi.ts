import client from './client';
import { ORDER_ENDPOINTS } from './endpoint';

/**
 * API service for Order related operations
 */
export const orderApi = {
    /**
     * Get all orders with optional filtering and pagination
     * @param {Object} params - Query parameters (page, limit, status, paymentStatus, customerId)
     */
    getAllOrders: async (params = {}) => {
        return await client.get(ORDER_ENDPOINTS.ALL, { params });
    },

    /**
     * Get order statistics
     */
    getOrderStats: async () => {
        return await client.get(ORDER_ENDPOINTS.STATS);
    },

    /**
     * Get an order by ID
     * @param {string} id - Order ID
     */
    getOrderById: async (id: string) => {
        return await client.get(ORDER_ENDPOINTS.BY_ID(id));
    },

    /**
     * Update an order's status
     * @param {string} id - Order ID
     * @param {string} status - New status ('pending', 'accepted', 'assigned', 'out_for_delivery', 'delivered', 'rejected', 'cancelled', 'completed')
     */
    updateOrderStatus: async (id: string, status: string) => {
        return await client.put(ORDER_ENDPOINTS.UPDATE_STATUS(id), { status });
    }
};

export default orderApi;
