// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchBuses } = require('../controllers/searchController');

// Your existing route
router.get('/', searchBuses);
router.post('/buses', searchBuses);

module.exports = router;