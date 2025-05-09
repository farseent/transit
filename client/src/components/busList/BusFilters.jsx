// BusFilters.jsx
import React, { useState, useEffect } from 'react';

const BusFilters = ({ buses, onFiltersChange }) => {
  // Filter states
  const [departureTime, setDepartureTime] = useState({ min: '', max: '' });
  const [rating, setRating] = useState({ min: 0, max: 5 });
//   const [fare, setFare] = useState({ min: 0, max: 1000 });
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('arrivalTime');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize min/max values based on data
  useEffect(() => {
    if (buses && buses.length > 0) {
      // Find min/max departure times
      const times = buses.map(bus => bus.arrivalTime);
      const minTime = times.reduce((a, b) => a < b ? a : b);
      const maxTime = times.reduce((a, b) => a > b ? a : b);
      
      // Find min/max fares
    //   const fares = buses.map(bus => bus.fare);
    //   const minFare = Math.min(...fares);
    //   const maxFare = Math.max(...fares);
      
      setDepartureTime({ min: minTime, max: maxTime });
    //   setFare({ min: minFare, max: maxFare });
    }
  }, [buses]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [departureTime, rating, availability, sortBy]);

  const applyFilters = () => {
    onFiltersChange({
      departureTime,
      rating,
    //   fare,
      availability,
      sortBy
    });
  };

  const resetFilters = () => {
    if (buses && buses.length > 0) {
      const times = buses.map(bus => bus.arrivalTime);
      const minTime = times.reduce((a, b) => a < b ? a : b);
      const maxTime = times.reduce((a, b) => a > b ? a : b);
      
    //   const fares = buses.map(bus => bus.fare);
    //   const minFare = Math.min(...fares);
    //   const maxFare = Math.max(...fares);
      
      setDepartureTime({ min: minTime, max: maxTime });
      setRating({ min: 0, max: 5 });
    //   setFare({ min: minFare, max: maxFare });
      setAvailability('all');
      setSortBy('arrivalTime');
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-card mb-4 overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 sm:p-4 cursor-pointer bg-secondary-50"
        onClick={toggleFilters}
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-800">Filter & Sort</h3>
        </div>
        <svg 
          className={`w-5 h-5 text-secondary-600 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      {showFilters && (
        <div className="p-4 border-t border-secondary-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Departure Time Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-600">Departure Time</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={departureTime.min}
                  onChange={(e) => setDepartureTime({...departureTime, min: e.target.value})}
                  className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <span className="text-secondary-500 self-center">to</span>
                <input
                  type="time"
                  value={departureTime.max}
                  onChange={(e) => setDepartureTime({...departureTime, max: e.target.value})}
                  className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-600">Rating</label>
              <div className="flex space-x-2">
                <select
                  value={rating.min}
                  onChange={(e) => setRating({...rating, min: Number(e.target.value)})}
                  className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="0">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
                <span className="text-secondary-500 self-center">to</span>
                <select
                  value={rating.max}
                  onChange={(e) => setRating({...rating, max: Number(e.target.value)})}
                  className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </div>
            </div>
            
            {/* Fare Filter */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-600">Fare (₹)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  value={fare.min}
                  onChange={(e) => setFare({...fare, min: Number(e.target.value)})}
                  className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <span className="text-secondary-500 self-center">to</span>
                <input
                  type="number"
                  min="0"
                  value={fare.max}
                  onChange={(e) => setFare({...fare, max: Number(e.target.value)})}
                  className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div> */}
            
            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-600">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Buses</option>
                <option value="available">Available Only</option>
              </select>
            </div>
            
            {/* Sort By */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-600">Sort By</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="arrivalTime">Departure Time</option>
                <option value="fare">Fare: Low to High</option>
                <option value="fareDesc">Fare: High to Low</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
              </select>
            </div> */}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-800 mr-2"
            >
              Reset Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusFilters;