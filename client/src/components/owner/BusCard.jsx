// components/owner/BusCard.jsx
const BusCard = ({ bus, onToggleAvailability, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{bus.name}</h3>
          <p className="text-sm text-gray-500">Registration: {bus.regNumber}</p>
        </div>
        
        {/* Overall Rating Badge */}
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium text-blue-700">{bus.ratings?.overall.toFixed(1) || '0.0'}</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <p className="font-medium text-gray-700">Route:</p>
            <span className="ml-2 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {bus.route?.name || 'N/A'}
            </span>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
            bus.isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {bus.isAvailable ? 'Available' : 'Unavailable'}
          </div>
        </div>
        
        {/* Ratings summary */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Ratings:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <span className="text-xs text-gray-500">Cleanliness:</span>
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">{bus.ratings?.cleanliness.toFixed(1) || '0.0'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">Punctuality:</span>
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">{bus.ratings?.punctuality.toFixed(1) || '0.0'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">Staff Behavior:</span>
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">{bus.ratings?.staffBehavior.toFixed(1) || '0.0'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">Comfort:</span>
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">{bus.ratings?.comfort.toFixed(1) || '0.0'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Schedule preview */}
        {bus.schedules && bus.schedules.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">Departures:</p>
            <div className="flex flex-wrap gap-2">
              {bus.schedules.slice(0, 3).map((schedule, index) => (
                <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                  {schedule.departureTime}
                </span>
              ))}
              {bus.schedules.length > 3 && (
                <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded">
                  +{bus.schedules.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={() => onToggleAvailability(bus._id)}
            className={`flex-1 py-2 rounded-md font-medium text-white transition duration-200 ${
              bus.isAvailable 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {bus.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          </button>
          
          <button
            onClick={() => onViewDetails(bus._id)}
            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 transition duration-200 rounded-md font-medium text-white"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;