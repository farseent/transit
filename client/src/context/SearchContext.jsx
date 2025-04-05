//SearchContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { searchBuses } from '../api/searchApi';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    routeId: '',
    fromStopId: '',
    toStopId: '',
  });
  const [searchResults, setSearchResults] = useState({
    buses: [],
    routeName: '',
    fromStopName: '',
    toStopName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const performSearch = async (params) => {
    try {
      setLoading(true);
      setError(null);
      
    // Ensure we're using the correct parameter names
    const searchParams = {
      routeId: params.routeId,
      fromStopId: params.fromStopId || params.fromStop,
      toStopId: params.toStopId || params.toStop
    };
    
    setSearchParams(searchParams);
    
    const results = await searchBuses(searchParams);
    
    setSearchResults({
      buses: results.buses,
      routeName: results.routeName,
      fromStopName: results.fromStopName,
      toStopName: results.toStopName
    });
    
    navigate(`/buses?routeId=${searchParams.routeId}&fromStopId=${searchParams.fromStopId}&toStopId=${searchParams.toStopId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed'); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      routeId: '',
      fromStopId: '',
      toStopId: '',
    });
    setSearchResults({
      buses: [],
      routeName: '',
      fromStopName: '',
      toStopName: ''
    });
  };

  const value = {
    searchParams,
    searchResults,
    loading,
    error,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};