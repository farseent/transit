const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply auth middleware to all admin routes
router.use(authMiddleware.protect);
router.use(adminMiddleware.adminRequired);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/status', adminController.toggleUserStatus);

// Bus management
router.post('/buses', adminController.createBus);
router.put('/buses/:busId/owner', adminController.assignBusToOwner);

// Route management
router.post('/routes', adminController.createRoute);

// System stats
router.get('/stats', adminController.getSystemStats);

// Add these to the existing routes

// System settings
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);

// Data endpoints
router.get('/owners', adminController.getOwners);
router.get('/buses', adminController.getBuses);
router.get('/routes', adminController.getRoutes);
router.get('/complaints/recent', adminController.getRecentComplaints);

module.exports = router;