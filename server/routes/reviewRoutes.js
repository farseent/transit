// reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getBusReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect , authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/buses/:busId', getBusReviews);

// Protected routes
router.post('/buses/:busId', protect, authorize('user') , createReview);

// New protected routes for edit/delete
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview); 

// router.put('/:busId/reviews', protect, updateReview);

module.exports = router;