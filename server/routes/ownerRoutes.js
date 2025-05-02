const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const ownerController = require('../controllers/ownerController');


router.get('/buses', protect, authorize('owner'), ownerController.getMyBuses);
router.get('/buses/:busId', protect, authorize('owner'), ownerController.getOwnerBusDetail);
router.get('/buses/:busId/reviews', protect, authorize('owner'), ownerController.getBusReviewsForOwner);
router.put('/buses/:id/toggle-availability', protect, authorize('owner'), ownerController.toggleBusAvailability);


module.exports = router;