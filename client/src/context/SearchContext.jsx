// src/context/SearchContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { searchBuses } from '../api/searchApi';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    routeId: '',
    fromStopId: '',
    toStopId: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// src/context/SearchContext.jsx - update the performSearch function

const performSearch = async (params) => {
  try {
    setLoading(true);
    setError(null);
    
    const updatedParams = params || searchParams;
    setSearchParams(updatedParams);
    
    console.log('Search params:', updatedParams);
    // Correctly pass the individual parameters instead of the whole object
    const results = await searchBuses(updatedParams);

    setSearchResults(results);
    // Navigate with URL parameters
    navigate(`/buses?routeId=${params.routeId}&fromStopId=${params.fromStopId}&toStopId=${params.toStopId}`);
    return results;
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
      fromStop: '',
      toStop: '',
    });
    setSearchResults([]);
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