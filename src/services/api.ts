import axios, { CancelToken } from 'axios';
import { API_CONFIG } from '../config';

// Create axios instance for dispersions API
const api = axios.create({
  baseURL: API_CONFIG.DISPERSIONS_API_BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT,
});

// Create axios instance for user details API
export const userDetailsApi = axios.create({
  baseURL: API_CONFIG.USER_DETAILS_API_BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor to log API calls in development
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use((config) => {
    console.log(`🌐 [Dispersions API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  userDetailsApi.interceptors.request.use((config) => {
    console.log(`👥 [User Details API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });
}

export const createCancelToken = () => axios.CancelToken.source();

export default api;
