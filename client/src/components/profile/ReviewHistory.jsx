// src/components/profile/ReviewHistory.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ReviewHistory = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <p className="text-gray-500">You haven't submitted any reviews yet.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-card p-6 mb-6">
      {/* <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2> */}
      
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <Link 
                  to={`/bus/${review.busId}`} 
                  className="text-lg font-medium text-primary-500 hover:underline"
                >
                  {review.busName}
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                {review.ratings && Object.entries(review.ratings).map(([category, rating]) => (
                  <div key={category} className="flex items-center">
                    <span className="text-sm text-gray-600 capitalize mr-2">{category}:</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <svg 
                          key={index}
                          className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">You haven't submitted any reviews yet.</p>
          <Link to="/" className="text-primary-500 font-medium mt-2 inline-block hover:underline">
            Find a bus to review
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;