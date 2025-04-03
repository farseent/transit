import React from 'react';
import Rating from '../common/Rating';
import { User, Star } from 'lucide-react';

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <User className="text-primary-500 mr-2" />
            <span className="font-medium">{review.userName}</span>
            <span className="ml-auto flex items-center">
              <Star className="text-yellow-500 mr-1" />
              <span>{review.overallRating.toFixed(1)}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-sm text-gray-600">Cleanliness</p>
              <Rating value={review.cleanlinessRating} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Punctuality</p>
              <Rating value={review.punctualityRating} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Staff Behavior</p>
              <Rating value={review.staffBehaviorRating} />
            </div>
          </div>

          {review.comment && (
            <p className="text-gray-700 italic">"{review.comment}"</p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;