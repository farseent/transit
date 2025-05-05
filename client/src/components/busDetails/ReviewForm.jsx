import React, { useState, useEffect } from 'react';
import Rating from '../common/Rating';

const ReviewForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    punctuality: 0,
    staffBehavior: 0,
    comfort: 0,
  });
  const [comment, setComment] = useState('');
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setRatings({
        cleanliness: initialData.ratings.cleanliness || 0,
        punctuality: initialData.ratings.punctuality || 0,
        staffBehavior: initialData.ratings.staffBehavior || 0,
        comfort: initialData.ratings.comfort || 0,
      });
      setComment(initialData.comment || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Submit with the structure expected by your schema
    onSubmit({
      ratings,
      comment,
      _id: initialData?._id,  // Include review ID if editing
    });
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-card rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Your Review' : 'Add Your Review'}
      </h3>

      <div className="space-y-4">
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
          {isEditing ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;