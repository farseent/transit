const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const ActivityLog = require('../models/ActivityLog');

// User Management
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

// Bus Management
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

// Route Management
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

// System Statistics
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
        activeBuses: await Bus.countDocuments({ status: 'active' })
      },
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add these to the existing adminController

// System Settings
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

// Get all bus owners
exports.getOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('name email');
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('owner', 'name');
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recent complaints
exports.getRecentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('bus', 'name')
      .populate('user', 'name');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};