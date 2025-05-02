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

  getOwnerBusById: async (busId) =>{
    try {
      console.log('sending request with busId',busId);
      
      const response = await axios.get(`/buses/owner/${busId}`);
      console.log('recieved data in busapi',response.data);
      return response.data; // Return the bus data
    } catch (error) {
      console.error('[ERROR] getOwnerBusById:', error);
      throw error.response?.data || { message: 'Failed to fetch bus details' };
    }
  },
};

export default busApi;