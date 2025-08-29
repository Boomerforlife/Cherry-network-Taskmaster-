import axios from 'axios';
import AsyncStorage from 'react-native-async-storage';

// API Configuration
const API_BASE_URL = 'http://10.0.2.2:8000'; // Change this to your Django server URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await AsyncStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        // You might want to dispatch a logout action here
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login/', credentials),
  
  // Register
  register: (userData) => api.post('/auth/register/', userData),
  
  // Logout
  logout: () => api.post('/auth/logout/'),
  
  // Get user profile
  getProfile: () => api.get('/profile/'),
  
  // Update user profile
  updateProfile: (profileData) => api.put('/profile/update/', profileData),
  
  // Change password
  changePassword: (passwordData) => api.put('/profile/change-password/', passwordData),
  
  // Get user stats
  getUserStats: () => api.get('/stats/'),
  
  // Refresh token
  refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
};

// Tasks API
export const tasksAPI = {
  // Get all tasks
  getTasks: (params) => api.get('/tasks/', { params }),
  
  // Get task by ID
  getTask: (id) => api.get(`/tasks/${id}/`),
  
  // Create task
  createTask: (taskData) => api.post('/tasks/', taskData),
  
  // Update task
  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  
  // Delete task
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
  
  // Complete task
  completeTask: (id, data) => api.post(`/tasks/${id}/complete/`, data),
  
  // Snooze task
  snoozeTask: (id, data) => api.post(`/tasks/${id}/snooze/`, data),
  
  // Start progress
  startProgress: (id) => api.post(`/tasks/${id}/start_progress/`),
  
  // Update progress
  updateProgress: (id, data) => api.post(`/tasks/${id}/update_progress/`, data),
  
  // Bulk update tasks
  bulkUpdate: (data) => api.post('/tasks/bulk_update/', data),
  
  // Get urgent tasks
  getUrgentTasks: () => api.get('/tasks/urgent/'),
  
  // Get overdue tasks
  getOverdueTasks: () => api.get('/tasks/overdue/'),
  
  // Get today's tasks
  getTodayTasks: () => api.get('/tasks/today/'),
  
  // Get week's tasks
  getWeekTasks: () => api.get('/tasks/week/'),
  
  // Get task analytics
  getTaskAnalytics: (params) => api.get('/analytics/', { params }),
  
  // Get smart suggestions
  getSmartSuggestions: () => api.get('/suggestions/'),
  
  // Get calendar view
  getCalendarView: (params) => api.get('/calendar/', { params }),
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: () => api.get('/categories/'),
  
  // Get category by ID
  getCategory: (id) => api.get(`/categories/${id}/`),
  
  // Create category
  createCategory: (categoryData) => api.post('/categories/', categoryData),
  
  // Update category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}/`, categoryData),
  
  // Delete category
  deleteCategory: (id) => api.delete(`/categories/${id}/`),
};

// Notifications API
export const notificationsAPI = {
  // Get notifications
  getNotifications: () => api.get('/notifications/'),
  
  // Mark notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/`, { is_read: true }),
  
  // Delete notification
  deleteNotification: (id) => api.delete(`/notifications/${id}/`),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      return {
        message: data.message || data.detail || `Error ${status}`,
        status,
        data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred.',
        status: 0,
      };
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
  
  // Clear all stored data
  clearStorage: async () => {
    try {
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'user_data',
        'tasks_cache',
        'categories_cache',
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
  
  // Set auth tokens
  setAuthTokens: async (accessToken, refreshToken) => {
    try {
      await AsyncStorage.multiSet([
        ['access_token', accessToken],
        ['refresh_token', refreshToken],
      ]);
    } catch (error) {
      console.error('Error setting tokens:', error);
    }
  },
};

export default api; 