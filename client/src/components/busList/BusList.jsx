//BusList.jsx

import React from 'react';
import BusCard from './BusCard';

const BusList = ({ buses, fromStopId, toStopId }) => {

  return (
    <div className="space-y-4"> 
      {buses.map((bus) => (
        <BusCard 
          key={bus._id} 
          bus={bus} 
          fromStopId={fromStopId}
          toStopId={toStopId}
        />
      ))}
    </div>
  );
};

export default BusList;