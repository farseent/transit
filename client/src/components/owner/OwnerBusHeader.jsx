// src/components/owner/OwnerBusHeader.jsx
import { useState } from 'react';

const OwnerBusHeader = ({ bus, onBack, onToggleAvailability }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleAvailability = async () => {
    setIsLoading(true);
    try {
      await onToggleAvailability();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-6 px-4 sm:px-6 shadow-md">
      <div className="container mx-auto">
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back</span>
            </button>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${bus.isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium">{bus.isAvailable ? 'Available' : 'Unavailable'}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1 truncate">{bus.name || 'Bus Details'}</h1>
          <p className="opacity-90 text-sm">{bus.regNumber}</p>
          <button
            onClick={handleToggleAvailability}
            disabled={isLoading}
            className={`mt-4 w-full py-2 rounded-md font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 
              bus.isAvailable 
                ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400' 
                : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>{bus.isAvailable ? 'Mark Unavailable' : 'Mark Available'}</span>
            )}
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 px-4 py-2 mr-6 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold">{bus.name || 'Bus Details'}</h1>
              <div className="flex items-center mt-2">
                <span className="opacity-90 mr-4">{bus.regNumber}</span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${bus.isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm font-medium">{bus.isAvailable ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={isLoading}
            className={`px-6 py-2 rounded-md font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 
              bus.isAvailable 
                ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400' 
                : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>{bus.isAvailable ? 'Mark Unavailable' : 'Mark Available'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerBusHeader;