import axios from 'axios';
import { BASE_URL } from './apiEndpoints.jsx';
const axiosConfig = axios.create({
    
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

//list of endpoints that do not require authentication
const exCludeEndpoints = ['/login', '/register', '/healthCheck', '/activate', '/products/**'];

//request interceptor to add the auth token header to requests
axiosConfig.interceptors.request.use((config) =>{
    const shouldSkipToken = exCludeEndpoints.some((endpoint) => {
        return config.url?.includes(endpoint)
    });

    if(!shouldSkipToken){
        const accessToken = localStorage.getItem('token');
        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//response interceptor to handle responses globally
axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // if(error.response){
    //     //handle specific status codes\
    //     if(error.response.status === 401){
    //         window.location.href = '/login';
    //     }else if(error.response.status === 500){
    //         console.error('Server error occurred.');
    //     }
    // }else if(error.code === 'ECONNABORTED'){
    //     console.error('No response received from server.');
    // }
    return Promise.reject(error);
});

export default axiosConfig;