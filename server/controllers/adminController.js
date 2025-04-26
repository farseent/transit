const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Stop = require('../models/Stop');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');
const ActivityLog = require('../models/ActivityLog');

// ========== USER MANAGEMENT ==========
 exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const count = await User.countDocuments(query);

    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed user list',
      entityType: 'user'
    });

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: `Changed user role from ${oldRole} to ${role}`,
      entityType: 'user',
      entityId: userId,
      changes: { role: { from: oldRole, to: role } }
    });

    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: `Set user status to ${user.isActive ? 'active' : 'inactive'}`,
      entityType: 'user',
      entityId: userId,
      changes: { isActive: user.isActive }
    });

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed user details',
      entityType: 'user',
      entityId: user._id
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== BUS MANAGEMENT ==========
exports.getBuses = async (req, res) => {
  try {
    console.log('control reached admincontroller');
    
    const buses = await Bus.find().populate('owner', 'name');
    
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();

    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Created new bus',
      entityType: 'bus',
      entityId: bus._id,
      changes: req.body
    });

    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.assignBusToOwner = async (req, res) => {
  try {
    const { busId } = req.params;
    const { ownerId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== 'owner') {
      return res.status(400).json({ message: 'Invalid owner ID' });
    }

    const previousOwner = bus.owner;
    bus.owner = ownerId;
    await bus.save();

    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Assigned bus to owner',
      entityType: 'bus',
      entityId: bus._id,
      changes: { owner: { from: previousOwner, to: ownerId } }
    });

    res.json({ message: 'Bus assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBusesPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { licensePlate: { $regex: search, $options: 'i' } }
      ];
    }

    const buses = await Bus.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('owner', 'name');

    const count = await Bus.countDocuments(query);

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed paginated bus list',
      entityType: 'bus'
    });

    res.json({
      buses,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId).populate('owner', 'name email');
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed bus details',
      entityType: 'bus',
      entityId: bus._id
    });

    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.busId, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Updated bus details',
      entityType: 'bus',
      entityId: bus._id,
      changes: req.body
    });

    res.json(bus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Deleted bus',
      entityType: 'bus',
      entityId: bus._id
    });

    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== ROUTE MANAGEMENT ==========
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();

    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Created new route',
      entityType: 'route',
      entityId: route._id,
      changes: req.body
    });

    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getRoutesPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const routes = await Route.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('stops');

    const count = await Route.countDocuments(query);

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed paginated route list',
      entityType: 'route'
    });

    res.json({
      routes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.routeId).populate('stops');
    if (!route) return res.status(404).json({ message: 'Route not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed route details',
      entityType: 'route',
      entityId: route._id
    });

    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.routeId, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('stops');
    
    if (!route) return res.status(404).json({ message: 'Route not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Updated route',
      entityType: 'route',
      entityId: route._id,
      changes: req.body
    });

    res.json(route);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.routeId);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Deleted route',
      entityType: 'route',
      entityId: route._id
    });

    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== STOP MANAGEMENT ==========
exports.getStops = async (req, res) => {
  try {
    const stops = await Stop.find();
    
    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed all stops',
      entityType: 'stop'
    });

    res.json(stops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStop = async (req, res) => {
  try {
    const stop = new Stop(req.body);
    await stop.save();

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Created new stop',
      entityType: 'stop',
      entityId: stop._id,
      changes: req.body
    });

    res.status(201).json(stop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findByIdAndDelete(req.params.stopId);
    if (!stop) return res.status(404).json({ message: 'Stop not found' });

    // Remove stop from any routes
    await Route.updateMany(
      { stops: stop._id },
      { $pull: { stops: stop._id } }
    );

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Deleted stop',
      entityType: 'stop',
      entityId: stop._id
    });

    res.json({ message: 'Stop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== COMPLAINT MANAGEMENT ==========
exports.getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate('bus', 'name licensePlate')
      .populate('user', 'name email');

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed all complaints',
      entityType: 'complaint'
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId)
      .populate('bus', 'name licensePlate')
      .populate('user', 'name email');
    
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Viewed complaint details',
      entityType: 'complaint',
      entityId: complaint._id
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.complaintId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await ActivityLog.create({
      adminId: req.user.id,
      action: `Updated complaint status to ${status}`,
      entityType: 'complaint',
      entityId: complaint._id,
      changes: { status }
    });

    res.json(complaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getRecentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('bus', 'name')
      .populate('user', 'name');
    console.log('recent complaints in admin controller:',complaints);
      
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== ACTIVITY LOGS ==========
exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, entityType } = req.query;
    const query = {};
    
    if (entityType) query.entityType = entityType;

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('adminId', 'name email');

    const count = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// System Statistics & System Settings
exports.getSystemStats = async (req, res) => {
  try {  
    const [users, buses, routes, reviews] = await Promise.all([
      User.countDocuments(),
      Bus.countDocuments(),
      Route.countDocuments(),
      Review.countDocuments()
    ]);
    const recentActivity = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('adminId', 'name email');
    res.json({
      stats: {
        users,
        owners: await User.countDocuments({ role: 'owner' }),
        admins: await User.countDocuments({ role: 'admin' }),
        buses,
        routes,
        reviews,
        activeBuses: await Bus.countDocuments({ isAvailable: 'true' })
      },
      recentActivity
    });
  } catch (err) {
    console.error('Error in getSystemStats:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getSystemSettings = async (req, res) => {
  try {
    // In a real app, you'd get these from a database
    const settings = {
      maintenanceMode: false,
      newUserSignups: true,
      maxBusesPerOwner: 5
    };
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    // In a real app, you'd save these to a database
    const settings = req.body;
    
    // Log activity
    await ActivityLog.create({
      adminId: req.user.id,
      action: 'Updated system settings',
      entityType: 'system',
      changes: settings
    });

    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== OWNER MANAGEMENT ==========
exports.getOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('name email');
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};