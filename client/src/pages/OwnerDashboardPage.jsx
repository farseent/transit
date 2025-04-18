// pages/OwnerDashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import busApi from '../api/busApi';
import BusCard from '../components/owner/BusCard';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';

const OwnerDashboardPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'unavailable'
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        console.log("[DEBUG] Starting fetch...");
        const data = await busApi.getOwnerBuses();
        console.log('[DEBUG] Received data', data);
        
        if (!Array.isArray(data)) {
          console.error("[ERROR] Expected array but got:", typeof data);
          throw new Error("Invalid data format");
        }
        
        setBuses(data);
      } catch (err) {
        console.error("[ERROR] Fetch failed:", err);
        setError(err.message || 'Failed to fetch buses');
      } finally {
        setLoading(false);
      }
    };
   
    fetchBuses();
  }, []);

  const handleToggleAvailability = async (busId) => {
    try {
      setLoading(true);
      const updatedBus = await busApi.toggleBusAvailability(busId);
      setBuses(buses.map(bus =>
        bus._id === updatedBus._id ? updatedBus : bus
      ));
      
      // Show success feedback
      setError({ type: 'success', message: `Bus ${updatedBus.name} status updated successfully!` });
      
      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError({ type: 'error', message: err.message || 'Failed to update bus availability' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (busId) => {
    navigate(`/bus/${busId}`);
  };

  // Filter buses based on status and search term
  const filteredBuses = buses.filter(bus => {
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'available' && bus.isAvailable) || 
      (filterStatus === 'unavailable' && !bus.isAvailable);
      
    const matchesSearch = 
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bus.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.route?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchesFilter && matchesSearch;
  });

  if (loading && buses.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-blue-600 text-white p-6 mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="mt-2 opacity-80">Manage your bus fleet</p>
          <div className="flex items-center mt-4">
            <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold mr-3">
              {user?.name?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'Owner'}</p>
              <p className="text-sm opacity-80">{user?.email || 'owner@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Filters and search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'all' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                All Buses
              </button>
              <button 
                onClick={() => setFilterStatus('available')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'available' 
                    ? 'bg-green-100 text-green-700 font-medium' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Available
              </button>
              <button 
                onClick={() => setFilterStatus('unavailable')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'unavailable' 
                    ? 'bg-red-100 text-red-700 font-medium' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Unavailable
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search buses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Alerts */}
        {error && (
          <Alert 
            type={error.type || "error"} 
            message={error.message} 
            className="mb-6" 
          />
        )}
        
        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Total Buses</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{buses.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Available</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {buses.filter(bus => bus.isAvailable).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Unavailable</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {buses.filter(bus => !bus.isAvailable).length}
            </p>
          </div>
        </div>
        
        {/* Bus cards */}
        <h2 className="text-xl font-semibold mb-4">My Buses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map(bus => (
            <BusCard
              key={bus._id}
              bus={bus}
              onToggleAvailability={handleToggleAvailability}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
        
        {filteredBuses.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            {searchTerm || filterStatus !== 'all' ? (
              <div>
                <p className="text-gray-500 text-lg">No buses match your search criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="mt-3 text-blue-500 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-lg">You don't have any buses registered yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;