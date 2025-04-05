// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import RouteSelector from '../components/home/RouteSelector';
import SearchForm from '../components/home/SearchForm';
import { getAllRoutes } from '../api/routeApi';

const HomePage = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { performSearch } = useSearch();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await getAllRoutes();
        console.log('routes:',data);
        setRoutes(data);
      } catch (err) {
        setError('Failed to load routes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      setStops(selectedRoute.stops || []);
    } else {
      setStops([]);
    }
  }, [selectedRoute]);

  const handleRouteChange = (routeId) => {
    const route = routes.find(r => r._id === routeId);
    setSelectedRoute(route);
  };

  const handleSearch = async (searchData) => {
    try {
      // Update URL first to trigger SearchContext's useEffect
      navigate(`/buses?routeId=${searchData.routeId}&fromStopId=${searchData.fromStop}&toStopId=${searchData.toStop}`);
      // Then perform the search (will be handled by SearchContext from URL params)
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            <span className="text-primary-500">Transit</span> Hub
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl">
            Find the perfect bus for your journey.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white shadow-card rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Bus</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <RouteSelector 
                  routes={routes} 
                  selectedRoute={selectedRoute?._id || ''} 
                  onChange={handleRouteChange} 
                />
                
                {selectedRoute && (
                  <SearchForm 
                    stops={stops} 
                    routeId={selectedRoute._id}
                    onSearch={handleSearch} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;