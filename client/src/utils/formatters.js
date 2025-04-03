/**
 * Format time string to display format
 * @param {string} timeString - ISO date string or time string
 * @returns {string} Formatted time (e.g., "09:30 AM")
 */
export const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Invalid time format:', error);
      return timeString;
    }
  };
  
  /**
   * Format duration in minutes to readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration (e.g., "2h 30m")
   */
  export const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };
  
  /**
   * Format currency amount
   * @param {number} amount - Currency amount
   * @param {string} currencyCode - Currency code (default: INR)
   * @returns {string} Formatted currency (e.g., "₹250.00")
   */
  export const formatCurrency = (amount, currencyCode = 'INR') => {
    if (amount === undefined || amount === null) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Format date to readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "Mar 15, 2023")
   */
  export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Invalid date format:', error);
      return dateString;
    }
  };