const mongoose = require('mongoose');

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
  // journey: {
  //   fromStop: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Stop',
  //     required: true
  //   },
  //   toStop: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Stop',
  //     required: true
  //   },
  //   date: {
  //     type: Date,
  //     required: true
  //   }
  // },
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
    enum: ['Pending', 'Under Review', 'Resolved', 'Rejected'],
    default: 'Pending'
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