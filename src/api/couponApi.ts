import client from './client';
import { COUPON_ENDPOINTS } from './endpoint';

/**
 * API service for Coupon related operations
 */
export const couponApi = {
    /**
     * Fetch all coupons
     * @param {Object} params - Query parameters like isActive, type, etc.
     */
    getAllCoupons: async (params = {}) => {
        return await client.get(COUPON_ENDPOINTS.ALL, { params });
    },

    /**
     * Create a new coupon
     * @param {Object} couponData 
     */
    createCoupon: async (couponData: any) => {
        return await client.post(COUPON_ENDPOINTS.CREATE, couponData);
    },

    /**
     * Update an existing coupon
     * @param {string} id 
     * @param {Object} couponData 
     */
    updateCoupon: async (id: string, couponData: any) => {
        return await client.put(COUPON_ENDPOINTS.UPDATE(id), couponData);
    },

    /**
     * Patch an existing coupon (partial update)
     * @param {string} id 
     * @param {Object} couponData 
     */
    patchCoupon: async (id: string, couponData: any) => {
        return await client.patch(COUPON_ENDPOINTS.PATCH(id), couponData);
    },

    /**
     * Delete a coupon
     * @param {string} id 
     */
    deleteCoupon: async (id: string) => {
        return await client.delete(COUPON_ENDPOINTS.DELETE(id));
    }
};

export default couponApi;
