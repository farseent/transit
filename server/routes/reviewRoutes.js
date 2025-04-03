// reviewRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getBusReviews,
  createReview,
  updateReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/bus/:busId', getBusReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);

module.exports = router;