// transit-hub-backend/routes/rtoRoutes.js
const express = require('express');
const router = express.Router();
const rtoController = require('../controllers/rtoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get complaint statistics
router.get('/complaints/stats', protect, authorize('rto'), rtoController.getComplaintStats);

// Get recent complaints
router.get('/complaints/recent', protect, authorize('rto'), rtoController.getRecentComplaints);

// Get all complaints
router.get('/complaints/all', protect, authorize('rto'), rtoController.getComplaints);

// Get complaint by ID
router.get('/complaints/:id', protect, authorize('rto'), rtoController.getComplaintById);

// Update complaint status
router.patch('/complaints/:id/status', protect, authorize('rto'), rtoController.updateComplaintStatus);



module.exports = router;