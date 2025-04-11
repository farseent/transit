//BusList.jsx

import React from 'react';
import BusCard from './BusCard';

const BusList = ({ buses, routeId, fromStopId, toStopId }) => {

  return (
    <div className="space-y-4"> 
      {buses.map((bus) => (
        <BusCard 
          key={bus._id} 
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