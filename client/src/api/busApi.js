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
  fetchBusDetails: async (busId, routeId, fromStopId, toStopId, arrivalTime ) => {
    
    const response = await axios.get(`/buses/${busId}`, {
      params: { routeId, fromStopId, toStopId, arrivalTime }
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
  toggleBusAvailability: async (busId) => {
    const response = await axios.put(`/buses/${busId}/toggle-availability`);
    return response.data;
  },

  // In busApi.js
  getOwnerBuses: async () => {
    try {
      console.log("[API] Making request to /buses/owner/my-buses");
      const response = await axios.get('/buses/owner/my-buses');
      console.log("[API] Response status:", response.status);
      return response.data;
    } catch (error) {
      console.error("[API] Full error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }
};

export default busApi;