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
    if (!searchResults.buses.length && searchParams.toString()) {
      const params = {
        routeId: searchParams.get('routeId'),
        fromStopId: searchParams.get('fromStopId'),
        toStopId: searchParams.get('toStopId')
      };
      performSearch(params);
    }
  }, [searchParams]);
  
  const handleBackToSearch = () => navigate('/');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Available Buses</h1>
        <button 
          onClick={handleBackToSearch}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          Back to Search
        </button>
      </div>
      
      {/* Search Summary Card */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-2 md:mb-0">
            <span className="text-secondary-600 mr-2">Route:</span>
            <span className="font-medium">{searchResults.routeName}</span>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-secondary-600 mr-2">From:</span>
              <span className="font-medium">{searchResults.fromStopName}</span>
            </div>
            <div>
              <span className="text-secondary-600 mr-2">To:</span>
              <span className="font-medium">{searchResults.toStopName}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : searchResults.buses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-secondary-600">No buses found for this route and stops.</p>
          <button 
            onClick={handleBackToSearch}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Try a different search
          </button>
        </div>
      ) : (
        <BusList buses={searchResults.buses} />
      )}
    </div>
  );
};

export default BusListPage;