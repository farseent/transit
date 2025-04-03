const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  regNumber: {
    type: String,
    required: [true, 'Please add a registration number'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please add a bus name'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  // We'll store the schedule as departure times from the first stop
  // schedules: [{
  //   departureTime: {
  //     type: String, // Format: "HH:MM" in 24-hour format
  //     required: true
  //   },
  //   days: {
  //     type: [String],
  //     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  //     required: true
  //   }
  // }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  ratings: {
    cleanliness: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    punctuality: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    staffBehavior: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    comfort: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    overall: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  // Keep track of number of ratings for calculating averages
  ratingCounts: {
    cleanliness: {
      type: Number,
      default: 0
    },
    punctuality: {
      type: Number,
      default: 0
    },
    staffBehavior: {
      type: Number,
      default: 0
    },
    comfort: {
      type: Number,
      default: 0
    },
    overall: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
BusSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bus',
  justOne: false
});

// Method to calculate arrival time at a specific stop
BusSchema.methods.calculateArrivalTime = async function(stopIndex, departureTime) {
  // Populate the route if not already populated
  if (!this.route.calculateTime) {
    await this.populate('route');
  }
  
  // Get total travel time from first stop to specified stop
  const travelTime = this.route.calculateTime(0, stopIndex);
  
  // Parse the departure time
  const [hours, minutes] = departureTime.split(':').map(Number);
  
  // Create a Date object for calculations (using current date, only time matters)
  const arrivalDate = new Date();
  arrivalDate.setHours(hours, minutes, 0, 0);
  
  // Add travel time in minutes
  arrivalDate.setMinutes(arrivalDate.getMinutes() + travelTime);
  
  // Format and return the arrival time
  return `${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')}`;
};

// Update overall rating when individual ratings change
BusSchema.methods.updateOverallRating = function() {
  const categories = ['cleanliness', 'punctuality', 'staffBehavior', 'comfort'];
  const totalRatings = categories.reduce((sum, category) => sum + this.ratings[category] * this.ratingCounts[category], 0);
  const totalCounts = categories.reduce((sum, category) => sum + this.ratingCounts[category], 0);
  
  this.ratings.overall = totalCounts > 0 ? (totalRatings / totalCounts).toFixed(1) : 0;
  this.ratingCounts.overall = Math.max(...categories.map(category => this.ratingCounts[category]));
  
  return this.ratings.overall;
};

module.exports = mongoose.model('Bus', BusSchema);