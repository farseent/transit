import React from 'react';
import Rating from '../common/Rating';
import { Clock, DollarSign, MapPin, Bus, Star } from 'lucide-react';

const BusInfo = ({ bus }) => {
  return (
    <div className="bg-white shadow-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-primary-600">{bus.routeName}</h1>
        <div className="flex items-center">
          <Star className="text-yellow-500 mr-2" />
          <span className="text-lg font-semibold">{bus.averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-2">({bus.totalReviews} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <MapPin className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">From Stop</p>
            <p className="text-gray-700">{bus.fromStop}</p>
          </div>
        </div>
        <div className="flex items-center">
          <MapPin className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">To Stop</p>
            <p className="text-gray-700">{bus.toStop}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Clock className="text-primary-500 mr-2" />
          <div>
            <p className="font-medium">Arrival Time</p>
            <p className="text-gray-700">{bus.arrivalTime}</p>
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="text-success mr-2" />
          <div>
            <p className="font-medium">Fare</p>
            <p className="text-gray-700">₹{bus.fare}</p>
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
            <p className="text-gray-700">{bus.journeyDuration}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusInfo;