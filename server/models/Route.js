const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a route name'],
    unique: true,
    trim: true
  },
  stops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop'
  }],
  // Distance between stops in kilometers
  distances: [Number],
  // Estimated time between stops in minutes
  times: [Number],
  // Fare multiplier per kilometer
  fareRate: {
    type: Number,
    required: true,
    default: 1.5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to calculate fare between two stops
RouteSchema.methods.calculateFare = function(fromStopIndex, toStopIndex) {
  if (fromStopIndex === toStopIndex) {
    return 0;
  }

  // Ensure the stop indices are in the correct order
  const startIndex = Math.min(fromStopIndex, toStopIndex);
  const endIndex = Math.max(fromStopIndex, toStopIndex);

  // Calculate the total distance
  let totalDistance = 0;
  for (let i = startIndex; i < endIndex; i++) {
    totalDistance += this.distances[i];
  }

  // Calculate fare based on distance and fare rate
  return Math.round(totalDistance * this.fareRate);
};

// Method to calculate journey time between two stops
RouteSchema.methods.calculateTime = function(fromStopIndex, toStopIndex) {
  if (fromStopIndex === toStopIndex) {
    return 0;
  }

  // Ensure the stop indices are in the correct order
  const startIndex = Math.min(fromStopIndex, toStopIndex);
  const endIndex = Math.max(fromStopIndex, toStopIndex);

  // Calculate the total time
  let totalTime = 0;
  for (let i = startIndex; i < endIndex; i++) {
    totalTime += this.times[i];
  }

  return totalTime;
};

module.exports = mongoose.model('Route', RouteSchema);