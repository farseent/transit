// userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUserReviews,
  getUserComplaints
  // updateUserProfile,
  // getUserHistory 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser); 
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/reviews', protect, getUserReviews); // Make sure this is added
router.get('/complaints', protect, getUserComplaints); // Make sure this is added
// router.put('/profile', protect, updateUserProfile);
// router.get('/history', protect, getUserHistory);

module.exports = router;