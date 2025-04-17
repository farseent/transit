// src/components/profile/ReviewHistory.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReviewHistory = ({ reviews }) => {  
  const [sortOption, setSortOption] = useState('newest');
  const [filterOption, setFilterOption] = useState('all');
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p className="text-gray-500 mb-4">You haven't submitted any reviews yet.</p>
        <Link to="/" className="inline-block bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
          Find a bus to review
        </Link>
      </div>
    );
  }
  
  // Sort and filter reviews
  let filteredReviews = [...reviews];
  
  // Apply filtering
  if (filterOption !== 'all') {
    // Filter by rating category (e.g., 5-star reviews, etc.)
    const ratingValue = parseInt(filterOption);
    filteredReviews = filteredReviews.filter(review => {
      // Calculate average rating
      const ratingsValues = Object.values(review.ratings);
      const avgRating = ratingsValues.reduce((sum, val) => sum + val, 0) / ratingsValues.length;
      return Math.round(avgRating) === ratingValue;
    });
  }
  
  // Apply sorting
  filteredReviews.sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'highest') {
      const aAvg = Object.values(a.ratings).reduce((sum, val) => sum + val, 0) / Object.values(a.ratings).length;
      const bAvg = Object.values(b.ratings).reduce((sum, val) => sum + val, 0) / Object.values(b.ratings).length;
      return bAvg - aAvg;
    } else if (sortOption === 'lowest') {
      const aAvg = Object.values(a.ratings).reduce((sum, val) => sum + val, 0) / Object.values(a.ratings).length;
      const bAvg = Object.values(b.ratings).reduce((sum, val) => sum + val, 0) / Object.values(b.ratings).length;
      return aAvg - bAvg;
    }
    return 0;
  });
  
  // Calculate average rating for each review
  const getAverageRating = (ratings) => {
    const values = Object.values(ratings);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };
  
  return (
    <div>
      {/* Filter and sort controls */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">Filter:</label>
          <select 
            id="filter"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
      
      {/* Review list */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-6">
          {filteredReviews.map((review) => {
            const avgRating = getAverageRating(review.ratings);
            
            return (
              <div key={review._id} className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Link 
                      to={`/bus/${review.bus?._id}`} 
                      className="text-lg font-medium text-primary-600 hover:underline"
                    >
                      {review.bus?.name || 'Unknown Bus'}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center bg-primary-50 px-3 py-1 rounded-full">
                    <span className="font-medium text-primary-700 mr-1">{avgRating.toFixed(1)}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                
                {/* Rating categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {review.ratings && Object.entries(review.ratings).map(([category, rating]) => (
                    <div key={category} className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500 capitalize mb-1">{category}</p>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">{rating}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <svg 
                              key={index}
                              className={`w-3 h-3 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Review comment */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                
                {/* Action buttons */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="text-gray-600 text-sm hover:text-primary-500 transition-colors">
                    Edit Review
                  </button>
                  <button className="text-red-500 text-sm hover:text-red-600 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reviews match your filter criteria.</p>
          <button 
            onClick={() => setFilterOption('all')} 
            className="mt-2 text-primary-500 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;