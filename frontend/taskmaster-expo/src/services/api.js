import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'http://10.0.2.2:8000'; // Android emulator localhost

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      try {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
      } catch (storageError) {
        console.log('Error removing tokens:', storageError);
      }
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  refresh: (refreshToken) => api.post('/api/auth/refresh/', { refresh: refreshToken }),
};

// Tasks API endpoints
export const tasksAPI = {
  getAll: (params) => api.get('/api/tasks/', { params }),
  getById: (id) => api.get(`/api/tasks/${id}/`),
  create: (taskData) => api.post('/api/tasks/', taskData),
  update: (id, taskData) => api.put(`/api/tasks/${id}/`, taskData),
  delete: (id) => api.delete(`/api/tasks/${id}/`),
  markComplete: (id) => api.patch(`/api/tasks/${id}/`, { status: 'completed' }),
};

// Categories API endpoints
export const categoriesAPI = {
  getAll: () => api.get('/api/categories/'),
  create: (categoryData) => api.post('/api/categories/', categoryData),
  update: (id, categoryData) => api.put(`/api/categories/${id}/`, categoryData),
  delete: (id) => api.delete(`/api/categories/${id}/`),
};

// User profile API endpoints
export const userAPI = {
  getProfile: () => api.get('/api/users/profile/'),
  updateProfile: (profileData) => api.put('/api/users/profile/', profileData),
  changePassword: (passwordData) => api.post('/api/users/change-password/', passwordData),
};

export default api; 