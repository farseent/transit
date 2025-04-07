//searchApi.js

import axiosInstance from './axios';

/**
 * Search for buses based on route and stops
 * @param {Object} params - Search parameters
 * @param {string} params.routeId - Route ID
 * @param {string} params.fromStop - Origin stop ID
 * @param {string} params.toStop - Destination stop ID
 * @returns {Promise<Array>} List of buses matching the search criteria
 */
export const searchBuses = async (params) => {
  const { routeId, fromStopId, toStopId } = params;
  // console.log('Sending search request with:', { routeId, fromStopId, toStopId });
  
  try {
    const response = await axiosInstance.post('/search/buses', {
      routeId,
      fromStopId,
      toStopId       
    });

    // Map the buses and include names in the response
    const mappedResponse = {
      buses: response.data.buses.map(bus => ({
        _id: bus._id,
        busNumber: bus.busNumber || bus.regNumber,
        busName: bus.busName,
        arrivalTime: bus.arrivalTime,
        destinationTime: bus.destinationTime,
        duration: bus.journeyDuration,
        fare: bus.fare,
        averageRating: bus.ratings?.overall || 0,
        reviewCount: bus.numReviews || 0,
        isAvailable: bus.isAvailable
      })),
      routeName: response.data.routeName,
      fromStopName: response.data.fromStopName,
      toStopName: response.data.toStopName
    };

    return mappedResponse;
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
    const response = await axiosInstance.get(`/buses/${busId}`, {
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