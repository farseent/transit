// src/api/busApi.js
import axios from './axios';

const busApi = {
  /**
   * Fetch details of a specific bus
   * @param {string} busId - ID of the bus
   * @param {string} routeId - ID of the route
   * @param {string} fromStopId - ID of the departure stop
   * @param {string} toStopId - ID of the destination stop
   * @returns {Promise<Object>} Bus details
   */
  fetchBusDetails: async (busId, routeId, fromStopId, toStopId) => {
    
    const response = await axios.get(`/buses/${busId}`, {
      params: { routeId, fromStopId, toStopId }
    });
    return response.data;
  },

  /**
   * Fetch all buses
   * @returns {Promise<Array>} List of all buses
   */
  fetchBuses: async () => {
    const response = await axios.get('/buses');
    return response.data;
  },

  /**
   * Update bus availability status
   * @param {string} busId - ID of the bus
   * @param {Object} availabilityData - Availability status update data
   * @returns {Promise<Object>} Updated bus details
   */
  updateBusAvailability: async (busId, availabilityData) => {
    const response = await axios.patch(`/buses/${busId}/availability`, availabilityData);
    return response.data;
  }
};

export default busApi;