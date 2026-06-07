export const BASE_URL = 'http://localhost:3006';

export const AUTH_ENDPOINTS = {
    LOGIN: '/v2/admin/login',
    PROFILE: '/v2/admin/me',
    UPDATE_PROFILE: '/v1/admin/update-profile',
    LOGOUT: '/v1/user/logout',
    FORGOT_PASSWORD: '/v2/admin/forgot-password',
    RESET_PASSWORD: '/v2/admin/reset-password',
    CHANGE_PASSWORD: '/v1/admin/change-password',
    REQUEST_PASSWORD_OTP: '/v1/admin/request-password-otp',
};

export const CATEGORY_ENDPOINTS = {
    CATEGORY: {
        ALL: '/v1/category/all',
        CREATE: '/v1/category/create',
        UPDATE: (id: string) => `/v1/category/update/${id}`,
        DELETE: (id: string) => `/v1/category/delete/${id}`,
    },
    SUBCATEGORY: {
        ALL: '/v1/subcategory/all',
        CREATE: '/v1/subcategory/create',
        UPDATE: (id: string) => `/v1/subcategory/update/${id}`,
        DELETE: (id: string) => `/v1/subcategory/delete/${id}`,
    },
    SUBSUBCATEGORY: {
        ALL: '/v1/sub-subcategory/all',
        CREATE: '/v1/sub-subcategory/create',
        UPDATE: (id: string) => `/v1/sub-subcategory/update/${id}`,
        DELETE: (id: string) => `/v1/sub-subcategory/delete/${id}`,
    }
};

export const PRODUCT_ENDPOINTS = {
    ALL: '/v1/product',
    CREATE: '/v1/product/create',
    UPDATE: (id: string) => `/v1/product/update/${id}`,
    DELETE: (id: string) => `/v1/product/delete/${id}`,
    TOGGLE_STATUS: (id: string) => `/v1/product/toggle-status/${id}`,
};

export const BRAND_ENDPOINTS = {
    ALL: '/v1/brand',
    CREATE: '/v1/brand/create',
    UPDATE: (id: string) => `/v1/brand/update/${id}`,
    DELETE: (id: string) => `/v1/brand/delete/${id}`,
    TOGGLE_STATUS: (id: string) => `/v1/brand/toggle-status/${id}`,
};

export const UNIT_ENDPOINTS = {
    ALL: '/v1/unit',
    CREATE: '/v1/unit/create',
    UPDATE: (id: string) => `/v1/unit/update/${id}`,
    DELETE: (id: string) => `/v1/unit/delete/${id}`,
    TOGGLE_STATUS: (id: string) => `/v1/unit/toggle-status/${id}`,
};

export const TAX_ENDPOINTS = {
    ALL: '/v1/tax/all',
    CREATE: '/v1/tax/create',
    UPDATE: (id: string) => `/v1/tax/${id}`,
    DELETE: (id: string) => `/v1/tax/${id}`,
};

export const SIDEBAR_ENDPOINTS = {
    MENU: '/v1/sidebar',
    ALL: '/v1/sidebar/all',
};

export const ROLE_ENDPOINTS = {
    ALL: '/v1/role/all',
    BY_ID: (id: string) => `/v1/role/${id}`,
    CREATE: '/v1/role',
    UPDATE: (id: string) => `/v1/role/${id}`,
    DELETE: (id: string) => `/v1/role/${id}`,
};

export const STAFF_ENDPOINTS = {
    ALL: '/v1/admin/all-staff',
    CREATE: '/v1/admin/create-staff',
    DELETE: (id: string) => `/v1/admin/staff/${id}`, // Assuming this exists or will be added
};

export const PERMISSION_ENDPOINTS = {
    ALL: '/v1/permission/all',
};

export const BANNER_ENDPOINTS = {
    ALL: '/v1/banner',
    CREATE: '/v1/banner/create',
    UPDATE: (id: string) => `/v1/banner/update/${id}`,
    DELETE: (id: string) => `/v1/banner/delete/${id}`,
};

export const CUSTOMER_ENDPOINTS = {
    ALL: '/v1/customer/admin/all',
    BY_ID: (id: string) => `/v1/customer/admin/${id}`,
    UPDATE: (id: string) => `/v1/customer/admin/${id}`,
    DELETE: (id: string) => `/v1/customer/admin/${id}`,
    TOGGLE_STATUS: (id: string) => `/v1/customer/admin/${id}/status`,
    // OTP Flow
    SEND_OTP: '/v1/customer/admin/send-otp',
    VERIFY_OTP: '/v1/customer/admin/verify-otp',
    COMPLETE_PROFILE: (id: string) => `/v1/customer/admin/complete-profile/${id}`,
};

export const QUERY_ENDPOINTS = {
    ALL: '/v1/query',
    BY_ID: (id: string) => `/v1/query/${id}`,
    STATUS: (id: string) => `/v1/query/${id}/status`,
    ASSIGN: (id: string) => `/v1/query/${id}/assign`,
    ADMIN_REPLY: (id: string) => `/v1/query/${id}/admin-reply`,
    DELETE: (id: string) => `/v1/query/${id}`,
    // Customer Facing (Public)
    CREATE: '/v2/query',
    MY_QUERIES: '/v2/query/my-queries',
    CUSTOMER_REPLY: (id: string) => `/v2/query/${id}/reply`,
};

export const SERVICE_PARTNER_ENDPOINTS = {
    ALL: '/v1/service-partner',
    SEND_OTP: '/v1/service-partner/send-otp',
    VERIFY_OTP: '/v1/service-partner/verify-otp',
    COMPLETE_REGISTRATION: '/v1/service-partner/complete-registration',
    BY_ID: (id: string) => `/v1/service-partner/${id}`,
    UPDATE_KYC: (id: string) => `/v1/service-partner/${id}/kyc`,
    TOGGLE_STATUS: (id: string) => `/v1/service-partner/${id}/status`,
};

export const COUPON_ENDPOINTS = {
    ALL: '/v1/coupon/all-coupons', 
    CREATE: '/v1/coupon/create-coupon',
    UPDATE: (id: string) => `/v1/coupon/update-coupon/${id}`,
    PATCH: (id: string) => `/v1/coupon/patch-coupon/${id}`,
    DELETE: (id: string) => `/v1/coupon/delete-coupon/${id}`,
};

export const ORDER_ENDPOINTS = {
    ALL: '/v1/order',
    BY_ID: (id: string) => `/v1/order/${id}`,
    UPDATE_STATUS: (id: string) => `/v1/order/${id}/status`,
};

export const CMS_ENDPOINTS = {
    PAGE: {
        GET: (pageKey: string) => `/v1/cms/page/${pageKey}`,
        UPDATE: (pageKey: string) => `/v1/cms/page/${pageKey}`,
    },
    FAQ: {
        ALL: '/v1/cms/faq',
        CREATE: '/v1/cms/faq',
        UPDATE: (id: string) => `/v1/cms/faq/${id}`,
        DELETE: (id: string) => `/v1/cms/faq/${id}`,
    }
};

