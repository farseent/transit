// src/components/owner/OwnerBusInfo.jsx
const OwnerBusInfo = ({ bus }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                {bus.schedules.map((schedule, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-700">{schedule.departureTime}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Ratings */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ratings Summary</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Cleanliness</span>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">
                    {bus.ratings?.cleanliness?.toFixed(1) || '0.0'}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < Math.floor(bus.ratings?.cleanliness || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Based on {bus.ratingCounts?.cleanliness || 0} reviews
              </div>
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Punctuality</span>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">
                    {bus.ratings?.punctuality?.toFixed(1) || '0.0'}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < Math.floor(bus.ratings?.punctuality || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Based on {bus.ratingCounts?.punctuality || 0} reviews
              </div>
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Staff Behavior</span>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">
                    {bus.ratings?.staffBehavior?.toFixed(1) || '0.0'}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < Math.floor(bus.ratings?.staffBehavior || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Based on {bus.ratingCounts?.staffBehavior || 0} reviews
              </div>
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Comfort</span>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">
                    {bus.ratings?.comfort?.toFixed(1) || '0.0'}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < Math.floor(bus.ratings?.comfort || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Based on {bus.ratingCounts?.comfort || 0} reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default OwnerBusInfo;