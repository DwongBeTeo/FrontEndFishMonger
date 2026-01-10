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

    // user
        // Product endpoints
        GET_PRODUCT_FOR_HOME: '/products?page=0&size=8',
        GET_ALL_ACTIVE_PRODUCTS: '/products',
        GET_4PRODUCTS_BY_CATEGORY: (categoryId) => `/products/category/${categoryId}?page=0&size=4`,
        // lấy tất cả sản phẩm có chung CategoryId
        GET_ALL_PRODUCTS_BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
        GET_PRODUCT_DETAILS: (productId) => `/products/${productId}`,
    // End user
    // cloudinary
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}