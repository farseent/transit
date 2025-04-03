// Key for storing the authentication token
const TOKEN_KEY = 'transit_hub_token';

/**
 * Save authentication token to localStorage
 * @param {string} token - The authentication token
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if token exists in localStorage
 * @returns {boolean} True if token exists, false otherwise
 */
export const hasToken = () => {
  return !!getToken();
};

export default {
  saveToken,
  getToken,
  removeToken,
  hasToken,
};