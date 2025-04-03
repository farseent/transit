// searchController.js
const Bus = require('../models/Bus');
const Route = require('../models/Route');
// const Stop = require('../models/Stop');

// Search for buses based on route and stops
exports.searchBuses = async (req, res) => {

  console.log('searchBuses controller was called');
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);

  try {
    
    const { routeId, fromStopId, toStopId } = req.body;
    // Check if route exists
    const route = await Route.findById(routeId).populate('stops');
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    // Check if fromStop and toStop exist on this route
    const fromStopIndex = route.stops.findIndex(stop => stop._id.toString() === fromStopId);
    const toStopIndex = route.stops.findIndex(stop => stop._id.toString() === toStopId);
    
    if (fromStopIndex === -1 || toStopIndex === -1) {
      return res.status(400).json({ message: 'One or both stops are not on this route' });
    }
    
    if (fromStopIndex >= toStopIndex) {
      return res.status(400).json({ message: 'From-stop must come before to-stop on the route' });
    }
    
    // Find buses that service this route and are available
    const buses = await Bus.find({
      routes: routeId,
      isAvailable: true
    }).populate('owner', 'name');
    
    // Calculate journey details for each bus
    const busResults = buses.map(bus => {
      // In a real application, these would be calculated based on actual bus schedules
      // For this example, we're using placeholder calculations
      
      // Calculate arrival time at fromStop (for demo, using current time + random offset)
      const currentTime = new Date();
      const arrivalTime = new Date(currentTime.getTime() + (Math.random() * 60 * 60 * 1000)); // Random time within the next hour
      
      // Calculate journey duration based on stop distance (for demo, using 10min per stop)
      const stopsBetween = toStopIndex - fromStopIndex;
      const journeyDurationMinutes = stopsBetween * 10;
      
      // Calculate destination time based on arrival + duration
      const destinationTime = new Date(arrivalTime.getTime() + (journeyDurationMinutes * 60 * 1000));
      
      // Calculate fare based on distance (for demo, $2 base + $1 per stop)
      const fare = 2 + stopsBetween * 1;
      
      return {
        _id: bus._id,
        busNumber: bus.busNumber,
        owner: bus.owner,
        ratings: bus.ratings,
        numReviews: bus.numReviews,
        isAvailable: bus.isAvailable,
        arrivalTime: arrivalTime.toISOString(),
        journeyDuration: journeyDurationMinutes,
        destinationTime: destinationTime.toISOString(),
        fare: fare
      };
    });
    
    res.json(busResults);
  } catch (error) {
    console.error('Error in searchBuses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};