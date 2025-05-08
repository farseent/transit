//routeschema

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
    ref: 'Stop',
    required: true
  }],
  // Distance between stops in kilometers
  distances: [{ 
    type :Number,
    required: true 
  }],
  // Estimated time between stops in minutes
  times: [{ 
    type:Number,
    required:true 
  }],
  // Fare multiplier per kilometer
  fareRate: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to calculate fare between two stops
// RouteSchema.methods.calculateFare = function(fromStopIndex, toStopIndex) {
//   if (fromStopIndex === toStopIndex) {
//     return 0;
//   }

//   // Ensure the stop indices are in the correct order
//   const startIndex = Math.min(fromStopIndex, toStopIndex);
//   const endIndex = Math.max(fromStopIndex, toStopIndex);

//   // Calculate the total distance
//   let totalDistance = 0;
//   for (let i = startIndex; i < endIndex; i++) {
//     totalDistance += this.distances[i];
//   }

//   // Calculate fare based on distance and fare rate
//   return Math.round(totalDistance * this.fareRate);
// };

// RouteSchema.methods.calculateFare = function(fromStopIndex, toStopIndex) {
//   if (fromStopIndex === toStopIndex) {
//     return 0;
//   }

//   // Ensure the stop indices are in the correct order
//   const startIndex = Math.min(fromStopIndex, toStopIndex);
//   const endIndex = Math.max(fromStopIndex, toStopIndex);

//   // Calculate total distance between the stops
//   let totalDistance = 0;
//   for (let i = startIndex; i < endIndex; i++) {
//     totalDistance += this.distances[i];
//   }

//   // Apply fare logic
//   const baseFare = 10; // Minimum charge
//   const baseDistance = 2.5; // Covered under minimum charge

//   if (totalDistance <= baseDistance) {
//     return baseFare;
//   }

//   // Calculate extra fare for distance beyond baseDistance
//   const extraDistance = totalDistance - baseDistance;
//   const extraFare = extraDistance * this.fareRate;

//   return Math.round(baseFare + extraFare);
// };

RouteSchema.methods.calculateFare = function(fromStopIndex, toStopIndex) {
  if (fromStopIndex === toStopIndex) {
    return 0;
  }

  // Ensure stop indices are in correct order
  const startIndex = Math.min(fromStopIndex, toStopIndex);
  const endIndex = Math.max(fromStopIndex, toStopIndex);

  // Calculate total distance between stops
  let totalDistance = 0;
  for (let i = startIndex; i < endIndex; i++) {
    totalDistance += this.distances[i];
  }

  const baseFare = 10;
  const baseDistance = 2.5;

  if (totalDistance <= baseDistance) {
    return baseFare;
  }

  // New logic: ₹8 + totalDistance (rounded up)
  const fare = 8 + totalDistance;

  return Math.ceil(fare); // Round up to the nearest rupee
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