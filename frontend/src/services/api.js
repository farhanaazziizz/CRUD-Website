import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error.response?.data || error);
  }
);

// Client API
export const clientAPI = {
  getAll: (params = {}) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getStats: () => api.get('/clients/stats'),
  getExpiringSoon: () => api.get('/clients/expiring-soon'),
};

// Notification API
export const notificationAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  triggerManualCheck: () => api.post('/notifications/trigger-check'),
  getStats: () => api.get('/notifications/stats'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getExpiringSoon: () => api.get('/dashboard/expiring-soon'),
};

// Export API
export const exportAPI = {
  exportToExcel: () => api.get('/export/excel'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;