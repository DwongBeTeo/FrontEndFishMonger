export const BASE_URL = 'http://localhost:8080/api/v1.0';

const CLOUDINARY_CLOUD_NAME = 'dt23ui4pe';


export const API_ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    GET_USER_INFO: '/profile',
    // admin
        // Category endpoints
        GET_ALL_CATEGORIES: '/admin/categories',
        ADD_CATEGORY: '/admin/categories',
        UPDATE_CATEGORY: (categoryId) => `/admin/categories/${categoryId}`,
        DELETE_CATEGORY: (categoryId) => `/admin/categories/${categoryId}`,
        RESTORE_CATEGORY: (categoryId) => `/admin/categories/${categoryId}/restore`,

        // Product endpoints
        GET_ALL_PRODUCTS: '/admin/products',
        ADD_PRODUCT: '/admin/products',
        UPDATE_PRODUCT: (productId) => `/admin/products/${productId}`,
        DELETE_PRODUCT: (productId) => `/admin/products/${productId}`,
    // End admin

    
    // cloudinary
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}