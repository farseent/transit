// busController.js
const Bus = require('../models/Bus');
const Review = require('../models/Review');

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({}).populate('owner', 'name email');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('owner', 'name email');
    
    if (bus) {
      const reviews = await Review.find({ bus: bus._id }).populate('user', 'name');
      res.json({ bus, reviews });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new bus (for bus owners)
// exports.createBus = async (req, res) => {
//   try {
//     // Check if user is a bus owner
//     if (req.user.role !== 'owner') {
//       return res.status(403).json({ message: 'Not authorized as a bus owner' });
//     }
    
//     const { 
//       busNumber, 
//       capacity, 
//       features, 
//       routes 
//     } = req.body;
    
//     const bus = await Bus.create({
//       busNumber,
//       capacity,
//       features,
//       routes,
//       owner: req.user._id,
//       isAvailable: true // Default to available
//     });
    
//     res.status(201).json(bus);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Update bus details (for bus owners)
// exports.updateBus = async (req, res) => {
//   try {
//     const bus = await Bus.findById(req.params.id);
    
//     if (!bus) {
//       return res.status(404).json({ message: 'Bus not found' });
//     }
    
//     // Check if user is the owner of this bus
//     if (bus.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to update this bus' });
//     }
    
//     const updatedBus = await Bus.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
    
//     res.json(updatedBus);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Toggle bus availability (for bus owners)
exports.toggleBusAvailability = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    // Check if user is the owner of this bus
    if (bus.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this bus' });
    }
    
    bus.isAvailable = !bus.isAvailable;
    const updatedBus = await bus.save();
    
    res.json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get buses owned by current user (for bus owners)
exports.getMyBuses = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized as a bus owner' });
    }
    
    const buses = await Bus.find({ owner: req.user._id });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};