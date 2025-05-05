// src/api/reviewApi.js
import axios from './axios';

/**
 * Fetch reviews for a specific bus
 * @param {string} busId - ID of the bus
 * @returns {Promise<Array>} List of reviews
 */
export const fetchBusReviews = async (busId) => {
  try {
    const response = await axios.get(`/reviews/buses/${busId}`);
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
    const response = await axios.post(`/reviews/buses/${busId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add review');
  }
};


/**
 * Update an existing review
 * @param {string} reviewId - ID of the review to update
 * @param {Object} reviewData - Updated review data
 * @returns {Promise<Object>} Updated review
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update review');
  }
};

/**
 * Delete a review
 * @param {string} reviewId - ID of the review to delete
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};