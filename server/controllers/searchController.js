// searchController.js
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Stop = require('../models/Stop');
const { compareTimeStrings } = require('../utils/timeUtils');


exports.searchBuses = async (req, res) => {
  try {
    // Check if we're getting data from query params (GET) or body (POST)
    const { routeId, fromStopId, toStopId } = req.method === 'GET' ? req.query : req.body;
    // console.log('request body =', req.body);
    
    if (!routeId || !fromStopId || !toStopId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide routeId, fromStopId, and toStopId',
      });
    }

    // Find the route and populate stops
    const route = await Route.findById(routeId).populate('stops');
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    // Find the stops to get their names
    const fromStop = await Stop.findById(fromStopId);
    const toStop = await Stop.findById(toStopId);
    
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

    // Check if the route direction is valid (from should come before to)
    if (fromStopIndex >= toStopIndex) {
      return res.status(400).json({
        success: false,
        message: 'From-stop must come before to-stop in the route',
      });
    }

    // Find all buses servicing this route
    const buses = await Bus.find({ route: routeId }).populate('owner', 'name');

    // Calculate fare for this journey segment
    const fare = route.calculateFare(fromStopIndex, toStopIndex);
    
    // Calculate journey duration
    const journeyDuration = route.calculateTime(fromStopIndex, toStopIndex);

    // Get current time for filtering available buses
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Process each bus to calculate arrival times at both stops
    const busList = [];
    
    for (const bus of buses) {
      for (const schedule of bus.schedules) {
        const departureTime = schedule.departureTime;
    
        const arrivalTime = await bus.calculateArrivalTime(fromStopIndex, departureTime);
        const destinationTime = await bus.calculateArrivalTime(toStopIndex, departureTime);
    
        // console.log('---');
        // console.log('Bus:', bus.name);
        // console.log('Departure Time:', departureTime);
        // console.log('From Index:', fromStopIndex, 'To Index:', toStopIndex);
        // console.log('Arrival Time:', arrivalTime);
        // console.log('Current Time:', currentTimeString);
        // console.log('Compare Result:', compareTimeStrings(arrivalTime, currentTimeString));
        // console.log('---');


        // if (compareTimeStrings(arrivalTime, currentTimeString) > 0) {
          busList.push({
            _id: bus._id,
            busNumber: bus.regNumber,
            busName: bus.name,
            arrivalTime,
            destinationTime,
            journeyDuration,
            fare,
            ratings: bus.ratings,
            numReviews: bus.ratingCounts.overall,
            isAvailable: bus.isAvailable
          });
        // }
      }
    }
    
    // console.log('bus data in search controller = ',busList);

    // Sort by arrival time at fromStop
    busList.sort((a, b) => 
      compareTimeStrings(a.arrivalTime, b.arrivalTime)
    );

    

    return res.status(200).json({
      success: true,
      buses: busList,
      routeName: route.name,
      fromStopName: fromStop.name,
      toStopName: toStop.name
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};