// complaintController.js
const Complaint = require('../models/Complaint');
const Bus = require('../models/Bus');
const mongoose = require('mongoose');

// Get all complaints for a bus
exports.getBusComplaints = async (req, res) => {
  try {
    // Check if user is admin or bus owner
    const bus = await Bus.findById(req.params.busId);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    if (req.user.role !== 'admin' && bus.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these complaints' });
    }
    
    const complaints = await Complaint.find({ bus: req.params.busId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;
    const busId = req.params.busId;
    
    // Validation
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ message: 'Invalid bus ID format' });
    }
    
    // Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    // Create new complaint
    const complaint = await Complaint.create({
      user: req.user._id,
      bus: busId,
      category,
      description,
      status: 'Pending' // Match the case in your enum
    });
    
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update complaint status (for admin or bus owner)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user is admin or bus owner
    const bus = await Bus.findById(complaint.bus);
    
    if (req.user.role !== 'admin' && bus.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }
    
    complaint.status = req.body.status || complaint.status;
    complaint.response = req.body.response || complaint.response;
    
    const updatedComplaint = await complaint.save();
    
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaints filed by current user
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('bus', 'busNumber')
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};