// In your Stop model (models/Stop.js)
const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A stop must have a name'],
    trim: true,
    maxlength: [100, 'A stop name must have less or equal than 100 characters'],
    minlength: [3, 'A stop name must have more or equal than 3 characters']
  },
  code: {
    type: String,
    required: [true, 'A stop must have a code'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [10, 'A stop code must have less or equal than 10 characters'],
    minlength: [2, 'A stop code must have more or equal than 2 characters']
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: [true, 'A stop must have coordinates'],
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Coordinates must be valid [longitude, latitude] values'
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Create geospatial index for location
stopSchema.index({ location: '2dsphere' });

const Stop = mongoose.model('Stop', stopSchema);

module.exports = Stop;