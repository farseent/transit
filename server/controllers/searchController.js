const Bus = require('../models/Bus');
const Route = require('../models/Route');

exports.searchBuses = async (req, res) => {

  try {
    const { routeId, fromStopId, toStopId } = req.body;

    // Get route with populated stops and their names
    const route = await Route.findById(routeId).populate({
      path: 'stops',
      select: 'name'
    });
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    // Find the stop objects
    const fromStop = route.stops.find(stop => stop._id.toString() === fromStopId);
    const toStop = route.stops.find(stop => stop._id.toString() === toStopId);
    
    if (!fromStop || !toStop) {
      return res.status(400).json({ message: 'One or both stops are not on this route' });
    }
    
    const fromStopIndex = route.stops.findIndex(stop => stop._id.toString() === fromStopId);
    const toStopIndex = route.stops.findIndex(stop => stop._id.toString() === toStopId);
    
    if (fromStopIndex >= toStopIndex) {
      return res.status(400).json({ message: 'From-stop must come before to-stop on the route' });
    }
    
    // Find  buses for this route
    const buses = await Bus.find({ route: routeId }).populate('owner', 'name');
    
    // Prepare results with names included
    const busResults = buses.map(bus => {
      const stopsBetween = toStopIndex - fromStopIndex;
      const journeyDurationMinutes = stopsBetween * 10;
      const currentTime = new Date();
      const arrivalTime = new Date(currentTime.getTime() + (Math.random() * 60 * 60 * 1000));
      const destinationTime = new Date(arrivalTime.getTime() + (journeyDurationMinutes * 60 * 1000));
      const fare = 2 + stopsBetween * 1;
      
      return {
        _id: bus._id,
        busNumber: bus.regNumber,
        busName: bus.name,
        owner: bus.owner,
        ratings: bus.ratings,
        numReviews: bus.ratingCounts?.overall || 0,
        isAvailable: bus.isAvailable,
        arrivalTime: arrivalTime.toISOString(),
        journeyDuration: journeyDurationMinutes,
        destinationTime: destinationTime.toISOString(),
        fare: fare,
        // Include names in the response
        routeName: route.name,
        fromStopName: fromStop.name,
        toStopName: toStop.name
      };
    });
    
    res.json({
      buses: busResults,
      routeName: route.name,
      fromStopName: fromStop.name,
      toStopName: toStop.name
    });
  } catch (error) {
    console.error('Error in searchBuses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};