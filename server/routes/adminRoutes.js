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
router.get('/users/:userId', adminController.getUser);//--------------
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/status', adminController.toggleUserStatus);

// ========== BUS MANAGEMENT ==========
router.get('/buses', adminController.getBuses);
router.get('/buses/paginated', adminController.getBusesPaginated); // NEW
router.get('/buses/:busId', adminController.getBus); // NEW
router.post('/buses', adminController.createBus);
router.put('/buses/:busId', adminController.updateBus); // NEW
router.put('/buses/:busId/owner', adminController.assignBusToOwner);
router.delete('/buses/:busId', adminController.deleteBus); // NEW

// ========== ROUTE MANAGEMENT ==========
router.get('/routes', adminController.getRoutes);
router.get('/routes/paginated', adminController.getRoutesPaginated); // NEW
router.get('/routes/:routeId', adminController.getRoute); // NEW
router.post('/routes', adminController.createRoute);
router.put('/routes/:routeId', adminController.updateRoute); // NEW
router.delete('/routes/:routeId', adminController.deleteRoute); // NEW

// ========== STOP MANAGEMENT ==========
router.get('/stops', adminController.getStops); // NEW
router.post('/stops', adminController.createStop); // NEW
router.delete('/stops/:stopId', adminController.deleteStop); // NEW

// ========== COMPLAINT MANAGEMENT ==========
router.get('/complaints', adminController.getAllComplaints); // NEW
router.get('/complaints/recent', adminController.getRecentComplaints);
router.get('/complaints/:complaintId', adminController.getComplaint); // NEW
router.put('/complaints/:complaintId/status', adminController.updateComplaintStatus); // NEW

// ========== SYSTEM STATS & SETTINGS ==========
router.get('/stats', adminController.getSystemStats);
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);

// ========== OWNER MANAGEMENT ==========
router.get('/owners', adminController.getOwners);

// ========== ACTIVITY LOGS ==========
router.get('/activity-logs', adminController.getActivityLogs); // NEW


module.exports = router;