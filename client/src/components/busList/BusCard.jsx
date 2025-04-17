//BusCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '../common/Rating';
import { formatTime, formatDuration, formatCurrency } from '../../utils/formatters';

const BusCard = ({ bus, routeId, fromStopId, toStopId }) => {
  const navigate = useNavigate();
  
  const {
    _id,
    busNumber,
    busName,
    arrivalTime,
    destinationTime,
    duration,
    fare,
    averageRating,
    reviewCount,
    isAvailable
  } = bus;
  
  const handleViewDetails = () => {    
    navigate(`/buses/${_id}?routeId=${routeId}&fromStopId=${fromStopId}&toStopId=${toStopId}&arrivalTime=${encodeURIComponent(arrivalTime)}`); 
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-card overflow-hidden transition-transform hover:translate-y-[-2px] ${!isAvailable ? 'opacity-60' : ''}`}>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
          <div className="mb-2 md:mb-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
              {busName}
              {!isAvailable && (
                <span className="ml-2 inline-block px-2 py-0.5 bg-danger/10 text-danger text-xs rounded-full">
                  Unavailable
                </span>
              )}
            </h2>
            <p className="text-secondary-600 text-sm">{busNumber}</p>
          </div>
          
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
            <div className="flex items-center">
              <Rating value={averageRating} readOnly />
              <span className="ml-1 text-secondary-600 text-xs sm:text-sm">({reviewCount})</span>
            </div>
            
            {isAvailable && (
              <div className="md:ml-4 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-success/10 text-success">
                Available
              </div>
            )}
          </div>
        </div>
        
        {/* Journey information with visual flow */}
        <div className="grid grid-cols-3 gap-1 sm:gap-4 mb-3 sm:mb-4 relative">
          <div className="flex flex-col">
            <span className="text-secondary-600 text-xs sm:text-sm">Departure</span>
            <span className="font-semibold text-base sm:text-lg">{formatTime(arrivalTime)}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-secondary-600 text-xs sm:text-sm">Duration</span>
            <div className="flex items-center">
              <span className="font-semibold text-base sm:text-lg">{formatDuration(duration)}</span>
            </div>
            
            {/* Journey visualization - improved for small screens */}
            <div className="relative w-full mt-1 sm:mt-2">
              <div className="border-t-2 border-dashed border-secondary-300 w-full absolute top-1/2 transform -translate-y-1/2"></div>
              <div className="absolute left-0 -top-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary-500"></div>
              <div className="absolute right-0 -top-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary-500"></div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-secondary-600 text-xs sm:text-sm">Arrival</span>
            <span className="font-semibold text-base sm:text-lg">{formatTime(destinationTime)}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-secondary-100">
          <div className="mb-3 sm:mb-0 flex items-center">
            <span className="text-secondary-600 mr-2 text-sm">Fare:</span>
            <span className="text-lg sm:text-xl font-bold text-primary-600">{formatCurrency(fare)}</span>
          </div>
          
          <button
            onClick={handleViewDetails}
            // aria-label={isAvailable ? "View bus details" : "Bus not available"}
            className="px-4 py-2 rounded-md text-white font-medium transition-colors w-full sm:w-auto bg-primary-500 hover:bg-primary-600">
            View Details
          </button>
          {/* <button
            onClick={handleViewDetails}
            // disabled={!isAvailable}
            aria-label={isAvailable ? "View bus details" : "Bus not available"}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors w-full sm:w-auto 
              ${
              isAvailable 
                ? 'bg-primary-500 hover:bg-primary-600' 
                : 'bg-secondary-400 cursor-not-allowed'
            }
            `
          }
          >
            {isAvailable ? 'View Details' : 'Not Available'}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default BusCard;