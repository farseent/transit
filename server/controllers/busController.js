// busController.js
const Bus = require('../models/Bus');
const Review = require('../models/Review');
const Route = require('../models/Route');
const Stop = require('../models/Stop');

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
    // Extract query parameters
    const { routeId, fromStopId, toStopId } = req.query;
    console.log('Request received in getBusById:', { 
      busId: req.params.id, 
      routeId, 
      fromStopId, 
      toStopId 
    });

    // Find the bus by ID
    const bus = await Bus.findById(req.params.id).populate('owner', 'name email');
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Get the reviews for the bus
    const reviews = await Review.find({ bus: bus._id }).populate('user', 'name');
    
    // Initialize journey-specific data
    let fromStop = null;
    let toStop = null;
    let journeyData = {};
    
    // If we have route and stop IDs, fetch the journey-specific information
    if (routeId && fromStopId && toStopId) {
      // Find the route and populate stops
      const route = await Route.findById(routeId).populate('stops');
      if (!route) {
        return res.status(404).json({
          success: false,
          message: 'Route not found',
        });
      }

      // Find the stops to get their names
      fromStop = await Stop.findById(fromStopId);
      toStop = await Stop.findById(toStopId);
      
      if (!fromStop || !toStop) {
        return res.status(404).json({
          success: false, 
          message: 'One or both stops not found'
        });
      }

      // Find the indices of the from-stop and to-stop in the route
      const fromStopIndex = route.stops.findIndex(stop => 
        stop._id.toString() === fromStopId
      );
      const toStopIndex = route.stops.findIndex(stop => 
        stop._id.toString() === toStopId
      );

      if (fromStopIndex === -1 || toStopIndex === -1) {
        return res.status(400).json({
          success: false,
          message: 'One or both stops are not on this route',
        });
      }

      // Calculate fare for this journey segment
      const fare = route.calculateFare(fromStopIndex, toStopIndex);
      
      // Calculate journey duration
      const journeyDuration = route.calculateTime(fromStopIndex, toStopIndex);

      // Calculate arrival times at both stops
      // Use the first schedule (you might want to be more specific)
      if (bus.schedules && bus.schedules.length > 0) {
        const departureTime = bus.schedules[0].departureTime;
        const arrivalTime = await bus.calculateArrivalTime(fromStopIndex, departureTime);
        const destinationTime = await bus.calculateArrivalTime(toStopIndex, departureTime);
        
        journeyData = {
          arrivalTime,
          destinationTime,
          duration: journeyDuration,
          fare
        };
      }
    }

    // Combine the bus data with journey-specific data
    const busWithJourneyData = {
      ...bus.toObject(),
      ...journeyData
    };
    
    res.json({ 
      bus: busWithJourneyData, 
      reviews,
      fromStop,
      toStop 
    });
    
  } catch (error) {
    console.error('Error in getBusById:', error);
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