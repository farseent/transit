// src/api/reviewApi.js
import axios from './axios';

/**
 * Fetch reviews for a specific bus
 * @param {string} busId - ID of the bus
 * @returns {Promise<Array>} List of reviews
 */
export const fetchBusReviews = async (busId) => {
  const response = await axios.get(`/buses/${busId}/reviews`);
  return response.data;
};

/**
 * Add a review for a bus
 * @param {string} busId - ID of the bus
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} Added review
 */
export const addReview = async (busId, reviewData) => {
  const response = await axios.post(`/buses/${busId}/reviews`, reviewData);
  return response.data;
};