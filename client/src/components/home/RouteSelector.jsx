// src/components/home/RouteSelector.jsx
import React from 'react';

const RouteSelector = ({ routes, selectedRoute, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <svg className="w-4 h-4 mr-1 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Select Route
      </label>
      <div className="relative">
        <select
          id="route"
          name="route"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-3 pr-10 py-2 text-base bg-white transition-colors duration-200"
          value={selectedRoute}
          onChange={(e) => onChange(e.target.value)}
          required
        >
          <option value="">-- Select a Route --</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.name} 
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          {/* <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> */}
            {/* <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> */}
          {/* </svg> */}
        </div>
      </div>
      {routes.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">No routes available</p>
      )}
    </div>
  );
};

export default RouteSelector;
