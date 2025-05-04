//userApi.js

import axiosInstance from './axios';

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response with user data and token
 */
export const login = async (credentials) => {
  console.log('Sending registration data:', credentials);
  const response = await axiosInstance.post('/users/login', credentials);
  console.log('Login API response:', response.data); // Add this
  return response.data;
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Response with registration status
 */
export const register = async (userData) => {
  try {
    console.log('Sending registration data:', userData);
    const response = await axiosInstance.post('/users/register', userData);
    return response.data;
  } catch (error) {
    const errorDetails = {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        data: error.config?.data
      },
      message: error.message
    };
    console.error('Full registration error:', errorDetails);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put('/users/profile', profileData);
  return response.data;
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Response with password change status
 */
export const changePassword = async (passwordData) => {
  const response = await axiosInstance.post('/users/change-password', passwordData);
  return response.data;
};

/**
 * Fetch reviews written by the current user
 * @returns {Promise<Array>} List of user's reviews
 */
export const getUserReviews = async () => {
  const response = await axiosInstance.get('/users/reviews');
  return response.data;
};

/**
 * Fetch complaints submitted by the current user
 * @returns {Promise<Array>} List of user's complaints
 */
export const getUserComplaints = async () => {
  const response = await axiosInstance.get('/users/complaints');
  return response.data;
};

export default {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  getUserReviews,
  getUserComplaints
};