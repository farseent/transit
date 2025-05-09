// BusList.jsx (Updated)
import React from 'react';
import BusCard from './BusCard';

const BusList = ({ buses, routeId, fromStopId, toStopId }) => {
  if (!buses || buses.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-card">
        <p className="text-secondary-600">No buses found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 transition-all"> 
      {buses.map((bus) => (
        <BusCard 
          key={`${bus._id}-${bus.arrivalTime}`}
          bus={bus}
          routeId={routeId} 
          fromStopId={fromStopId}
          toStopId={toStopId}
        />
      ))}
    </div>
  );
};

export default BusList;