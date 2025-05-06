import React from 'react';
import { Clock, DollarSign, MapPin, Bus as BusIcon, Star } from 'lucide-react';
import { formatTime, formatDuration, formatCurrency } from '../../utils/formatters';

const BusInfo = ({ bus, fromStop, toStop }) => {
    
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        <Star className="text-yellow-500 mr-1" size={16} />
        <span className="font-medium">{rating?.toFixed(1) ?? 'N/A'}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Bus basic info */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-600">Registration</div>
          <div className="font-medium">{bus.regNumber}</div>
        </div>
      </div>
      
      {/* Rating overview */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Star size={24} className="text-yellow-500" />
          <span className="text-xl font-bold">{bus?.ratings?.overall?.toFixed(1) ?? 'N/A'}</span>
          <span className="text-gray-500">from {bus?.ratingCounts?.overall ?? 0} reviews</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-2 rounded border border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-700">Cleanliness</span>
            {renderStarRating(bus?.ratings?.cleanliness)}
          </div>
          <div className="bg-white p-2 rounded border border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-700">Punctuality</span>
            {renderStarRating(bus?.ratings?.punctuality)}
          </div>
          <div className="bg-white p-2 rounded border border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-700">Staff</span>
            {renderStarRating(bus?.ratings?.staffBehavior)}
          </div>
          <div className="bg-white p-2 rounded border border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-700">Comfort</span>
            {renderStarRating(bus?.ratings?.comfort)}
          </div>
        </div>
      </div>
      
      {/* Journey details */}
      <div className="border-t border-b border-gray-200 py-4">
        <div className="flex items-start mb-4">
          <div className="w-10 mt-1">
            <div className="h-10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary-500 ring-4 ring-primary-100"></div>
            </div>
            <div className="h-12 flex justify-center">
              <div className="w-0.5 bg-gray-300 h-full"></div>
            </div>
            <div className="h-10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary-700 ring-4 ring-primary-100"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-sm text-gray-500">From</div>
              <div className="font-medium text-lg">{fromStop?.name || 'Not available'}</div>
              <div className="text-primary-600 font-semibold">{formatTime(bus.arrivalTime) || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">To</div>
              <div className="font-medium text-lg">{toStop?.name || 'Not available'}</div>
              <div className="text-primary-600 font-semibold">{formatTime(bus.destinationTime) || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">Journey Duration</div>
          <div className="font-medium flex items-center gap-1">
            <Clock size={16} className="text-primary-600" />
            {formatDuration(bus.duration) || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Fare</div>
          <div className="font-medium flex items-center gap-1">
            <DollarSign size={16} className="text-success" />
            {formatCurrency(bus.fare) || 'N/A'} 
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Availability</div>
          <div className={`font-medium flex items-center gap-1 ${bus.isAvailable ? 'text-success' : 'text-danger'}`}>
            <BusIcon size={16} />
            {bus.isAvailable ? 'Available' : 'Unavailable'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Route</div>
          <div className="font-medium flex items-center gap-1">
            <MapPin size={16} className="text-primary-600" />
            {bus.route?.name || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusInfo;