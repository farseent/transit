import React from 'react';
import { Clock, DollarSign, MapPin, Bus, Star } from 'lucide-react';

const BusInfo = ({ bus }) => {
  console.log('bus data in busInfo:', bus);

  // Helper function to render star ratings
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        <Star className="text-yellow-500 mr-1" size={18} />
        <span>{rating?.toFixed(1) ?? 'N/A'}</span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-card rounded-lg p-6">
      {/* Bus name */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-primary-600">{bus.name}</h1>
        <p className="text-gray-600 text-sm">Reg No: {bus.regNumber}</p>
      </div>

      {/* Overall Rating Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Star className="text-yellow-500 mr-2" size={24} />
          <span className="text-lg font-semibold">{bus?.ratings?.overall?.toFixed(1) ?? 'N/A'}</span>
          <span className="text-gray-500 ml-2">({bus?.ratingCounts?.overall ?? 0} reviews)</span>
        </div>
        
        {/* Categorized Ratings */}
        <div className="bg-gray-50 p-4 rounded-md mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rating Categories</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cleanliness</span>
              {renderStarRating(bus?.ratings?.cleanliness)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Punctuality</span>
              {renderStarRating(bus?.ratings?.punctuality)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Staff Behavior</span>
              {renderStarRating(bus?.ratings?.staffBehavior)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Comfort</span>
              {renderStarRating(bus?.ratings?.comfort)}
            </div>
          </div>
        </div>
      </div>

      {/* Stops Placeholder — if not present in bus, keep fallback */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <MapPin className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">From Stop</p>
            <p className="text-gray-700">{bus.fromStop || 'Not available'}</p>
          </div>
        </div>
        <div className="flex items-center">
          <MapPin className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">To Stop</p>
            <p className="text-gray-700">{bus.toStop || 'Not available'}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Clock className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">Arrival Time</p>
            <p className="text-gray-700">{bus.arrivalTime || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="text-success mr-2" />
          <div>
            <p className="font-medium">Fare</p>
            <p className="text-gray-700">₹{bus.fare ?? 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Bus className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">Availability</p>
            <p className={`font-semibold ${bus.isAvailable ? 'text-success' : 'text-danger'}`}>
              {bus.isAvailable ? 'Available' : 'Unavailable'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">Journey Duration</p>
            <p className="text-gray-700">{bus.journeyDuration || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusInfo;