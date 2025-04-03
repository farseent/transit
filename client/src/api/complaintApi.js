/ src/api/complaintApi.js
import axios from './axios';

/**
 * Submit a complaint for a bus
 * @param {string} busId - ID of the bus
 * @param {Object} complaintData - Complaint details
 * @returns {Promise<Object>} Submitted complaint
 */
export const addComplaint = async (busId, complaintData) => {
  const response = await axios.post(`/buses/${busId}/complaints`, complaintData);
  return response.data;
};

/**
 * Fetch complaints made by a user
 * @returns {Promise<Array>} List of user complaints
 */
export const getUserComplaints = async () => {
  const response = await axios.get('/users/complaints');
  return response.data;
};
