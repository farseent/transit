import React, { useState } from 'react';
import Rating from '../common/Rating';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [ratings, setRatings] = useState({
    cleanlinessRating: 0,
    punctualityRating: 0,
    staffBehaviorRating: 0,
  });
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const overallRating = 
      (ratings.cleanlinessRating + 
       ratings.punctualityRating + 
       ratings.staffBehaviorRating) / 3;

    onSubmit({
      ...ratings,
      overallRating,
      comment,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-card rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cleanliness Rating
          </label>
          <Rating 
            value={ratings.cleanlinessRating} 
            onChange={(value) => setRatings(prev => ({ ...prev, cleanlinessRating: value }))} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Punctuality Rating
          </label>
          <Rating 
            value={ratings.punctualityRating} 
            onChange={(value) => setRatings(prev => ({ ...prev, punctualityRating: value }))} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff Behavior Rating
          </label>
          <Rating 
            value={ratings.staffBehaviorRating} 
            onChange={(value) => setRatings(prev => ({ ...prev, staffBehaviorRating: value }))} 
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

      <div className="flex justify-end space-x-2 mt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="btn btn-primary"
          disabled={!ratings.cleanlinessRating || !ratings.punctualityRating || !ratings.staffBehaviorRating}
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;