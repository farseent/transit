const Bus = require('../models/Bus');
const Review = require('../models/Review');

exports.toggleBusAvailability = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
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

exports.getMyBuses = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized as a bus owner' });
    }
    const buses = await Bus.find({ owner: req.user._id }).populate('route', 'name');
    res.status(200).json(buses); 
  } catch (error) {
    console.error('Error in getMyBuses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOwnerBusDetail = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId)
      .populate('route', 'name')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    if (bus.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this bus' });
    }

    return res.status(200).json({ success: true, data: bus });
  } catch (error) {
    console.error('Error fetching owner bus detail:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getBusReviewsForOwner = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    if (bus.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view reviews for this bus' });
    }

    const reviews = await Review.find({ bus: busId }).populate('user', 'name email');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
