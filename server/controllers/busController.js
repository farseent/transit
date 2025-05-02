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
    const { routeId, fromStopId, toStopId, arrivalTime } = req.query;
    console.log('Request received in getBusById:', { 
      busId: req.params.id, 
      routeId, 
      fromStopId, 
      toStopId,
      arrivalTime 
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

      // Find the specific schedule that matches the arrivalTime
      let matchedSchedule = null;
      if (bus.schedules && bus.schedules.length > 0) {
        for (const schedule of bus.schedules) {
          const scheduleArrivalTime = await bus.calculateArrivalTime(fromStopIndex, schedule.departureTime);
          
          if (scheduleArrivalTime === arrivalTime) {
            matchedSchedule = schedule;
            break;
          }
        }
        
        // If specific arrival time not found, just use the first schedule
        if (!matchedSchedule && arrivalTime) {
          console.log('Warning: Could not find schedule with arrival time', arrivalTime);
        }
        
        // Use either the matched schedule or the first one
        const departureTime = matchedSchedule ? matchedSchedule.departureTime : bus.schedules[0].departureTime;
        const calculatedArrivalTime = await bus.calculateArrivalTime(fromStopIndex, departureTime);
        const destinationTime = await bus.calculateArrivalTime(toStopIndex, departureTime);
        
        journeyData = {
          arrivalTime: calculatedArrivalTime,
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


// Add this function to the existing controller
exports.getOwnerBusDetail = async (req, res) => {
  try {
    const { busId } = req.params;
    console.log(`[BUS CONTROLLER] Fetching bus details for busId: ${busId}, owner: ${req.user._id}`); // DeBuG

    // Verify that the bus belongs to the owner
    const bus = await Bus.findOne({ 
      _id: busId, 
      owner: req.user._id 
    }).populate('route');

    console.log(`[BUS CONTROLLER] Bus found:`, bus ? 'Yes' : 'No'); // DeBuG
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found or you do not have permission to view this bus' });
    }
    
    // Get all reviews for this bus
    const reviews = await Review.find({ bus: busId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Prepare rating categories based on actual schema
    const ratingCategories = ['cleanliness', 'punctuality', 'staffBehavior', 'comfort', 'overall'];
    const categoryRatings = {};
    
    // Use the pre-calculated ratings from the bus schema
    ratingCategories.forEach(category => {
      categoryRatings[category] = parseFloat(bus.ratings[category]);
    });
    
    // Get recent complaints
    // const complaints = await Complaint.find({ bus: busId })
    //   .populate('user', 'name')
    //   .sort({ createdAt: -1 })
    //   .limit(5);
    
    const responseData = {
      bus,
      reviews,
      categoryRatings,
      complaints,
      totalReviews: bus.ratingCounts?.overall || 0
    };
    
    console.log(`[BUS CONTROLLER] Sending response with data`); // DeBuG
    res.status(200).json(responseData);
  } catch (error) {
    console.error(`[BUS CONTROLLER] Error:`, error); // DeBuG
    res.status(500).json({ message: 'Error fetching bus details', error: error.message });
  }
};
