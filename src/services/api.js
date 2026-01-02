/**
 * API Service
 * Centralized Axios instance with interceptors
 */

import axios from 'axios';
import useUserStore from '@/store/useUserStore';
import useAppStore from '@/store/useAppStore';
import { MESSAGES } from '@/utils/constants';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const { token } = useUserStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { showError } = useAppStore.getState();
    const { logout } = useUserStore.getState();
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          showError(MESSAGES.ERROR.UNAUTHORIZED);
          logout();
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          showError(MESSAGES.ERROR.FORBIDDEN);
          window.location.href = '/403';
          break;
          
        case 404:
          showError('Resource not found');
          break;
          
        case 422:
          // Validation error
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(', ');
            showError('Validation Error', errorMessages);
          } else {
            showError(data.message || 'Validation failed');
          }
          break;
          
        case 500:
          showError(MESSAGES.ERROR.SERVER);
          break;
          
        default:
          showError(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      showError(MESSAGES.ERROR.NETWORK);
    } else {
      showError('Something went wrong');
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const apiService = {
  // GET request
  get: async (url, params = {}) => {
    return api.get(url, { params });
  },
  
  // POST request
  post: async (url, data = {}) => {
    return api.post(url, data);
  },
  
  // PUT request
  put: async (url, data = {}) => {
    return api.put(url, data);
  },
  
  // PATCH request
  patch: async (url, data = {}) => {
    return api.patch(url, data);
  },
  
  // DELETE request
  delete: async (url) => {
    return api.delete(url);
  },
  
  // Upload file
  upload: async (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  // Download file
  download: async (url, filename) => {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response], { type: response.type });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    return response;
  },
};

export default api;
