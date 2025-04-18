import React, { useState, useEffect } from 'react';

const SearchForm = ({ stops, routeId, onSearch }) => {
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [availableToStops, setAvailableToStops] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when route changes
  useEffect(() => {
    setFromStop('');
    setToStop('');
    setError('');
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
      // Reset destination if departure is cleared
      if (toStop) {
        setToStop('');
      }
    }
    // Don't check toStop validity here - this was causing the infinite loop
  }, [fromStop, stops]);

  // Reset toStop if it becomes invalid (separate effect to avoid loop)
  useEffect(() => {
    if (fromStop && toStop) {
      const isValidDestination = availableToStops.some(stop => stop._id === toStop);
      if (!isValidDestination && availableToStops.length > 0) {
        setToStop('');
      }
    }
  }, [availableToStops, fromStop, toStop]);

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
    
    setError('');
    setIsSubmitting(true);
    
    try {
      onSearch({
        routeId,
        fromStop,
        toStop 
      });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedStopName = (stopId) => {
    const stop = stops.find(s => s._id === stopId);
    return stop ? stop.name : '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="fromStop" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          From
        </label>
        <div className="relative">
          <select
            id="fromStop"
            name="fromStop"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-3 pr-10 py-2 text-base transition-colors duration-200"
            value={fromStop}
            onChange={(e) => setFromStop(e.target.value)}
            required
          >
            <option value="">-- Select Departure Stop --</option>
            {stops.map((stop) => (
              <option key={stop._id} value={stop._id}>
                {stop.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            {/* <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> */}
              {/* <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> */}
            {/* </svg> */}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="toStop" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          To
        </label>
        <div className="relative">
          <select
            id="toStop"
            name="toStop"
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-3 pr-10 py-2 text-base transition-colors duration-200 ${!fromStop ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            value={toStop}
            onChange={(e) => setToStop(e.target.value)}
            disabled={!fromStop || availableToStops.length === 0}
            required
          >
            <option value="">-- Select Destination Stop --</option>
            {availableToStops.map((stop) => (
              <option key={stop._id} value={stop._id}>
                {stop.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            {/* <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> */}
              {/* <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> */}
            {/* </svg> */}
          </div>
        </div>
        {fromStop && availableToStops.length === 0 && (
          <p className="mt-2 text-sm text-warning">No destination stops available for this route.</p>
        )}
      </div>

      {fromStop && toStop && (
        <div className="p-3 bg-primary-50 rounded-md mb-6 flex items-center text-sm">
          <svg className="w-5 h-5 mr-2 text-primary-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            You're looking for buses from <span className="font-medium">{getSelectedStopName(fromStop)}</span> to <span className="font-medium">{getSelectedStopName(toStop)}</span>
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-sm text-red-600 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!fromStop || !toStop || isSubmitting}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Buses
          </>
        )}
      </button>
    </form>
  );
};

export default SearchForm;