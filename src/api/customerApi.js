import client from './client';
import { CUSTOMER_ENDPOINTS } from './endpoint';

/**
 * API service for Customer related operations in Admin Panel
 */
export const customerApi = {
    /**
     * Fetch all customers with pagination and search
     */
    getAllCustomers: async (params = {}) => {
        const response = await client.get(CUSTOMER_ENDPOINTS.ALL, { params });
        return response;
    },

    /**
     * Get customer by ID
     */
    getCustomerById: async (id) => {
        const response = await client.get(CUSTOMER_ENDPOINTS.BY_ID(id));
        return response;
    },

    /**
     * Step 1: Send OTP to initiate creation
     */
    sendOtp: async (phone) => {
        const response = await client.post(CUSTOMER_ENDPOINTS.SEND_OTP, { phone });
        return response;
    },

    /**
     * Step 2: Verify OTP
     */
    verifyOtp: async (phone, otp) => {
        const response = await client.post(CUSTOMER_ENDPOINTS.VERIFY_OTP, { phone, otp });
        return response;
    },

    /**
     * Step 3: Complete Profile
     */
    completeProfile: async (id, data) => {
        const response = await client.put(CUSTOMER_ENDPOINTS.COMPLETE_PROFILE(id), data);
        return response;
    },

    /**
     * Update customer details
     */
    updateCustomer: async (id, data) => {
        const response = await client.put(CUSTOMER_ENDPOINTS.UPDATE(id), data);
        return response;
    },

    /**
     * Delete a customer
     */
    deleteCustomer: async (id) => {
        const response = await client.delete(CUSTOMER_ENDPOINTS.DELETE(id));
        return response;
    },

    /**
     * Toggle customer active status
     */
    toggleStatus: async (id) => {
        const response = await client.patch(CUSTOMER_ENDPOINTS.TOGGLE_STATUS(id));
        return response;
    }
};

export default customerApi;
