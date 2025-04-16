// server/utils/timeUtils.js

// Compare "HH:MM" strings
function compareTimeStrings(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return (h1 * 60 + m1) - (h2 * 60 + m2);
  }
  
  // Add other time-related helpers here later if needed
  
  module.exports = {
    compareTimeStrings,
  };
  