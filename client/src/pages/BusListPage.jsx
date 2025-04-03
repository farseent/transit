import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BusList from '../components/busList/BusList';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { searchBuses } from '../api/searchApi';

const BusListPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract search params from URL
  const searchParams = new URLSearchParams(location.search);
  const routeId = searchParams.get('routeId');
  const fromStop = searchParams.get('fromStop');
  const toStop = searchParams.get('toStop');
  
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate required params
        if (!routeId || !fromStop || !toStop) {
          throw new Error('Missing required search parameters');
        }
        
        const busesData = await searchBuses(routeId, fromStop, toStop);
        setBuses(busesData);
      } catch (err) {
        console.error('Failed to fetch buses:', err);
        setError(err.message || 'Failed to load buses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuses();
  }, [routeId, fromStop, toStop]);
  
  const handleBackToSearch = () => {
    navigate('/');
  };
  
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
      
      <div className="bg-white rounded-lg shadow-card p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-2 md:mb-0">
            <span className="text-secondary-600 mr-2">Route:</span>
            <span className="font-medium">{routeId}</span>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-secondary-600 mr-2">From:</span>
              <span className="font-medium">{fromStop}</span>
            </div>
            <div>
              <span className="text-secondary-600 mr-2">To:</span>
              <span className="font-medium">{toStop}</span>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : buses.length === 0 ? (
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
        <BusList buses={buses} fromStop={fromStop} toStop={toStop} />
      )}
    </div>
  );
};

export default BusListPage;