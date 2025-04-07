// reviewRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getBusReviews,
  createReview,
  // updateReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/:busId/reviews', getBusReviews); // Matches frontend call

// Protected routes
//use either when needed
router.post('/:busId/reviews', protect, createReview);
// router.post('/', protect, createReview);


// router.put('/:id', protect, updateReview);

module.exports = router;