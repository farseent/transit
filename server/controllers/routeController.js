
// routeController.js
const Route = require('../models/Route');
const Stop = require('../models/Stop');

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({}).populate('stops');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('stops');
    
    if (route) {
      res.json(route);
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all stops for a route
exports.getRouteStops = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('stops');
    
    if (route) {
      res.json(route.stops);
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all stops
exports.getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find({});
    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};