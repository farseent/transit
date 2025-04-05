// src/components/home/SearchForm.jsx
import React, { useState, useEffect } from 'react';

const SearchForm = ({ stops, routeId, onSearch }) => {
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [availableToStops, setAvailableToStops] = useState([]);
  const [error, setError] = useState('');

  // Reset form when route changes
  useEffect(() => {
    setFromStop('');
    setToStop('');
  }, [routeId]);

  // Update available destination stops based on selected from-stop
  useEffect(() => {
    if (fromStop) {
      const selectedStopIndex = stops.findIndex(stop => stop._id === fromStop);
      if (selectedStopIndex >= 0) {
        // Only show stops that come after the selected from-stop
        setAvailableToStops(stops.slice(selectedStopIndex + 1));
      }
    } else {
      setAvailableToStops([]);
    }
  }, [fromStop, stops]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!fromStop || !toStop) {
      setError('Please select both departure and destination stops.');
      return;
    }

    if (fromStop === toStop) {
      setError('Departure and destination stops cannot be the same.');
      return;
    }
    console.log('Form values before submit:', { 
      routeId, 
      fromStop, 
      toStop,
    });
    setError('');
    onSearch({
      routeId,
      fromStop,  // Change fromStop to fromStopId
      toStop       // Change toStop to toStopId
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="fromStop" className="block text-sm font-medium text-gray-700 mb-2">
          From
        </label>
        <select
          id="fromStop"
          name="fromStop"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={fromStop}
          onChange={(e) => setFromStop(e.target.value)}
          required
        >
          <option value="">-- Select Departure Stop --</option>
          {stops.map((stop, index) => (
            <option key={stop._id} value={stop._id}>
              {stop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="toStop" className="block text-sm font-medium text-gray-700 mb-2">
          To
        </label>
        <select
          id="toStop"
          name="toStop"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={toStop}
          onChange={(e) => setToStop(e.target.value)}
          disabled={!fromStop}
          required
        >
          <option value="">-- Select Destination Stop --</option>
          {availableToStops.map((stop) => (
            <option key={stop._id} value={stop._id}>
              {stop.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={!fromStop || !toStop}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Search Buses
      </button>
    </form>
  );
};

export default SearchForm;