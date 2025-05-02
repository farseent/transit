// busRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllBuses,
  getBusById,
  toggleBusAvailability,
  getMyBuses,
  getOwnerBusDetail,
} = require('../controllers/busController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBuses);

// Protected routes
router.get('/:id', getBusById);
router.get('/owner/:busId', protect, authorize, getOwnerBusDetail);
// router.post('/', protect, ownerProtect, createBus);
// router.put('/:id', protect, updateBus);

module.exports = router;