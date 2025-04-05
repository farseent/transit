//BusList.jsx

import React from 'react';
import BusCard from './BusCard';

const BusList = ({ buses, fromStop, toStop }) => {
  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <BusCard 
          key={bus._id} 
          bus={bus} 
          fromStop={fromStop}
          toStop={toStop}
        />
      ))}
    </div>
  );
};

export default BusList;