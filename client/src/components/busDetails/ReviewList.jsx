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
      {reviews.map((review) => {
        // Calculate overall rating as average of all ratings
        const overallRating = review.ratings ? 
          (review.ratings.cleanliness + 
           review.ratings.comfort + 
           review.ratings.punctuality + 
           review.ratings.staffBehavior) / 4 : 
          null;
        
        return (
          <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <User className="text-primary-500 mr-2" />
              <span className="font-medium">{review.user.name}</span>
              <span className="ml-auto flex items-center">
                <Star className="text-yellow-500 mr-1" />
                <span>{overallRating?.toFixed(1) ?? 'N/A'}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <p className="text-sm text-gray-600">Cleanliness</p>
                <Rating value={review.ratings?.cleanliness ?? 0} readOnly={true} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Comfort</p>
                <Rating value={review.ratings?.comfort ?? 0} readOnly={true} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Punctuality</p>
                <Rating value={review.ratings?.punctuality ?? 0} readOnly={true} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Staff Behavior</p>
                <Rating value={review.ratings?.staffBehavior ?? 0} readOnly={true} />
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-700 italic">"{review.comment}"</p>
            )}

            <p className="text-xs text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;