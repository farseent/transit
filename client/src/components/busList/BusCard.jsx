//BusCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '../common/Rating';
import { formatTime, formatDuration, formatCurrency } from '../../utils/formatters';

const BusCard = ({ bus, fromStop, toStop }) => {
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
    navigate(`/bus/${_id}?fromStop=${fromStop}&toStop=${toStop}`);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-card overflow-hidden transition-transform hover:translate-y-[-2px] ${!isAvailable ? 'opacity-60' : ''}`}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="mb-2 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800">{busName}</h2>
            <p className="text-secondary-600">{busNumber}</p>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Rating value={averageRating} readOnly />
              <span className="ml-2 text-secondary-600">({reviewCount} reviews)</span>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-secondary-600 text-sm">Departure</span>
            <span className="font-semibold text-lg">{formatTime(arrivalTime)}</span>
            <span className="text-secondary-500 text-sm">{fromStop}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-secondary-600 text-sm">Duration</span>
            <div className="flex items-center mt-1">
              <span className="font-semibold text-lg">{formatDuration(duration)}</span>
            </div>
            <div className="relative w-full mt-2 hidden md:block">
              <div className="border-t-2 border-dashed border-secondary-300 w-full absolute top-1/2 transform -translate-y-1/2"></div>
              <div className="absolute left-0 -top-1 w-3 h-3 rounded-full bg-primary-500"></div>
              <div className="absolute right-0 -top-1 w-3 h-3 rounded-full bg-primary-500"></div>
            </div>
          </div>
          
          <div className="flex flex-col text-right">
            <span className="text-secondary-600 text-sm">Arrival</span>
            <span className="font-semibold text-lg">{formatTime(destinationTime)}</span>
            <span className="text-secondary-500 text-sm">{toStop}</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-secondary-100">
          <div className="mb-3 md:mb-0">
            <span className="text-secondary-600 mr-2">Fare:</span>
            <span className="text-xl font-bold text-primary-600">{formatCurrency(fare)}</span>
          </div>
          
          <button
            onClick={handleViewDetails}
            disabled={!isAvailable}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              isAvailable 
                ? 'bg-primary-500 hover:bg-primary-600' 
                : 'bg-secondary-400 cursor-not-allowed'
            }`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;