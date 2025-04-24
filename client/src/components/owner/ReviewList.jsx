// src/components/owner/ReviewList.jsx
import React from 'react';
import ReviewItem from './ReviewItem';

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        <p className="text-gray-500">No reviews yet for this bus.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;