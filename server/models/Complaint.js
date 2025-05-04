const mongoose = require('mongoose');

const rtoCommentSchema = mongoose.Schema({
  rtoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'inprogress', 'resolved', 'rejected'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ComplaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  category: {
    type: String,
    enum: ['Late Arrival', 'Early Departure', 'Cleanliness', 'Staff Behavior', 'Safety Concern', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'inprogress', 'resolved', 'rejected'],
    default: 'pending'
  },
  rtoComments: [rtoCommentSchema],
  
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  response: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);