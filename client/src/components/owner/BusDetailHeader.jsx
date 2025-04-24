// src/components/owner/BusDetailHeader.jsx
import React from 'react';

const BusDetailHeader = ({ bus }) => {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{bus.name}</h2>
          <p className="text-gray-600">Registration: {bus.regNumber}</p>
          <p className="text-gray-600">Route: {bus.route?.name || 'Not assigned'}</p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-medium ${bus.isAvailable ? 'text-success' : 'text-danger'}`}>
            {bus.isAvailable ? 'Available' : 'Not Available'}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Schedules</h3>
        {bus.schedules && bus.schedules.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {bus.schedules.map((schedule, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                {schedule.departureTime}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No schedules set for this bus.</p>
        )}
      </div>
    </div>
  );
};

export default BusDetailHeader;