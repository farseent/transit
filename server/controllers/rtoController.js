// transit-hub-backend/controllers/rtoController.js
const Complaint = require('../models/Complaint');
const Bus = require('../models/Bus');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');


exports.getComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Apply filters if provided
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.busId) {
      filter.bus = req.query.busId;
    }
    
    // Get complaints with pagination
    const complaints = await Complaint.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'bus',
        select: 'name regNumber',
        populate: {
          path: 'route',
          select: 'name'
        }
      });
    
    // Get total count for pagination
    const total = await Complaint.countDocuments(filter);
    
    console.log('Data sending from getComplaints =',page );
    

    res.status(200).json({
      complaints,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'bus',
        select: 'name regNumber',
        populate: {
          path: 'route',
          select: 'name'
        }
      });
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.status(200).json(complaint);
  } catch (error) {
    console.error(`Error getting complaint ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, rtoComment } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Validate status value
    const normalizedStatus = status.toLowerCase();
    const validStatuses = ['pending', 'inprogress', 'resolved', 'rejected'];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Additional validation for rejected status
    if (normalizedStatus === 'rejected' && !rtoComment) {
      return res.status(400).json({ message: 'Comment is required when rejecting' });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Add the new RTO comment to the array of comments
    const commentObj = {
      rtoId: req.user._id,
      comment: rtoComment || '',
      status: normalizedStatus,
      createdAt: new Date()
    };
    
    if (!complaint.rtoComments) {
      complaint.rtoComments = [];
    }
    
    complaint.rtoComments.push(commentObj);
    complaint.status = normalizedStatus;
    complaint.updatedAt = new Date();
    
    const updatedComplaint = await complaint.save();
    
    // Log the activity (but don't fail if this fails)
    try {
      await ActivityLog.create({
        user: req.user._id,
        action: 'update_complaint_status',
        details: {
          complaintId: complaint._id,
          prevStatus: complaint.status,
          newStatus: normalizedStatus
        }
      });
    } catch (logError) {
      console.error('Activity log failed:', logError);
    }
    
    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error(`Error updating complaint ${req.params.id}:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getComplaintStats = async (req, res) => {
  try {
    // Get counts for different statuses
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format the stats for frontend use
    const formattedStats = {
      total: 0,
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    };
    
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });
    
    res.status(200).json(formattedStats);
  } catch (error) {
    console.error('Error getting complaint stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getRecentComplaints = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name')
      .populate('bus', 'name regNumber');
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error getting recent complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};