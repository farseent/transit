// BusListPage.jsx (Updated with Filters)
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BusList from '../components/busList/BusList';
import BusFilters from '../components/busList/BusFilters'; // Import the new filter component
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { useSearch } from '../context/SearchContext';

const BusListPage = () => {
  const { searchResults, loading, error, performSearch } = useSearch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (searchParams.toString()) {
      const params = {
        routeId: searchParams.get('routeId'),
        fromStopId: searchParams.get('fromStopId'),
        toStopId: searchParams.get('toStopId')
      };
      performSearch(params);
    }    
  }, [searchParams]);

  // Update filtered buses whenever search results update
  useEffect(() => {
    if (searchResults.buses && searchResults.buses.length > 0) {
      setFilteredBuses(searchResults.buses);
    }
  }, [searchResults.buses]);

  const routeId = searchParams.get('routeId');
  const fromStopId = searchParams.get('fromStopId');
  const toStopId = searchParams.get('toStopId');
  
  // Handle filter changes from the BusFilters component
  const handleFiltersChange = (filters) => {
    setIsFiltering(true);
    
    if (!searchResults.buses || searchResults.buses.length === 0) {
      setIsFiltering(false);
      return;
    }

    // Apply filters to the original data
    let filtered = [...searchResults.buses];

    // Filter by departure time
    if (filters.departureTime.min && filters.departureTime.max) {
      filtered = filtered.filter(bus => {
        return bus.arrivalTime >= filters.departureTime.min && bus.arrivalTime <= filters.departureTime.max;
      });
    }

    // Filter by rating
    filtered = filtered.filter(bus => {
      return bus.averageRating >= filters.rating.min && bus.averageRating <= filters.rating.max;
    });

    // Filter by fare
    // filtered = filtered.filter(bus => {
    //   return bus.fare >= filters.fare.min && bus.fare <= filters.fare.max;
    // });

    // Filter by availability
    if (filters.availability === 'available') {
      filtered = filtered.filter(bus => bus.isAvailable);
    }

    // Sort the results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'fare':
          return a.fare - b.fare;
        case 'fareDesc':
          return b.fare - a.fare;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'duration':
          return a.duration - b.duration;
        case 'arrivalTime':
        default:
          return a.arrivalTime.localeCompare(b.arrivalTime);
      }
    });

    setFilteredBuses(filtered);
    setIsFiltering(false);
  };
  
  const handleBackToSearch = () => navigate('/');

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Available Buses</h1>
        <button 
          onClick={handleBackToSearch}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
          aria-label="Back to search form"
        >
          Back to Search
        </button>
      </div>
      
      {/* Search Summary Card */}
      <div className="bg-white rounded-lg shadow-card p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <span className="text-secondary-600 mr-2 text-sm sm:text-base">Route:</span>
            <span className="font-medium">{searchResults.routeName || 'Loading...'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <span className="text-secondary-600 mr-2 text-sm sm:text-base min-w-10">From:</span>
              <span className="font-medium">{searchResults.fromStopName || 'Loading...'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-secondary-600 mr-2 text-sm sm:text-base min-w-10">To:</span>
              <span className="font-medium">{searchResults.toStopName || 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Component - Add only when there are buses to filter */}
      {!loading && !error && searchResults.buses && searchResults.buses.length > 0 && (
        <BusFilters 
          buses={searchResults.buses} 
          onFiltersChange={handleFiltersChange} 
        />
      )}
      
      {/* Results Section with Better Status Feedback */}
      {loading || isFiltering ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader />
          <p className="mt-4 text-secondary-600">
            {loading ? 'Finding the best buses for you...' : 'Applying filters...'}
          </p>
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : filteredBuses.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-card p-4">
          <svg className="w-16 h-16 mx-auto text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg sm:text-xl text-secondary-600 mt-4">
            {searchResults.buses && searchResults.buses.length > 0 
              ? 'No buses match your filter criteria.' 
              : 'No buses found for this route and stops.'}
          </p>
          <p className="text-secondary-500 mt-2">
            {searchResults.buses && searchResults.buses.length > 0 
              ? 'Try adjusting your filters.'
              : 'Try changing your search criteria.'}
          </p>
          <button 
            onClick={handleBackToSearch}
            className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Try a different search
          </button>
        </div>
      ) : (
        <>
          {/* Result count indicator */}
          <div className="mb-3 text-secondary-600">
            <p>
              {filteredBuses.length} {filteredBuses.length === 1 ? 'bus' : 'buses'} found
              {searchResults.buses && filteredBuses.length !== searchResults.buses.length && 
                ` (filtered from ${searchResults.buses.length})`}
            </p>
          </div>
          <BusList 
            buses={filteredBuses} 
            routeId={routeId} 
            fromStopId={fromStopId} 
            toStopId={toStopId} 
          />
        </>
      )}
    </div>
  );
};

export default BusListPage;