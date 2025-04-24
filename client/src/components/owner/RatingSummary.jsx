// src/components/owner/RatingSummary.jsx
import React from 'react';
import { StarIcon } from '@heroicons/react/solid';

const RatingSummary = ({ categoryRatings, totalReviews }) => {
  const categories = [
    { id: 'cleanliness', label: 'Cleanliness' },
    { id: 'punctuality', label: 'Punctuality' },
    { id: 'staffBehavior', label: 'Staff Behavior' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'overall', label: 'Overall' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-card p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Rating Summary</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <span className="w-32 text-gray-600">{category.label}</span>
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(categoryRatings[category.id])
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700">
                {categoryRatings[category.id]}
              </span>
            </div>
          </div>
        ))}
        <div className="text-gray-600 text-sm pt-2 mt-4 border-t">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;