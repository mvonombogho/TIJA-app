import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // Replace with your actual API base URL when available
  baseURL: 'https://api.tija-app.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from local storage or secure storage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors like authentication issues
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized errors (redirect to login)
        localStorage.removeItem('auth_token');
        // You might want to trigger a redux action here to update auth state
      }
    }
    
    return Promise.reject(error);
  }
);

// Export API functions for each domain
export const taskService = {
  // Get all tasks
  getTasks: () => api.get('/tasks'),
  
  // Get a single task
  getTask: (id) => api.get(`/tasks/${id}`),
  
  // Create a new task
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Update a task
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  // Delete a task
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const authService = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

export const focusService = {
  // Get focus sessions
  getSessions: () => api.get('/focus/sessions'),
  
  // Create a new focus session
  createSession: (sessionData) => api.post('/focus/sessions', sessionData),
  
  // Update a focus session
  updateSession: (id, sessionData) => api.put(`/focus/sessions/${id}`, sessionData),
  
  // Get focus insights
  getInsights: () => api.get('/focus/insights'),
};

export default api;
