// routeRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllRoutes,
  getRouteById,
  getRouteStops,
  getAllStops
} = require('../controllers/routeController');

// All public routes
router.get('/', getAllRoutes);
router.get('/:id', getRouteById);
router.get('/:id/stops', getRouteStops);
router.get('/stops/all', getAllStops);

module.exports = router;