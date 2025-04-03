// complaintRoutes.js
const express = require('express');
const router = express.Router();
const {
  getBusComplaints,
  createComplaint,
  updateComplaintStatus,
  getMyComplaints
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/bus/:busId', protect, getBusComplaints);
router.post('/', protect, createComplaint);
router.put('/:id/status', protect, updateComplaintStatus);
router.get('/my-complaints', protect, getMyComplaints);

module.exports = router;