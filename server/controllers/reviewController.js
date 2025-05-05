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
    const busId = req.params.busId;
    const { ratings, comment } = req.body;   
    
    // Validate that all required ratings are present
    if (!ratings || !ratings.cleanliness || !ratings.punctuality || 
      !ratings.staffBehavior || !ratings.comfort) {
    return res.status(400).json({ 
      message: 'All ratings (cleanliness, punctuality, staffBehavior, comfort) are required' 
    });
  }
    
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
    
    // Create new review with proper structure matching the schema
     // Create new review
     const review = await Review.create({
      user: req.user._id,
      bus: busId,
      ratings: {
        cleanliness: ratings.cleanliness,
        punctuality: ratings.punctuality,
        staffBehavior: ratings.staffBehavior,
        comfort: ratings.comfort
      },
      comment
    });
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratings, comment } = req.body;
    
    // Validate ratings
    if (!ratings || !ratings.cleanliness || !ratings.punctuality || 
        !ratings.staffBehavior || !ratings.comfort) {
      return res.status(400).json({ 
        message: 'All ratings (cleanliness, punctuality, staffBehavior, comfort) are required' 
      });
    }
    
    // Find the review
    const review = await Review.findById(id);
    
    // Check if review exists
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Verify ownership (only allow users to edit their own reviews)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    // Update review fields
    review.ratings.cleanliness = ratings.cleanliness;
    review.ratings.punctuality = ratings.punctuality;
    review.ratings.staffBehavior = ratings.staffBehavior;
    review.ratings.comfort = ratings.comfort;
    review.comment = comment || review.comment;
    
    // Save updated review
    const updatedReview = await review.save();
    
    // getAverageRatings will be called automatically via the post-save hook in the Review model
    
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the review
    const review = await Review.findById(id);
    
    // Check if review exists
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Verify ownership (only allow users to delete their own reviews)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    // Store bus ID before removal for recalculating ratings
    const busId = review.bus;
    
    // Delete the review
    await Review.deleteOne({ _id: id });
    
    // Recalculate bus average ratings
    await Review.getAverageRatings(busId);
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};