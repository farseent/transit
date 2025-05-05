// src/components/profile/EditReviewModal.jsx
import React, { useState, useEffect } from 'react';
import Rating from '../common/Rating';

const EditReviewModal = ({ review, onSubmit, onCancel, isOpen }) => {
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    punctuality: 0,
    staffBehavior: 0,
    comfort: 0,
  });
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Initialize form with existing review data when the modal opens
    if (review && isOpen) {
      setRatings(review.ratings);
      setComment(review.comment || '');
    }
  }, [review, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      ratings,
      comment,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Edit Your Review</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cleanliness
            </label>
            <Rating 
              value={ratings.cleanliness} 
              onChange={(value) => setRatings(prev => ({ ...prev, cleanliness: value }))} 
              size="md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Punctuality
            </label>
            <Rating 
              value={ratings.punctuality} 
              onChange={(value) => setRatings(prev => ({ ...prev, punctuality: value }))} 
              size="md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Behavior
            </label>
            <Rating 
              value={ratings.staffBehavior} 
              onChange={(value) => setRatings(prev => ({ ...prev, staffBehavior: value }))} 
              size="md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comfort
            </label>
            <Rating 
              value={ratings.comfort} 
              onChange={(value) => setRatings(prev => ({ ...prev, comfort: value }))} 
              size="md"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              id="comment"
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (optional)"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-secondary-500 text-white font-medium rounded-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!ratings.cleanliness || !ratings.punctuality || !ratings.staffBehavior || !ratings.comfort}
            >
              Update Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;