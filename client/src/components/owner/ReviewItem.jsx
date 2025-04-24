// src/components/owner/ReviewItem.jsx
import React from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { formatDate } from '../../utils/formatters';

const ReviewItem = ({ review }) => {
  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="font-medium text-gray-800">{review.user.name}</div>
          <div className="ml-4 text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mt-2">{review.comment}</p>
      
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Cleanliness:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= review.ratings.cleanliness ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Punctuality:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= review.ratings.punctuality ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Staff:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= review.ratings.staffBehavior ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Comfort:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= review.ratings.comfort ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;