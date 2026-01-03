export const BASE_URL = 'http://localhost:8080/api/v1.0';

const CLOUDINARY_CLOUD_NAME = 'dt23ui4pe';


export const API_ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    GET_USER_INFO: '/profile',
    // admin
    GET_ALL_CATEGORIES: '/admin/categories',
    ADD_CATEGORY: '/admin/categories',
    UPDATE_CATEGORY: (categoryId) => `/admin/categories/${categoryId}`,
    DELETE_CATEGORY: (categoryId) => `/admin/categories/${categoryId}`,
    // cloudinary
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}