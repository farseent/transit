//axios.js

import axios from 'axios';
import { getToken, removeToken } from '../utils/localStorage';

// Create axios instance with base URL from environment variable
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized error (401), remove token and potentially redirect
    if (error.response && error.response.status === 401) {
      removeToken();
      // In a real app, you would redirect to login here or trigger an auth context update
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;