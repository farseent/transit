// src/components/home/RouteSelector.jsx
import React from 'react';

const RouteSelector = ({ routes, selectedRoute, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-2">
        Select Route
      </label>
      <select
        id="route"
        name="route"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
    </div>
  );
};

export default RouteSelector;