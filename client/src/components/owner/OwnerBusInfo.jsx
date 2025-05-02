// src/components/owner/OwnerBusInfo.jsx
import { useState } from 'react';

const OwnerBusInfo = ({ bus }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Function to render star ratings
  const renderStars = (rating, size = 'md') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`${starSize} ${i < Math.floor(rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Get average rating
  const getAverageRating = () => {
    if (!bus.ratings) return 0;
    const { cleanliness, punctuality, staffBehavior, comfort } = bus.ratings;
    const validRatings = [cleanliness, punctuality, staffBehavior, comfort].filter(r => r !== undefined);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
  };

  const averageRating = getAverageRating();

  return (
    <div className="space-y-8">
      {/* Overall Rating Card - Visible on all screen sizes */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">Overall Rating</h3>
            <p className="text-sm text-gray-500">Based on customer reviews</p>
          </div>
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xl font-bold text-blue-700">
              {bus.ratings?.overall?.toFixed(1) || averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Accordion for Basic Info */}
      <div className="md:hidden">
        <div className="rounded-lg shadow-md overflow-hidden border border-gray-200">
          <button 
            onClick={() => toggleSection('basic')} 
            className="w-full bg-white p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={expandedSection === 'basic'}
            aria-controls="basic-info-panel"
          >
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === 'basic' ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {expandedSection === 'basic' && (
            <div id="basic-info-panel" className="bg-white p-4 border-t border-gray-100">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Registration Number:</span>
                  <span className="font-medium">{bus.regNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{bus.route?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bus.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bus.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Added On:</span>
                  <span className="font-medium">
                    {new Date(bus.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Schedule */}
              {bus.schedules?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Schedule</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {bus.schedules.map((schedule, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="font-medium text-blue-700">{schedule.departureTime}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-lg shadow-md overflow-hidden border border-gray-200">
          <button 
            onClick={() => toggleSection('ratings')} 
            className="w-full bg-white p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={expandedSection === 'ratings'}
            aria-controls="ratings-panel"
          >
            <h3 className="text-lg font-semibold text-gray-800">Ratings Summary</h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === 'ratings' ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {expandedSection === 'ratings' && (
            <div id="ratings-panel" className="bg-white p-4 border-t border-gray-100">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Cleanliness</span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2">
                        {bus.ratings?.cleanliness?.toFixed(1) || '0.0'}
                      </span>
                      {renderStars(bus.ratings?.cleanliness || 0, 'sm')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on {bus.ratingCounts?.cleanliness || 0} reviews
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Punctuality</span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2">
                        {bus.ratings?.punctuality?.toFixed(1) || '0.0'}
                      </span>
                      {renderStars(bus.ratings?.punctuality || 0, 'sm')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on {bus.ratingCounts?.punctuality || 0} reviews
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Staff Behavior</span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2">
                        {bus.ratings?.staffBehavior?.toFixed(1) || '0.0'}
                      </span>
                      {renderStars(bus.ratings?.staffBehavior || 0, 'sm')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on {bus.ratingCounts?.staffBehavior || 0} reviews
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Comfort</span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2">
                        {bus.ratings?.comfort?.toFixed(1) || '0.0'}
                      </span>
                      {renderStars(bus.ratings?.comfort || 0, 'sm')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on {bus.ratingCounts?.comfort || 0} reviews
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Registration Number:</span>
                <span className="font-medium">{bus.regNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{bus.route?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bus.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bus.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Added On:</span>
                <span className="font-medium">
                  {new Date(bus.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Schedule */}
            {bus.schedules?.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Schedule</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bus.schedules.map((schedule, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="font-medium text-blue-700">{schedule.departureTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ratings Summary</h3>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Cleanliness</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">
                      {bus.ratings?.cleanliness?.toFixed(1) || '0.0'}
                    </span>
                    {renderStars(bus.ratings?.cleanliness || 0)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Based on {bus.ratingCounts?.cleanliness || 0} reviews
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Punctuality</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">
                      {bus.ratings?.punctuality?.toFixed(1) || '0.0'}
                    </span>
                    {renderStars(bus.ratings?.punctuality || 0)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Based on {bus.ratingCounts?.punctuality || 0} reviews
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Staff Behavior</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">
                      {bus.ratings?.staffBehavior?.toFixed(1) || '0.0'}
                    </span>
                    {renderStars(bus.ratings?.staffBehavior || 0)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Based on {bus.ratingCounts?.staffBehavior || 0} reviews
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Comfort</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">
                      {bus.ratings?.comfort?.toFixed(1) || '0.0'}
                    </span>
                    {renderStars(bus.ratings?.comfort || 0)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Based on {bus.ratingCounts?.comfort || 0} reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerBusInfo;