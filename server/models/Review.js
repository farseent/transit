const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
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
  ratings: {
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    staffBehavior: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comfort: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per bus per journey date
ReviewSchema.index(
  { user: 1, bus: 1, 'journey.date': 1 },
  { unique: true }
);

// Static method to get average rating and count for a bus
ReviewSchema.statics.getAverageRatings = async function(busId) {
  const obj = await this.aggregate([
    {
      $match: { bus: busId }
    },
    {
      $group: {
        _id: '$bus',
        cleanlinessAvg: { $avg: '$ratings.cleanliness' },
        punctualityAvg: { $avg: '$ratings.punctuality' },
        staffBehaviorAvg: { $avg: '$ratings.staffBehavior' },
        comfortAvg: { $avg: '$ratings.comfort' },
        cleanlinessCount: { $sum: 1 },
        punctualityCount: { $sum: 1 },
        staffBehaviorCount: { $sum: 1 },
        comfortCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await this.model('Bus').findByIdAndUpdate(busId, {
        'ratings.cleanliness': obj[0].cleanlinessAvg.toFixed(1),
        'ratings.punctuality': obj[0].punctualityAvg.toFixed(1),
        'ratings.staffBehavior': obj[0].staffBehaviorAvg.toFixed(1),
        'ratings.comfort': obj[0].comfortAvg.toFixed(1),
        'ratingCounts.cleanliness': obj[0].cleanlinessCount,
        'ratingCounts.punctuality': obj[0].punctualityCount,
        'ratingCounts.staffBehavior': obj[0].staffBehaviorCount,
        'ratingCounts.comfort': obj[0].comfortCount
      });

      // Update the overall rating
      const bus = await this.model('Bus').findById(busId);
      bus.updateOverallRating();
      await bus.save();
    } else {
      // If no reviews, reset all ratings to zero
      await this.model('Bus').findByIdAndUpdate(busId, {
        'ratings.cleanliness': 0,
        'ratings.punctuality': 0,
        'ratings.staffBehavior': 0,
        'ratings.comfort': 0,
        'ratings.overall': 0,
        'ratingCounts.cleanliness': 0,
        'ratingCounts.punctuality': 0,
        'ratingCounts.staffBehavior': 0,
        'ratingCounts.comfort': 0,
        'ratingCounts.overall': 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRatings after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRatings(this.bus);
});

// Call getAverageRatings after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRatings(this.bus);
});

module.exports = mongoose.model('Review', ReviewSchema);