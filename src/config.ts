// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Mock server URLs (used in development)
const MOCK_DISPERSIONS_API_URL = 'http://localhost:3001';
const MOCK_USER_DETAILS_API_URL = 'http://localhost:3002';

// Production API URLs
const PROD_DISPERSIONS_API_URL = 'http://172.20.0.5:8080/api';
const PROD_USER_DETAILS_API_URL = 'http://localhost:8080'; // Update this when user details API is deployed

export const API_CONFIG = {
  // Use mock APIs in development, production APIs otherwise
  DISPERSIONS_API_BASE_URL: isDevelopment ? MOCK_DISPERSIONS_API_URL : PROD_DISPERSIONS_API_URL,
  USER_DETAILS_API_BASE_URL: isDevelopment ? MOCK_USER_DETAILS_API_URL : PROD_USER_DETAILS_API_URL,
  
  // Legacy URL for backward compatibility (points to dispersions API)
  BASE_URL: isDevelopment ? MOCK_DISPERSIONS_API_URL : PROD_DISPERSIONS_API_URL,
  
  POLL_INTERVAL: 2000, // milliseconds
  TIMEOUT: 60000, // 1 minute timeout for API calls
  
  // Default headers for all API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'x-dispersions-user-id': 'user123', // Default user ID for development
  },
};

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  background: '#f9fafb',
  grid: '#e5e7eb',
};

export default API_CONFIG;