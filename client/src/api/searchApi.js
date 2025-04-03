//searchApi.js

import axiosInstance from './axios';
// import axios from './axios';

/**
 * Search for buses based on route and stops
 * @param {string} routeId - Route ID
 * @param {string} fromStop - Origin stop ID
 * @param {string} toStop - Destination stop ID
 * @returns {Promise<Array>} List of buses matching the search criteria
 */
// searchApi.js
export const searchBuses = async (params) => {
  // If you're passing an object
  const { routeId, fromStop, toStop } = params;
  console.log('Sending search request with:', { routeId, fromStop, toStop });
  
  try {
    const response = await axiosInstance.post('/search/buses', {
      routeId:routeId,
      fromStopId: fromStop,
      toStopId: toStop       
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching buses:', error);
    throw error;
  }
};
/**
 * Get detailed information about a specific bus
 * @param {string} busId - Bus ID
 * @param {string} fromStop - Origin stop ID
 * @param {string} toStop - Destination stop ID
 * @returns {Promise<Object>} Detailed bus information
 */
export const getBusDetails = async (busId, fromStop, toStop) => {
  try {
    const response = await axiosInstance.get(`/api/buses/${busId}`, {
      params: {
        fromStop,
        toStop
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching bus details:', error);
    throw error;
  }
};