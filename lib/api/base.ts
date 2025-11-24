/**
 * Axios API Base Configuration with Interceptors
 * 
 * This module provides a configured Axios instance with request/response interceptors
 * for authentication, error handling, and logging.
 * 
 * Features:
 * - Automatic JWT token injection from localStorage
 * - Request/response logging in development
 * - Centralized error handling
 * - TypeScript support with proper typing
 * - Skip auth option for public endpoints
 * 
 * Usage:
 * ```typescript
 * import { api, paginatedApi, handleApiError } from '@/lib/api/base';
 * 
 * // Basic API calls
 * const response = await api.get<User>('/users/1');
 * const users = await paginatedApi.get<User>('/users');
 * 
 * // Skip authentication for public endpoints
 * const publicData = await api.get('/public/data', { skipAuth: true });
 * 
 * // Error handling
 * try {
 *   const data = await api.post('/users', userData);
 * } catch (error) {
 *   const apiError = handleApiError(error);
 *   console.error(apiError.message);
 * }
 * ```
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types/api';



export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

// Base API configuration
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8001/api';
// const API_BASE_URL = 'https://pl.snapsbooking.com/api';
const API_BASE_URL = 'http://127.0.0.1:8000/api';
// const API_BASE_URL = 'http://10.128.76.231:8000/api';


// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig &
  ApiRequestConfig & {
    _retry?: boolean;
  };


// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available and not skipped
    const apiConfig = config as InternalAxiosRequestConfig & ApiRequestConfig;

    if (!apiConfig.skipAuth) {
      config.params = {
        ...config.params,
      }
      config.data = {
        ...config.data,
      }
      config.headers['X-Timezone'] = 'America/Toronto';
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      
      console.error(`❌ API Error ${status}:`, data);

      switch (status) {
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 422:
          // Validation error
          console.error('Validation error:', data);
          break;
        case 500:
          // Server error
          console.error('Internal server error');
          break;
        default:
          console.error(`Unhandled error status: ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error: No response received', error.request);
    } else {
      // Something else happened
      console.error('❌ Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Generic API methods with proper typing
export const api = {
  get: <T = unknown>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.get(url, config),
  
  post: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.post(url, data, config),
  
  put: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.put(url, data, config),
  
  patch: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.patch(url, data, config),
  
  delete: <T = unknown>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.delete(url, config),
};

// Paginated API methods
export const paginatedApi = {
  get: <T = unknown>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<PaginatedResponse<T>>> =>
    apiClient.get(url, config),
};

// Utility function to handle API errors consistently
export const handleApiError = (error: AxiosError): ApiResponse<unknown> => {
  return error.response?.data as ApiResponse<unknown>;
};

// Helper functions for common API operations
export const apiHelpers = {
  // Extract data from API response
  extractData: <T>(response: AxiosResponse<ApiResponse<T>>): T | null => {
    return response.data.success ? response.data.results || null : null;
  },

  // Check if response is successful
  isSuccess: <T>(response: AxiosResponse<ApiResponse<T>>): boolean => {
    return response.data.success === true;
  },

  // Get error message from response
  getErrorMessage: <T>(response: AxiosResponse<ApiResponse<T>>): string | null => {
    return response.data.message || null;
  },

  // Get validation errors from response
  getValidationErrors: <T>(response: AxiosResponse<ApiResponse<T>>): Record<string, string[]> | null => {
    return response.data.errors || null;
  },
};

// Export the axios instance for direct use if needed
export default apiClient;
