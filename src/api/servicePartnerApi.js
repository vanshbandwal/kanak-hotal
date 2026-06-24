import client from './client';
import { SERVICE_PARTNER_ENDPOINTS } from './endpoint';

/**
 * API service for Service Partner Management
 */
export const servicePartnerApi = {
    /**
     * Fetch all partners with pagination and search
     * @param {Object} params 
     */
    getAllPartners: async (params = {}) => {
        return await client.get(SERVICE_PARTNER_ENDPOINTS.ALL, { params });
    },

    /**
     * Fetch service partner statistics
     */
    getPartnerStats: async () => {
        return await client.get(SERVICE_PARTNER_ENDPOINTS.STATS);
    },

    /**
     * Step 1: Send OTP to Partner
     * @param {string} phone 
     */
    sendOtp: async (phone) => {
        return await client.post(SERVICE_PARTNER_ENDPOINTS.SEND_OTP, { phone });
    },

    /**
     * Step 2: Verify OTP
     * @param {string} phone 
     * @param {string} otp 
     */
    verifyOtp: async (phone, otp) => {
        return await client.post(SERVICE_PARTNER_ENDPOINTS.VERIFY_OTP, { phone, otp });
    },

    /**
     * Step 3: Complete registration details
     * @param {Object} data 
     */
    completeRegistration: async (data) => {
        return await client.post(SERVICE_PARTNER_ENDPOINTS.COMPLETE_REGISTRATION, data);
    },

    /**
     * Get single partner details
     * @param {string} id 
     */
    getPartnerById: async (id) => {
        return await client.get(SERVICE_PARTNER_ENDPOINTS.BY_ID(id));
    },

    /**
     * Update KYC document status
     * @param {string} id 
     * @param {Object} kycData 
     */
    updateKycStatus: async (id, kycData) => {
        return await client.patch(SERVICE_PARTNER_ENDPOINTS.UPDATE_KYC(id), kycData);
    },

    /**
     * Update partner details
     * @param {string} id 
     * @param {Object} data 
     */
    updatePartner: async (id, data) => {
        return await client.patch(SERVICE_PARTNER_ENDPOINTS.BY_ID(id), data);
    },

    /**
     * Delete a partner
     * @param {string} id 
     */
    deletePartner: async (id) => {
        return await client.delete(SERVICE_PARTNER_ENDPOINTS.BY_ID(id));
    },

    /**
     * Toggle a partner's active status
     * @param {string} id 
     */
    toggleStatus: async (id) => {
        return await client.patch(SERVICE_PARTNER_ENDPOINTS.TOGGLE_STATUS(id));
    }
};

export default servicePartnerApi;
