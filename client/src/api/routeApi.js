// src/api/routeApi.js
import axios from './axios';

/**
 * Fetch all available routes
 * @returns {Promise<Array>} List of routes
 */
export const getAllRoutes = async () => {
  const response = await axios.get('/routes');
  return response.data;
};

/**
 * Fetch stops for a given route
 * @param {string} routeId - Route ID
 * @returns {Promise<Array>} List of stops for the route
 */
export const fetchRouteStops = async (routeId) => {
  const response = await axios.get(`/routes/${routeId}/stops`);
  return response.data;
};