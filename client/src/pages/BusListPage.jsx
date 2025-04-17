//BusListPage.jsx

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BusList from '../components/busList/BusList';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { useSearch } from '../context/SearchContext';

const BusListPage = () => {
  const { searchResults, loading, error, performSearch } = useSearch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const routeId = searchParams.get('routeId');
  const fromStopId = searchParams.get('fromStopId');
  const toStopId = searchParams.get('toStopId');
  
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
      
      {/* Search Summary Card - Improved for responsiveness */}
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
      
      {/* Results Section with Better Status Feedback */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader />
          <p className="mt-4 text-secondary-600">Finding the best buses for you...</p>
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : searchResults.buses && searchResults.buses.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-card p-4">
          <svg className="w-16 h-16 mx-auto text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg sm:text-xl text-secondary-600 mt-4">No buses found for this route and stops.</p>
          <p className="text-secondary-500 mt-2">Try changing your search criteria.</p>
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
            <p>{searchResults.buses && searchResults.buses.length} {searchResults.buses && searchResults.buses.length === 1 ? 'bus' : 'buses'} found</p>
          </div>
          <BusList buses={searchResults.buses || []} routeId={routeId} fromStopId={fromStopId} toStopId={toStopId} />
        </>
      )}
    </div>
  );
};

export default BusListPage;