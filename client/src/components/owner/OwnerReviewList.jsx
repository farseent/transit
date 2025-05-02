// src/components/owner/OwnerReviewList.jsx
import { format } from 'date-fns';
import { useState } from 'react';

const OwnerReviewList = ({ reviews }) => {
  const [expandedReviews, setExpandedReviews] = useState({});

  // Function to toggle comment visibility for long comments
  const toggleExpand = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Function to check if comment needs to be truncated
  const isLongComment = (comment) => {
    return comment && comment.length > 150;
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Calculate average rating
  const calculateAverage = (ratings) => {
    return ((
      ratings.cleanliness + 
      ratings.punctuality + 
      ratings.staffBehavior + 
      ratings.comfort
    ) / 4).toFixed(1);
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-gray-600 font-medium mb-1">No reviews yet</p>
        <p className="text-gray-500 text-sm">This bus hasn't received any customer reviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6" role="list" aria-label="Customer reviews">
      {reviews.map((review) => (
        <div 
          key={review._id} 
          className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200" 
          role="listitem"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <div className="mb-3 sm:mb-0">
              <h4 className="font-medium text-gray-800">{review.user?.name || 'Anonymous'}</h4>
              <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full self-start">
              <span className="text-lg font-bold mr-2 text-yellow-600">
                {calculateAverage(review.ratings)}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          {review.comment && (
            <div className="mb-4">
              <p className="text-gray-700">
                {isLongComment(review.comment) && !expandedReviews[review._id] 
                  ? truncateText(review.comment, 150)
                  : review.comment
                }
              </p>
              {isLongComment(review.comment) && (
                <button 
                  onClick={() => toggleExpand(review._id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 focus:outline-none focus:underline"
                  aria-expanded={expandedReviews[review._id]}
                >
                  {expandedReviews[review._id] ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {/* Rating categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cleanliness:</span>
              <div className="flex items-center">
                <span className="font-medium mr-1">{review.ratings.cleanliness}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Punctuality:</span>
              <div className="flex items-center">
                <span className="font-medium mr-1">{review.ratings.punctuality}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Staff Behavior:</span>
              <div className="flex items-center">
                <span className="font-medium mr-1">{review.ratings.staffBehavior}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Comfort:</span>
              <div className="flex items-center">
                <span className="font-medium mr-1">{review.ratings.comfort}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnerReviewList;