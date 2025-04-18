// busRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllBuses,
  getBusById,
  // createBus,
  // updateBus,
  toggleBusAvailability,
  getMyBuses
} = require('../controllers/busController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBuses);

// Protected routes
// Protected routes
router.get('/owner/my-buses', protect, authorize('owner'), getMyBuses); // Changed from authorize to authorize('owner')
router.put('/:id/toggle-availability', protect, toggleBusAvailability);
router.get('/:id', getBusById);

// router.post('/', protect, ownerProtect, createBus);
// router.put('/:id', protect, updateBus);

module.exports = router;