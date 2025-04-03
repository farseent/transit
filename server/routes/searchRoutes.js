// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchBuses } = require('../controllers/searchController');

// Add a test route
router.get('/test', (req, res) => {
  res.json({ message: 'Search route test is working' });
});

// Your existing route
router.post('/buses', searchBuses);

module.exports = router;