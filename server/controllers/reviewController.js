// reviewController.js
const Review = require('../models/Review');
const Bus = require('../models/Bus');

// Get all reviews for a bus
exports.getBusReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ bus: req.params.busId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
      res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message 
    });  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { 
      busId, 
      cleanliness, 
      punctuality, 
      staffBehavior, 
      comfort, 
      comment 
    } = req.body;
    
    // Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    // Check if user already reviewed this bus
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      bus: busId
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Bus already reviewed' });
    }
    
    // Calculate overall rating as average of category ratings
    const overallRating = (
      (cleanliness + punctuality + staffBehavior + comfort) / 4
    ).toFixed(1);
    
    // Create new review
    const review = await Review.create({
      user: req.user._id,
      bus: busId,
      cleanliness,
      punctuality,
      staffBehavior,
      comfort,
      overallRating: parseFloat(overallRating),
      comment
    });
    
    // Update bus average ratings
    await updateBusRatings(busId);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a review
// exports.updateReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);
    
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }
    
//     // Check if user is the owner of this review
//     if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to update this review' });
//     }
    
//     const { 
//       cleanliness, 
//       punctuality, 
//       staffBehavior, 
//       comfort, 
//       comment 
//     } = req.body;
    
//     // Calculate new overall rating
//     const overallRating = (
//       (cleanliness + punctuality + staffBehavior + comfort) / 4
//     ).toFixed(1);
    
//     review.cleanliness = cleanliness || review.cleanliness;
//     review.punctuality = punctuality || review.punctuality;
//     review.staffBehavior = staffBehavior || review.staffBehavior;
//     review.comfort = comfort || review.comfort;
//     review.overallRating = parseFloat(overallRating);
//     review.comment = comment || review.comment;
    
//     const updatedReview = await review.save();
    
//     // Update bus average ratings
//     await updateBusRatings(review.bus);
    
//     res.json(updatedReview);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Helper function to update bus ratings
// const updateBusRatings = async (busId) => {
//   const reviews = await Review.find({ bus: busId });
  
//   if (reviews.length === 0) return;
  
//   const avgCleanlinessRating = reviews.reduce((sum, review) => sum + review.cleanliness, 0) / reviews.length;
//   const avgPunctualityRating = reviews.reduce((sum, review) => sum + review.punctuality, 0) / reviews.length;
//   const avgStaffBehaviorRating = reviews.reduce((sum, review) => sum + review.staffBehavior, 0) / reviews.length;
//   const avgComfortRating = reviews.reduce((sum, review) => sum + review.comfort, 0) / reviews.length;
//   const avgOverallRating = reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length;
  
//   await Bus.findByIdAndUpdate(busId, {
//     ratings: {
//       cleanliness: avgCleanlinessRating.toFixed(1),
//       punctuality: avgPunctualityRating.toFixed(1),
//       staffBehavior: avgStaffBehaviorRating.toFixed(1),
//       comfort: avgComfortRating.toFixed(1),
//       overall: avgOverallRating.toFixed(1)
//     },
//     numReviews: reviews.length
//   });
// };