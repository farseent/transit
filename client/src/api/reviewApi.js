// src/api/reviewApi.js
import axios from './axios';

/**
 * Fetch reviews for a specific bus
 * @param {string} busId - ID of the bus
 * @returns {Promise<Array>} List of reviews
 */
export const fetchBusReviews = async (busId) => {
  try {
    const response = await axios.get(`/buses/${busId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

/**
 * Add a review for a bus
 * @param {string} busId - ID of the bus
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} Added review
 */
export const addReview = async (busId, reviewData) => {
  try {
    const response = await axios.post(`/buses/${busId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add review');
  }
};